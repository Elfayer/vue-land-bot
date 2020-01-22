import {
  Serializer,
  SerializerStore,
  SchemaEntry,
  Language,
  KlasaGuild,
} from 'klasa'

import { ValidVueRepositories } from '@libraries/types/MiscTypes'

export default class extends Serializer {
  constructor(store: SerializerStore, file: string[], directory: string) {
    super(store, file, directory, { aliases: ['vue-repo', 'vuejs-repo'] })
  }

  async deserialize(
    data: ValidVueRepositories,
    entry: SchemaEntry,
    language: Language,
    guild?: KlasaGuild
  ) {
    if (Object.values(ValidVueRepositories).includes(data)) {
      return data
    }

    throw language.get('VUEBOT_RESOLVER_INVALID_REPO', entry.key, data)
  }
}
