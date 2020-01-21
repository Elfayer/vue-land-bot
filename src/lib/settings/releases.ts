/**
 * The settings keys for the ReleaseSchema/ReleaseService.
 */
export enum ReleaseGuildSettings {
  /**
   * Are release announcements enabled?
   */
  ENABLED = 'enabled',
  /**
   * Which channel should release announcements be sent to?
   */
  CHANNEL = 'channel',
  /**
   * Which role should be notified when releases are announced?
   */
  ROLE = 'role',
  /**
   * Which repositories should we announce releases for?
   */
  REPOS = 'repos',
  /**
   * How often should we check for new releases, in hours.
   *
   * Note that if NODE_ENV is development then will become minutes, for ease of testing.
   */
  SCHEDULE = 'schedule',
  /**
   * When was the last release announced?
   */
  LAST_RELEASE = 'lastRelease',
  /**
   * Keeps track of which version each repository is currently on.
   */
  VERSIONS = 'versions',
}
