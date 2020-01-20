import { Language, LanguageStore, LanguageOptions, util } from 'klasa'
import { stripIndent, oneLine } from 'common-tags'

export default class LanguageEnUS extends Language {
  constructor(
    store: LanguageStore,
    file: string[],
    directory: string,
    options: LanguageOptions
  ) {
    super(store, file, directory, options)

    this.language = {
      RFCS_COMMAND_DESCRIPTION: `Interact with VueJS Requests for Comments.`,
      RFCS_COMMAND_EXTENDED_HELP: stripIndent`
        • The query argument is only required for the view command.
        • Look for exact matches using the --number, --title, --author and --labels flags.
          • Fuzzy search by simply not specifying a flag.
          • You can use | (or) as well as & (and) for the label flag.
        • You can filter the results using the --filter flag, for the list command.
        Examples ::
        • Fuzzy Searching RFCs
          • !rfc attr fallthrough
          • !rfc attr fallthrough
          • !rfc #7
          • !rfc better v-for
          • !rfc posva
          • !rfc router
        • Filtering RFCs precisely
          • !rfc --number=7
          • !rfc --title="better v-for"
          • !rfc --author="posva"
          • !rfc --labels=router
          • !rfc --labels=router&core
          • !rfc --labels='router | core'
        • Listing RFCs by state
          • !rfc list
          • !rfc --state=open list
          • !rfc list --state='closed'
          • !rfc list --state="popular"
      `,
      RFCS_ARGUMENT_QUERY: prefix => oneLine`
        You must specify a valid query.

        For more information consult the help command - \`${prefix}help rfc\`.
      `,
      RFCS_VIEW: query => `view rfc - ${query}`,
      RFC_LIST_INVALID_FILTER: (filter, validFilters) =>
        `You specified an invalid filter (\`${filter}\`), valid filters are: ${validFilters}.`,
      RFCS_LIST_FILTER_NO_RESULTS: filter =>
        `No results found matching filter \`${filter}\``,
      RFCS_LIST_INFO_PAGE_TITLE: `VueJS Requests for Comments`,
      RFCS_LIST_INFO_PAGE_DESCRIPTION: filterAdjective => stripIndent`
      You are viewing ${filterAdjective} RFCs.

      - Use the ⏮, ◀, ▶ & ⏭ buttons to navigate between the pages.
      - Jump to an arbitrary page using 🔢.
      - Cancel pagination using ⏹.
      - View this information page with ℹ.
      `,
      RFCS_EMBED_TITLE: title => `VueJS RFC - ${title}`,
      RFCS_REFRESH: 'refresh rfcs',
    }
  }

  async init() {
    await super.init()
  }
}
