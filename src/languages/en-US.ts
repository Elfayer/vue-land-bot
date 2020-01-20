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
      CMD_INFO_CODE_DESCRIPTION: 'Show code highlighting tips.',
      CMD_INFO_CODE_EXTENDED_HELP: stripIndent`
        You can optionally send the
      `,

      INFO_CODE_TITLE_INPUT: 'Code Highlighting Guide - Input',
      INFO_CODE_TITLE_OUTPUT: 'Code Highlighting Guide - Output',
      INFO_CODE_INFO_PAGE_CONTENT: stripIndent`
        • Most languages work in code block (\`js\`, \`css\` etc.).
        • You need to use \`html\` for Vue Single File Components.
      `,
      INFO_CODE_FIELD_NAME_INLINE: 'Inline Code',
      INFO_CODE_FIELD_VALUE_INLINE: `\\\`Math.random()\\\``,
      INFO_CODE_FIELD_NAME_BLOCK: 'Code Blocks',
      INFO_CODE_FIELD_VALUE_BLOCK: stripIndent`
        \\\`\\\`\\\`html
        <template></template>
        <script></script>
        <style></style>
        \\\`\\\`\\\`
      `,

      RFCS_COMMAND_DESCRIPTION: oneLine`
        Interact with VueJS Requests for Comments.
      `,

      RFCS_COMMAND_EXTENDED_HELP: stripIndent`
        • Fuzzy search using !rfc <query> OR
        • Look for exact matches using filters
          • Available Filters: --number, --title, --body, --author, --label, --state
          • You can | (or) as well as & (and) for the label filter.
        Examples ::
        • Fuzzy Searching RFCs
          • !rfc #7
          • !rfc attr fallthrough
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

      RFCS_NO_MATCHS_TITLE: `VueJS RFC Search`,
      RFCS_NO_MATCHS_DESCRIPTION: `No results found!`,

      RFC_LIST_INVALID_FILTER: (filter, validFilters) =>
        oneLine`
          You specified an invalid filter (\`${filter}\`), valid filters are: ${validFilters}.
        `,

      RFCS_LIST_FILTER_NO_RESULTS: filter =>
        oneLine`
          No results found matching filter \`${filter}\`
        `,

      RFCS_INFO_PAGE_TITLE: oneLine`
        VueJS - Requests for Comments
      `,
      RFCS_INFO_PAGE_DESCRIPTION: stripIndent`
        • Use the ⏮, ◀, ▶ & ⏭ buttons to navigate between the pages.
        • Jump to an arbitrary page using 🔢.
        • Cancel pagination using ⏹.
        • View this information page with ℹ.
      `,

      RFCS_EMBED_TITLE: title => `VueJS RFC - ${title}`,

      RFCS_REFRESH_SUCCESS: ttl => oneLine`
        I refetched the RFCs from the Github API and re-cached them to disk.

        The cache TTL is ${ttl}.
      `,

      RFCS_REFRESH_FAILURE: force => oneLine`
        Sorry, something went wrong while fetching the RFCs from Github.
      `,

      VUEBOT_GENERIC_ERROR: stripIndent`
        Sorry, something went wrong!

        The error has been logged and hopefully we'll get to fixing it soon.
      `,
      VUEBOT_USER_LACKS_PERMISSION: permissions => oneLine`
        Sorry but you lack the permissions required (${permissions}) to perform that action.
      `,
      VUEBOT_BOT_LACKS_PERMISSION: permissions => oneLine`
        Sorry but I lack the permissions required (${permissions}) to perform that action.
      `,
      VUEBOT_DM_SENT: oneLine`
        Okay, I've sent them a DM about that as you requested.
      `,
    }
  }

  async init() {
    await super.init()
  }
}
