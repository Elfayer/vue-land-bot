import ServiceStore from '@structures/ServiceStore'
import { CustomGet } from '@settings/shared'

/**
 * Augment the Klasa typings, when/where necessary.
 */
declare module 'klasa' {
  /**
   * @see VueClient
   */
  interface PieceDefaults {
    services?: PieceOptions
  }
  interface KlasaClient {
    services: ServiceStore
  }

  /**
   * @see PieceExtendable
   */
  interface Piece {
    log(...logs: any[]): void
    warn(...logs: any[]): void
    debug(...logs: any[]): void
    verbose(...logs: any[]): void
    formatLogs(logs: any[]): string[]
  }

  /**
   * See src/lib/settings/shared for more info.
   *
   * @see T
   * @see CustomGet
   */
  interface SettingsFolder {
    get<K extends string, S>(key: CustomGet<K, S>): S
  }
}
