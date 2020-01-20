import ServiceStore from '@structures/ServiceStore'

/**
 * Augment the Klasa typings, when/where necessary.
 */
declare module 'klasa' {
  export interface PieceDefaults {
    services?: PieceOptions
  }

  export interface KlasaClient {
    services: ServiceStore
  }
}
