import { Client } from 'klasa'

/**
 * Extend the guild-specific schema with settings relating to
 * the RFCService and related commands, events, tasks etc.
 */
Client.defaultGuildSchema.add('rfcs', rfcs => {
  return rfcs.add('enabled', 'boolean', { default: true })
})

Client.defaultClientSchema.add('rfcs', rfcs => {
  return rfcs
    .add('cacheTTL', 'number', {
      default: 1000 * 60 * 60 * 4,
    })
    .add('search', search => {
      return search
        .add('threshold', 'number', {
          min: 0.05,
          max: 1.0,
          default: 0.35,
        })
        .add('distance', 'number', {
          default: 2000,
        })
        .add('maxPatternLength', 'number', {
          default: 32,
        })
        .add('minMatchCharLength', 'number', {
          default: 3,
        })
    })
    .add('cachedAt', 'number')
    .add('cache', 'any', { array: true })
})
