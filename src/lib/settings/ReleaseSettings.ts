import { T } from './shared'
import { ReleaseEntry } from '@libraries/types/ReleaseTypes'

import { ValidVueRepositories } from '@libraries/types/MiscTypes'
/**
 * The settings for the ReleasesSchema/ReleasesService.
 *
 * @see ReleaseSchema
 * @see ReleaseService
 */
export namespace ReleaseSettings {
  /**
   * The guild-specific settings.
   */
  export namespace Guild {
    /**
     * Represents all guild settings.
     */
    export const ALL = T<unknown>('releases')

    /**
     * Are release announcements enabled?
     */
    export const ENABLED = T<boolean>('releases.enabled')

    /**
     * Which channel should release announcements be sent to?
     */
    export const CHANNEL = T<string>('releases.channel')

    /**
     * Which role should be notified when releases are announced?
     */
    export const ROLE = T<string>('releases.role')

    /**
     * Which repositories should we announce releases for?
     */
    export const REPOS = T<ValidVueRepositories[]>('releases.repos')

    /**
     * How often should we check for new releases, in hours.
     *
     * Note that if NODE_ENV is development then will become minutes, for ease of testing.
     */
    export const SCHEDULE = T<number>('releases.schedule')

    /**
     * When was the last release announced?
     */
    export const LAST_RELEASE = T<number>('releases.lastRelease')

    /**
     * Keeps track of which version each repository is currently on.
     */
    export const VERSIONS = T<ReleaseEntry[]>('releases.versions')
  }
}
