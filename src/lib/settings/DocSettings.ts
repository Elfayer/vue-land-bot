import { T } from './shared'

import { KnownDocs } from '@services/DocService'

/**
 * The settings for the DocsSchema/DocsService.
 *
 * @see DocsSchema
 * @see DocsService
 */
export const DocSettings = {
  /**
   * The global settings.
   */
  Client: {
    /**
     * Are docs lookups enabled?
     */
    ENABLED: T<boolean>('docs.enabled'),
  },

  /**
   * The guild-specific settings.
   */
  Guild: {
    /**
     * Are docs lookups enabled?
     */
    ENABLED: T<boolean>('docs.enabled'),

    /**
     * Which channels are lookups enabled in?
     */
    CHANNELS: T<string>('docs.channel'),

    /**
     * Which projects are lookups enabled for?
     */
    PROJECTS: T<KnownDocs[]>('docs.projects'),
  },
}
