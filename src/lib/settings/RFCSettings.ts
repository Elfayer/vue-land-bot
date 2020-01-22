import { PullsListResponseItem } from '@octokit/rest'

import { T } from './shared'

/**
 * The settings for the RFCSchema/RFCService.
 *
 * @see RFCSchema
 * @see RFCService
 */
export namespace RFCSettings {
  /**
   * The guild-specific settings.
   */
  export namespace Guild {
    /**
     * Are RFC lookups enabled for this guild?
     */
    export const ENABLED = T<boolean>('enabled')
  }

  /**
   * The client-specific settings.
   */
  export namespace Client {
    /**
     * How long to wait before refetching the RFCs from Github?
     */
    export const CACHE_TTL = T<number>('cacheTTL')

    /**
     * At what time were the RFCs cached?
     */
    export const CACHED_AT = T<number>('cacheAt')

    /**
     * The RFC cache.
     */
    export const CACHE = T<PullsListResponseItem[]>('cache')
  }
}
