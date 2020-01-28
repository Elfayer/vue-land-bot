import { KlasaClient, Store } from 'klasa'
import Service from './Service'

/**
 * The ServiceStore stores Services, see lib/structures/Service.ts for more info.
 */
export default class ServiceStore extends Store<
  string,
  Service,
  ConstructorType<Service>
> {
  public constructor(client: KlasaClient) {
    // @ts-ignore 2345
    super(client, 'services', Service)
  }
}

type ConstructorType<V> = new (...args: unknown[]) => V
