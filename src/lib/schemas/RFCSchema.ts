import { Client } from 'klasa'

import { RFCGuildSettings, RFCClientSettings } from '@settings/rfcs'

/**
 * Extend the guild-specific schema with settings relating to
 * the RFCService and related commands, events, tasks etc.
 */
Client.defaultGuildSchema.add('rfcs', rfcs => {
  return rfcs.add(RFCGuildSettings.ENABLED, 'boolean', { default: true })
})

Client.defaultClientSchema.add('rfcs', rfcs => {
  return rfcs
    .add(RFCClientSettings.CACHE_TTL, 'number', { default: 1000 * 60 * 60 * 4 })
    .add(RFCClientSettings.CACHED_AT, 'number')
    .add(RFCClientSettings.CACHE, 'any', { array: true })
})
