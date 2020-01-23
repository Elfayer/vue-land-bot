import { join } from 'path'

import { KlasaGuild } from 'klasa'
import { oneLine } from 'common-tags'
import * as Lunr from 'lunr'

import '@schemas/APISchema'
import '@schemas/DocSchema'
import Service from '@structures/Service'
import { PATHS } from '@libraries/constants'
import github from '@libraries/GithubClient'
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
export default class DocsService extends Service {
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

  async init() {
    this.log('Initialised.')
  }

  /**
   * Look something up in one of our APIs.
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

    // do look up
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
}

/**
 * Represents which docs/guides we have/can serve documentation for.
 */
export enum KnownDocs {
  VUE = 'vue',
}

/**
 * Represents a category.
 */
export interface APICategory {
  title: string
  items: APIItem[]
}

/**
 * Represents an item within a category.
 */
export interface APIItem {
  id?: string
  title: string
  status?: APIStatus
  description?: string
  props?: string[]
  aliases?: string[]
  arguments?: string[]
  returns?: string
  type?: string
  default?: string
  link?: string
  version?: string
  usage?: APIUsage
  see?: string[]
}

/**
 * Represents a usage example.
 */
export interface APIUsage {
  lang: string
  code: string
}

/**
 * The status of this part of the API.
 */
export type APIStatus = 'deprecated' | 'removed'
