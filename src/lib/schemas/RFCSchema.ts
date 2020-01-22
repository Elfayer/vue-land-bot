import { Client } from 'klasa'

import { RFCSettings } from '@settings/RFCSettings'

/**
 * Extend the guild-specific schema with settings relating to
 * the RFCService and related commands, events, tasks etc.
 */
Client.defaultGuildSchema.add('rfcs', rfcs => {
  return rfcs.add(RFCSettings.Guild.ENABLED, 'boolean', { default: true })
})

Client.defaultClientSchema.add('rfcs', rfcs => {
  return rfcs
    .add(RFCSettings.Client.CACHE_TTL, 'number', {
      default: 1000 * 60 * 60 * 4,
    })
    .add(RFCSettings.Client.CACHED_AT, 'number')
    .add(RFCSettings.Client.CACHE, 'any', { array: true })
})
