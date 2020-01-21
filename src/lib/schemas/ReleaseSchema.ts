import { Client } from 'klasa'

import { ReleaseGuildSettings } from '@settings/releases'

/**
 * Extend the guild-specific schema with settings relating to releases.
 */
Client.defaultGuildSchema.add('releases', releases => {
  return releases
    .add(ReleaseGuildSettings.ENABLED, 'boolean', { default: false })
    .add(ReleaseGuildSettings.CHANNEL, 'channel')
    .add(ReleaseGuildSettings.ROLE, 'role')
    .add(ReleaseGuildSettings.REPOS, 'vuejs-repo', { array: true })
    .add(ReleaseGuildSettings.SCHEDULE, 'number', {
      min: 1,
      default: 6,
      max: 24 * 7,
    })
    .add(ReleaseGuildSettings.LAST_RELEASE, 'number')
    .add(ReleaseGuildSettings.VERSIONS, 'any', { configurable: false })
})
