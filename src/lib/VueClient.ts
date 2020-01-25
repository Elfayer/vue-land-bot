import { KlasaClient, KlasaClientOptions } from 'klasa'

import ServiceStore from '@structures/ServiceStore'

const { NODE_ENV, OWNER_ID, BOT_TOKEN } = process.env

if (!['development', 'production'].includes(NODE_ENV)) {
  throw new Error(
    '[VueClient] NODE_ENV must be either development or production.'
  )
}

if (!BOT_TOKEN) {
  throw new Error('[VueClient] BOT_TOKEN must be defined.')
}

import '@schemas/MiscSchema'
import '@schemas/ReleaseSchema'

/**
 * The VueClient just adds our custom piece stores
 * (for now, just the {@link Service}s), to the KlasaClient.
 *
 * @see https://klasa.js.org/#/docs/klasa/settings/Other%20Subjects/PieceStores
 */
export default class VueClient extends KlasaClient {
  services: ServiceStore

  constructor(options: KlasaClientOptions) {
    super(options)

    this.services = new ServiceStore(this)
    this.registerStore(this.services)

    this.on('klasaReady', () => {
      this.user.setPresence({
        activity: {
          name: 'with 1s and 0s',
          type: 'PLAYING',
        },
        status: 'online',
      })
    })
  }
}
