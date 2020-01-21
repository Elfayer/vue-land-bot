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
       * How often should we check for new releases?
       */
      .add('schedule', 'number')
      /**
       * Keeps track of which version each repository is currently on.
       */
      .add('versions', 'any', { configurable: false })
  )
})
