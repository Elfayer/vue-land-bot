import {
  Serializer,
  SerializerStore,
  SchemaEntry,
  Language,
  KlasaGuild,
} from 'klasa'

import { VALID_VUEJS_REPOS } from '@libraries/constants'
import { ReleaseEntry } from '@libraries/types/releases'

export default class ReleaseEntrySerializer extends Serializer {
  constructor(store: SerializerStore, file: string[], directory: string) {
    super(store, file, directory, { aliases: ['release-entry'] })
  }

  async deserialize(
    data: ReleaseEntry,
    entry: SchemaEntry,
    language: Language,
    guild?: KlasaGuild
  ) {
    const { repo, version, announced } = data
    if (
      VALID_VUEJS_REPOS.includes(repo) &&
      typeof version === 'string' &&
      version.length &&
      !isNaN(parseInt(announced as string))
    ) {
      return data
    }

    throw language.get('VUEBOT_RESOLVER_INVALID_RELEASE_ENTRY', entry.key, data)
  }
}
