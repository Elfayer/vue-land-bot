import { Client } from 'klasa'

import { ReleaseSettings } from '@settings/ReleaseSettings'

/**
 * Extend the guild-specific schema with settings relating to releases.
 */
Client.defaultGuildSchema.add('releases', releases => {
  return releases
    .add(ReleaseSettings.Guild.ENABLED, 'boolean', { default: false })
    .add(ReleaseSettings.Guild.CHANNEL, 'channel')
    .add(ReleaseSettings.Guild.ROLE, 'role')
    .add(ReleaseSettings.Guild.REPOS, 'vuejs-repo', { array: true })
    .add(ReleaseSettings.Guild.SCHEDULE, 'number', {
      min: 1,
      default: 6,
      max: 24 * 7,
    })
    .add(ReleaseSettings.Guild.LAST_RELEASE, 'number')
    .add(ReleaseSettings.Guild.VERSIONS, 'any', { configurable: false })
})
