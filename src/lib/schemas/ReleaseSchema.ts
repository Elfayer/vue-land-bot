import { Client } from 'klasa'

/**
 * Extend the guild-specific schema with settings relating to releases.
 */
Client.defaultGuildSchema.add('releases', releases => {
  return (
    releases
      /**
       * Are release announcements enabled?
       */
      .add('enabled', 'boolean', { default: false })
      /**
       * Which channel should release announcements be sent to?
       */
      .add('channel', 'channel')
      /**
       * Which role should be notified when releases are announced?
       */
      .add('role', 'role')
      /**
       * Which repositories should we announce releases for?
       */
      .add('repos', 'vuejs-repo', { array: true })
      /**
       * How often should we check for new releases, in hours.
       *
       * Note that if NODE_ENV is development then will become minutes, for ease of testing.
       */
      .add('schedule', 'number', { min: 1, default: 6, max: 24 * 7 })
      /**
       * When was the last release announced?
       */
      .add('lastRelease', 'number')
      /**
       * Keeps track of which version each repository is currently on.
       */
      .add('versions', 'any', { configurable: false })
  )
})
