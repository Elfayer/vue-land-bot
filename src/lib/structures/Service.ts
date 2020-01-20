import { Piece } from 'klasa'

/**
 * A Service is a piece responsible for fetching/managing/caching (etc.)
 * data from an external source, for instance - a REST or GraphQL API.
 *
 * Generally, a Service corresponds to a set of commands, events (etc.).
 *
 * For example, the RFCService has various commands, events, tasks and so on
 * which relate to it. If the service is disabled, then those pieces are too.
 */
export default abstract class Service extends Piece {
  public abstract run(message: unknown): unknown
}
