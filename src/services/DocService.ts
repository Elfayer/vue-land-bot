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
  static DOC_DEFINITION_PATH = join(PATHS.DATA, 'doc')

  /**
   * Where are the git submodules for the official repositories stored?
   */
  static GIT_SUBMODULE_PATH = join(PATHS.BASE, 'packages')

  /**
   * The Lunr search index.
   */
  lunr: Lunr.Index

  /**
   * The docs/guide entries.
   */
  private docs: { [k: string]: any[] }

  /**
   * The API entries.
   */
  private apis: APIItem[] = []

  /**
   * The docs/guide alias map.
   */
  private docAliases: { [k: string]: string[] } = {}

  /**
   * The API alias map.
   */
  private apiAliases: { [k: string]: string[] } = {}

  async init() {
    for (const api of Object.values(KnownAPIs)) {
      this.loadAPI(api)
    }

    this.createIndex()

    this.log('Initialised.')
  }

  /**
   * Load and parse an API definition file.
   */
  loadAPI(api: KnownAPIs) {
    let data: APIDocument
    try {
      data = HJSON.parse(
        readFileSync(
          join(DocService.API_DEFINITION_PATH, `${api}.hjson`),
          'utf8'
        )
      )
      this.parseAPI(api, data)
      this.log(`Loaded API docs for ${api}.`)
    } catch (error) {
      this.error(
        `Couldn't load API docs for ${api}, is the file corrupted?`,
        error.message
      )
    }
  }

  /*
    Flatten and extend the data and build the alias map.
  */
  parseAPI(api: KnownAPIs, data: APIDocument) {
    let apis: APIItem[] = []

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
            sub-properties so we just build a string. ¯\_(ツ)_/¯
          */
          item.keywords = ((item.keywords as unknown) as string[]).join(' ')
        }

        if (item.aliases) {
          for (const alias of item.aliases) {
            if (!(alias in this.apiAliases)) {
              this.apiAliases[alias] = []
            }

            this.apiAliases[alias].push(item.uuid)
          }
        }

        apis.push(item)
      }
    }

    this.apis.push(...apis)
  }

  /**
   *
   */
  loadDoc(doc: KnownDocs) {}

  /**
   * Look something up in one/all of our APIs. Uses Lunr to search through the
   * title, description and keywords (unless the query matches any aliases).
   */
  async lookupAPI(guild: KlasaGuild, query: string, api?: KnownAPIs) {
    if (!this.client.settings.get(APISettings.Client.ENABLED)) {
      throw new LookupDisabledError(
        guild.language.get(Language.ERROR_CLIENT_DISABLED)
      )
    }

    if (!guild.settings.get(APISettings.Guild.ENABLED)) {
      throw new LookupDisabledError(
        guild.language.get(Language.ERROR_GUILD_DISABLED, [guild.name])
      )
    }

    try {
      const aliasMatch = this.apiAliases[query]
      if (Array.isArray(aliasMatch) && aliasMatch.length) {
        return this.apis.filter(api => aliasMatch.includes(api.uuid))
      }

      return this.lunr.search(query).map(result => {
        return this.apis.find(api => api.uuid === result.ref)
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * Create the search index.
   */
  private createIndex() {
    const apis = this.apis

    this.lunr = Lunr(function() {
      this.ref('uuid')
      this.field('title')
      this.field('keywords')
      this.field('description')

      for (const api of apis) {
        this.add(api)
      }
    })
  }

  /**
   * Look something up in one of our docs/guides.
   */
  async lookupDocs(guild: KlasaGuild, query: string, api: KnownDocs) {
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

    // do look up
  }

  /**
   * Get all API items, optionally filtered down to a specific api.
   */
  getAPIs(only?: string) {
    return this.apis.filter(({ api }) => {
      if (Object.values(KnownAPIs).includes(only as KnownAPIs)) {
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
export enum KnownDocs {
  VUE = 'vue',
}

/**
 * Represents an entire API document.
 */
export type APIDocument = { categories: APICategory[] }

/**
 * Represents an API category.
 */
export interface APICategory {
  title: string
  items: APIItem[]
}

/**
 * Represents an API item.
 */
export interface APIItem {
  api: string
  uuid: string
  title: string
  category: string
  status?: APIStatus
  description?: string
  keywords: string
  props?: string[]
  aliases?: string[]
  arguments?: APIArguments
  returns?: string
  type?: string
  default?: string
  link?: string
  version?: string
  usage?: APIUsage
  see?: APILink[]
}

/**
 * Represents an API item usage example.
 */
export interface APIUsage {
  lang: string
  code: string
}

/**
 * Represents an API item "see also" link.
 */
export interface APILink {
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
