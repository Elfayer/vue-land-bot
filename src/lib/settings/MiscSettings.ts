import { T } from './shared'

/**
 * Settings that don't really belong anywhere else.
 */
export const MiscSettings = {
  /**
   * The global settings.
   */
  Client: {
    /**
     * The list of statuses the bot will cycle through.
     */
    STATUSES: T<Array<[string, string]>>('misc.statuses'),
  },
} as const
