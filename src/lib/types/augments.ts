import ServiceStore from '@structures/ServiceStore'

/**
 * Augment the Klasa typings, when/where necessary.
 */
declare module 'klasa' {
  /**
   * @see /src/VueClient
   */
  export interface PieceDefaults {
    services?: PieceOptions
  }
  export interface KlasaClient {
    services: ServiceStore
  }

  /**
   * @see /src/extendables/Piece
   */
  export interface Piece {
    log(...logs: any[]): void
    warn(...logs: any[]): void
    debug(...logs: any[]): void
  }
}
