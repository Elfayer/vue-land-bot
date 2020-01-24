import { Client } from 'klasa'

import { KnownDocs } from '@services/DocService'

/**
 * Extend the client-specific schema with settings relating to docs/guide lookups.
 */
Client.defaultClientSchema.add('docs', docs => {
  return docs.add('enabled', 'boolean', { default: true })
})

/**
 * Extend the guild-specific schema with settings relating to docs/guide lookups.
 */
Client.defaultGuildSchema.add('docs', docs => {
  return docs
    .add('enabled', 'boolean', { default: true })
    .add('channels', 'channel', { array: true })
    .add('projects', 'string', { array: true })
})
