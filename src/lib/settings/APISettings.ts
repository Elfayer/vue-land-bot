import { T } from './shared'

import { KnownAPIs } from '@services/DocService'

/**
 * The API-related settings for the DocsSchema/DocsService.
 *
 * @see APISchema
 * @see DocsSettings
 * @see DocsService
 */
export const APISettings = {
  /**
   * The global settings.
   */
  Client: {
    /**
     * Are API lookups enabled?
     */
    ENABLED: T<boolean>('apis.enabled'),
  },

  /**
   * The guild-specific settings.
   */
  Guild: {
    /**
     * Are API lookups enabled?
     */
    ENABLED: T<boolean>('apis.enabled'),

    /**
     * Which channels are lookups enabled in?
     */
    CHANNELS: T<string>('apis.channel'),

    /**
     * Which projects are lookups enabled for?
     */
    PROJECTS: T<KnownAPIs[]>('apis.projects'),
  },
}
