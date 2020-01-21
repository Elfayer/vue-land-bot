import {
  Serializer,
  SerializerStore,
  SchemaEntry,
  Language,
  KlasaGuild,
} from 'klasa'

import { VALID_VUEJS_REPOS } from '@libraries/constants'

export default class extends Serializer {
  constructor(store: SerializerStore, file: string[], directory: string) {
    super(store, file, directory, { aliases: ['vue-repo', 'vuejs-repo'] })
  }

  async deserialize(
    data: string,
    entry: SchemaEntry,
    language: Language,
    guild?: KlasaGuild
  ) {
    if (VALID_VUEJS_REPOS.includes(data)) {
      return data
    }

    throw language.get('VUEBOT_RESOLVER_INVALID_REPO', entry.key, data)
  }
}
