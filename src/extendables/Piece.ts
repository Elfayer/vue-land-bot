import { Piece, Extendable, ExtendableStore } from 'klasa'
import { Client } from 'discord.js'

/**
 * Extend all Pieces with some logging methods which add a
 * nice prefix and then delegate to the client logger.
 */
// TODO: Without the cast (as Client) we get a TS error - is there a better way?
export default class PieceExtendable extends Extendable {
  constructor(store: ExtendableStore, file: string[], directory: string) {
    super(store, file, directory, { appliesTo: [Piece] })
  }

  log(...logs: any[]) {
    return (this.client as Client).console.log(...this.formatLogs(logs))
  }

  warn(...logs: any[]) {
    return (this.client as Client).console.warn(...this.formatLogs(logs))
  }

  error(...logs: any[]) {
    return (this.client as Client).console.error(...this.formatLogs(logs))
  }

  debug(...logs: any[]) {
    return (this.client as Client).console.debug(...this.formatLogs(logs))
  }

  verbose(...logs: any[]) {
    return (this.client as Client).console.debug(...this.formatLogs(logs))
  }

  formatLogs(...logs: any[]): string[] {
    return logs.map(log => `${this} ${log}`)
  }

  toString() {
    return `[${this.constructor.name}]`
  }
}
