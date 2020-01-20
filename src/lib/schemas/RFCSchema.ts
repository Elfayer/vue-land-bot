import { Client } from 'klasa'

/**
 * Extend the guild-specific schema with settings relating to
 * the RFCService and related commands, events, tasks etc.
 */
Client.defaultGuildSchema.add('rfcs', rfcs => {
  return (
    rfcs
      /**
       * Are RFC lookups enabled for this guild?
       */
      .add('enabled', 'Boolean', { default: true })
  )
})

Client.defaultClientSchema.add('rfcs', rfcs => {
  return (
    rfcs
      /**
       * How long to wait before refetching the RFCs from Github?
       */
      .add('cacheTTL', 'number', { default: 1000 * 60 * 60 * 4 })
      /**
       * At what time were the RFCs cached?
       */
      .add('cachedAt', 'number')
      /**
       * The RFC cache.
       */
      .add('cache', 'any', { array: true })
  )
})
