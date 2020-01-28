import {
  Serializer,
  SerializerStore,
  SchemaEntry,
  Language,
  KlasaGuild,
} from 'klasa'
import semver from 'semver'

import { ValidVueRepositories } from '@libraries/types/MiscTypes'
import { ReleaseEntry } from '@libraries/types/ReleaseTypes'

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
      Object.values(ValidVueRepositories).includes(repo) &&
      semver.valid(version) &&
      !isNaN(parseInt((announced as unknown) as string))
    ) {
      return data
    }

    throw language.get('VUEBOT_RESOLVER_INVALID_RELEASE_ENTRY', entry.key, data)
  }
}
