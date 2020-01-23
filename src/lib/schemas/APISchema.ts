import { Client } from 'klasa'

import { KnownAPIs } from '@services/DocService'

/**
 * Extend the client-specific schema with settings relating to API lookups.
 */
Client.defaultClientSchema.add('apis', apis => {
  return apis.add('enabled', 'boolean', { default: false })
})

/**
 * Extend the guild-specific schema with settings relating to API lookups.
 */
Client.defaultGuildSchema.add('apis', apis => {
  return apis
    .add('enabled', 'boolean', { default: false })
    .add('channels', 'channel', { array: true })
    .add('projects', 'string', { array: true })
})
