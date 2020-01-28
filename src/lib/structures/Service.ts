import { Piece } from 'klasa'

/**
 * A Service is a piece responsible for fetching/managing/caching (etc.)
 * data from an external source, for instance - a REST or GraphQL API.
 *
 * Generally, a Service corresponds to a set of commands, events, inhibitors
 * and so on and they usually have their own schema.
 *
 * For example, the RFCService has various methods which commands,
 * events, tasks and other things which relate to RFCs all make use of.
 */
export default abstract class Service extends Piece {
  /**
   * Services don't need to implement a run method, like most other Pieces.
   */
  public run(message: unknown) {
    this.log('Service called (why)???')
  }
}
