import { Client } from 'klasa'

import { ReleaseSettings } from '@settings/ReleaseSettings'

/**
 * Extend the guild-specific schema with settings relating to releases.
 */
Client.defaultGuildSchema.add('releases', releases => {
  return releases
    .add('enabled', 'boolean', { default: false })
    .add('channel', 'channel')
    .add('role', 'role')
    .add('repos', 'vuejs-repo', { array: true })
    .add('schedule', 'number', {
      min: 1,
      default: 6,
      max: 24 * 7,
    })
    .add('lastRelease', 'number')
    .add('versions', 'any', { array: true, configurable: false })
})
