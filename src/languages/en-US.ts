import { Language, LanguageStore, LanguageOptions, util } from 'klasa'

export default class LanguageEnUS extends Language {
  constructor(
    store: LanguageStore,
    file: string[],
    directory: string,
    options: LanguageOptions
  ) {
    super(store, file, directory, options)

    this.language = {
      RFCS_VIEW: query => `view rfc - ${query}`,
      RFCS_LIST: () => 'list rfcs',
      RFCS_REFRESH: () => 'refresh rfcs',
    }
  }

  async init() {
    await super.init()
  }
}
