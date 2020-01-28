import { Client } from 'klasa'

import { STATUSES } from '@libraries/constants'

/**
 * Extend the client-specific schema with miscellaneous settings.
 */
Client.defaultClientSchema.add('misc', misc => {
  return misc.add('statuses', 'any', {
    array: true,
    default: STATUSES,
  })
})
