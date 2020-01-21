import { Piece, Extendable, ExtendableStore } from 'klasa'
import { Client } from 'discord.js'

/**
 * Extend all Pieces with some logging method which add a
 * nice prefix and then delegate to the client logger.
 */
// TODO: Without the cast (as Client) we get a TS error - is there a better way?
export default class PieceExtendable extends Extendable {
  constructor(store: ExtendableStore, file: string[], directory: string) {
    super(store, file, directory, { appliesTo: [Piece] })
  }

  log(...logs: any[]) {
    return (this.client as Client).console.log(this.formatLogs(logs))
  }

  warn(...logs: any[]) {
    return (this.client as Client).console.log(this.formatLogs(logs))
  }

  debug(...logs: any[]) {
    return (this.client as Client).console.debug(this.formatLogs(logs))
  }

  private formatLogs(...logs: any[]): any[] {
    return logs.map(log => `${this} ${log}`)
  }

  toString() {
    return `[${this.constructor.name}]`
  }
}
