import { Client } from 'klasa'

/**
 * Extend the guild-specific schema with settings relating to
 * the RFCService and related commands, events, tasks etc.
 */
Client.defaultGuildSchema.add('rfcs', rfcs => {
  return (
    rfcs
      /**
       * Is the RFCService enabled for this guild?
       */
      .add('enabled', 'Boolean', { default: true })
      /**
       * How long to wait before refetching the RFCs from Github?
       */
      .add('cacheTTL', 'Duration', { default: '4h' })
      /**
       * Who/what can use the RFCService, and/or where?
       */
      .add('whitelist', whitelist => {
        return whitelist
          .add('roles', 'Role', { array: true })
          .add('users', 'User', { array: true })
          .add('channels', 'TextChanel', { array: true })
      })
      /**
       * Who/what can NOT use the RFCService, and/or where?
       */
      .add('blacklist', blacklist => {
        return blacklist
          .add('roles', 'Role', { array: true })
          .add('users', 'User', { array: true })
          .add('channels', 'TextChanel', { array: true })
      })
  )
})
