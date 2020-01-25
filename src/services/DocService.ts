import { join } from 'path'
import { readFileSync } from 'fs'

import { KlasaGuild } from 'klasa'
import { oneLine } from 'common-tags'
import * as HJSON from 'hjson'
// @ts-ignore 80003
import * as Lunr from 'lunr'
import { v4 as uuid } from 'uuid'

import '@schemas/APISchema'
import '@schemas/DocSchema'
import Service from '@structures/Service'
import { PATHS } from '@libraries/constants'
import { APISettings } from '@settings/APISettings'
import { DocSettings } from '@settings/DocSettings'
import { I18n } from '@libraries/types/I18n'

const {
  Services: { Doc: Language },
  Misc,
} = I18n

/**
 * The DocService is responsible for any and all things
 * relating to APi and docs/guide lookups.
 */
export default class DocService extends Service {
  /**
   * Where are the API definition files stored?
   */
  static API_DEFINITION_PATH = join(PATHS.DATA, 'api')

  /**
   * Where are the docs/guide definition files stored?
   */
  static GUIDE_DEFINITION_PATH = join(PATHS.DATA, 'docs')

  /**
   * Where are the git submodules for the official repositories stored?
   */
  static GIT_SUBMODULE_PATH = join(PATHS.BASE, 'packages')

  /**
   * The API/guide entries.
   */
  private entities: Entities = {
    [EntityType.API]: [],
    [EntityType.GUIDE]: [],
  }

  /**
   * The alias maps.
   */
  private aliases: Aliases = {
    [EntityType.API]: {},
    [EntityType.GUIDE]: {},
  }

  /**
   * The Lunr search indexes.
   */
  private indexes: Indexes = {
    [EntityType.API]: null,
    [EntityType.GUIDE]: null,
  }

  async init() {
    for (const api of Object.values(KnownAPIs)) {
      this.entities[EntityType.API] = this.entities[EntityType.API].concat(
        ...this.loadAPI(api)
      )
    }

    for (const guide of Object.values(KnownGuides)) {
      this.entities[EntityType.GUIDE] = this.entities[EntityType.GUIDE].concat(
        ...this.loadGuide(guide)
      )
    }

    this.createIndexes()
    this.log('Initialised.')
  }

  private loadAPI(api: KnownAPIs) {
    return this.loadEntity(api, EntityType.API) as APIItem[]
  }

  private loadGuide(doc: KnownGuides) {
    return this.loadEntity(doc, EntityType.GUIDE) as GuideItem[]
  }

  /**
   * Load and parse an API/ or docs/guide definition file.
   */
  private loadEntity(entity: KnownAPIs | KnownGuides, type: EntityType) {
    let data: APIDocument | GuideDocument
    const path =
      type === EntityType.API
        ? DocService.API_DEFINITION_PATH
        : DocService.GUIDE_DEFINITION_PATH

    try {
      data = HJSON.parse(readFileSync(join(path, `${entity}.hjson`), 'utf8'))
      const parsed = this.parseEntity(entity, type, data)
      this.log(`Loaded ${type} docs for ${entity}.`)
      return parsed
    } catch (error) {
      this.error(
        `Couldn't load ${type} docs for ${entity}, is the file corrupted?`,
        error.message
      )
    }
  }

  /*
    Flatten and extend the data and build the alias map.
  */
  private parseEntity(
    api: KnownAPIs | KnownGuides,
    type: EntityType,
    data: APIDocument | GuideDocument
  ) {
    let entities: APIItem[] | GuideItem[] = []

    for (const category of data.categories) {
      for (let item of category.items) {
        item = Object.assign({}, item, {
          api: api,
          uuid: uuid(),
          category: category.title,
        })

        if (item.keywords) {
          /*
            NOTE: Lunr does not seem to support searching inside arrays or
            sub-properties, so we just build a string. ¯\_(ツ)_/¯
          */
          item.keywords = ((item.keywords as unknown) as string[]).join(' ')
        }

        if (item.aliases) {
          for (const alias of item.aliases) {
            if (!(alias in this.aliases[type])) {
              this.aliases[type][alias] = []
            }

            this.aliases[type][alias].push(item.uuid)
          }
        }

        entities.push(item)
      }
    }

    return entities
  }

  /**
   * Look something up in one/all of our APIs.
   */
  lookupAPI(guild: KlasaGuild, query: string, filter?: string) {
    return this.lookup(guild, query, EntityType.API, filter as KnownAPIs)
  }

  /**
   * Look something up in one of our guides.
   */
  lookupGuide(guild: KlasaGuild, query: string, filter?: string) {
    return this.lookup(guild, query, EntityType.GUIDE, filter as KnownGuides)
  }

  /**
   * Look up an entity. Uses Lunr to search through the title, description
   * and keywords (unless the query matches any aliases).
   */
  private lookup(
    guild: KlasaGuild,
    query: string,
    type: EntityType,
    filter?: KnownGuides | KnownAPIs
  ) {
    if (!this.client.settings.get(DocSettings.Client.ENABLED)) {
      throw new LookupDisabledError(
        guild.language.get(Language.ERROR_CLIENT_DISABLED)
      )
    }

    if (!guild.settings.get(DocSettings.Guild.ENABLED)) {
      throw new LookupDisabledError(
        guild.language.get(Language.ERROR_GUILD_DISABLED, [guild.name])
      )
    }

    try {
      const aliasMatch = this.aliases[type][query]

      if (Array.isArray(aliasMatch) && aliasMatch.length) {
        console.debug('Found aliases, just returning those.')
        return this.entities[type].filter(api => aliasMatch.includes(api.uuid))
      }

      return this.indexes[type]
        .search(query)
        .map(result => {
          return this.entities[type].find(api => api.uuid === result.ref)
        })
        .filter(entity => {
          this.debug(`Checking if ${entity.api} === filter ${filter}.`)
          return filter ? entity.api === filter : true
        })
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * Create the search index.
   */
  private createIndexes() {
    const apis = this.entities[EntityType.API]
    const guides = this.entities[EntityType.GUIDE]

    this.indexes[EntityType.API] = Lunr(function() {
      this.ref('uuid')
      this.field('title')
      this.field('keywords')
      this.field('description')

      for (const api of apis) {
        this.add(api)
      }
    })

    this.indexes[EntityType.GUIDE] = Lunr(function() {
      this.ref('uuid')
      this.field('title')
      this.field('keywords')
      this.field('description')

      for (const guide of guides) {
        this.add(guide)
      }
    })
  }

  /**
   * Get all API items, optionally filtered down to a specific API.
   */
  getAPIs(only?: string) {
    return this.entities[EntityType.API].filter(({ api }) => {
      if (Object.values(KnownAPIs).includes(only as KnownAPIs)) {
        return api === only
      }

      return true
    })
  }

  /**
   * Get all guide items, optionally filtered down to a specific API.
   */
  getGuides(only?: string) {
    return this.entities[EntityType.GUIDE].filter(({ api }) => {
      if (Object.values(KnownGuides).includes(only as KnownGuides)) {
        return api === only
      }

      return true
    })
  }
}

/**
 * Thrown when lookups are disabled for the client, or a specific guild.
 */
export class LookupDisabledError extends Error {
  constructor(...params: any[]) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LookupDisabledError)
    }

    this.name = this.constructor.name
  }
}

/**
 * Represents which APIs we have/can serve documentation for.
 */
export enum KnownAPIs {
  VUE = 'vue',
  VUEX = 'vuex',
}

/**
 * Represents which docs/guides we have/can serve documentation for.
 */
export enum KnownGuides {
  VUE = 'vue',
}

/**
 * Represents an entire API document (i.e. the raw HJSON).
 */
export type APIDocument = { categories: APICategory[] }

/**
 * Represents an entire guide document (i.e. the raw HJSON).
 */
export type GuideDocument = { categories: GuideCategory[] }

/**
 * Represents an API category.
 */
export interface APICategory {
  title: string
  items: APIItem[]
}

/**
 * Represents a guide category.
 */
export interface GuideCategory {
  title: string
  items: GuideItem[]
}

/**
 * Represents an API item.
 */
export interface APIItem {
  api: string
  category: string
  description: string
  link: string
  title: string
  uuid: string

  aliases?: string[]
  arguments?: APIArguments
  default?: string
  keywords?: string
  props?: string[]
  returns?: string
  see?: SeeAlsoLink[]
  status?: APIStatus
  type?: string
  usage?: APIUsage
  version?: string
}

/**
 * Represents a guide item.
 */
export interface GuideItem {
  api: string
  category: string
  description: string
  link: string
  title: string
  uuid: string

  aliases?: string[]
  keywords?: string
  see?: SeeAlsoLink[]
}

/**
 * Represents an API item usage example.
 */
export interface APIUsage {
  code: string
  lang: string
}

/**
 * Represents a "see also" link.
 */
export interface SeeAlsoLink {
  text: string
  link: string
}

/**
 * Represents an API item status.
 */
export type APIStatus = 'deprecated' | 'removed'

/**
 * Represents an API item's method signature(s).
 */
export type APIArguments = string[] | string[][]

/**
 * Represents the different types of doc-related entities which the DocService manages.
 */
enum EntityType {
  API = 'api',
  GUIDE = 'guide',
}

type Aliases = {
  [EntityType.API]: { [k: string]: string[] }
  [EntityType.GUIDE]: { [k: string]: string[] }
}

type Entities = {
  [EntityType.API]: APIItem[]
  [EntityType.GUIDE]: GuideItem[]
}

type Indexes = {
  [EntityType.API]: Lunr.Index
  [EntityType.GUIDE]: Lunr.Index
}
