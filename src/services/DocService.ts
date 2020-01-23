import { join } from 'path'

import * as Lunr from 'lunr'

import '@schemas/APISchema'
import '@schemas/DocSchema'
import Service from '@structures/Service'
import { PATHS } from '@libraries/constants'
import github from '@libraries/GithubClient'
import { APISettings } from '@base/lib/settings/APISettings'
import { DocSettings } from '@base/lib/settings/DocSettings'

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
  async lookupAPI(api: KnownAPIs, query: string) {}

  /**
   * Look something up in one of our docs/guides.
   */
  async lookupDocs(api: KnownDocs, query: string) {}
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
