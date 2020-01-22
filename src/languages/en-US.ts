import { Language, LanguageStore, LanguageOptions, util } from 'klasa'
import { stripIndent, oneLine } from 'common-tags'

import { command } from '@libraries/utilities/miscellaneous'
import { I18n } from '@libraries/types/I18n'
const {
  Cmd: {
    Info: { Code, Roles, CoC, DRY, Etiquette, Sharing },
    RFC,
  },
  Misc,
} = I18n

export default class LanguageEnUS extends Language {
  constructor(
    store: LanguageStore,
    file: string[],
    directory: string,
    options: LanguageOptions
  ) {
    super(store, file, directory, options)

    this.language = {
      DEFAULT: key => `UNLOCALISED_${key}_EN_US`,

      /**
       * Code command section.
       */

      [Code.DESC]: 'Show code highlighting tips.',
      [Code.HELP]: stripIndent`
        • You can (optionally) send the code highlighting tips to a user by mentioning them.
      `,
      [Code.TITLE_INPUT]: 'Code Highlighting Guide - Input',
      [Code.TITLE_OUTPUT]: 'Code Highlighting Guide - Output',
      [Code.INFO_PAGE_CONTENT]: stripIndent`
        • Most languages work in code block (\`js\`, \`css\` etc.).
        • You need to use \`html\` for Vue Single File Components.
      `,
      [Code.FIELD_NAME_INLINE]: 'Inline Code',
      [Code.FIELD_VALUE_INLINE]: `\\\`Math.random()\\\``,
      [Code.FIELD_NAME_BLOCK]: 'Code Blocks',
      [Code.FIELD_VALUE_BLOCK]: stripIndent`
        \\\`\\\`\\\`html
        <template></template>
        <script></script>
        <style></style>
        \\\`\\\`\\\`
      `,

      /**
       * Roles command section.
       */

      [Roles.DESC]: "View a description of Vue Land's roles.",
      [Roles.TITLE]: 'Vue Land Roles',
      [Roles.DESC_CORE_TEAM]: role => oneLine`
        The ${role} are the Vue.js developers. They mostly frequent the #vue2-internals and #vue3-discussions channels.
      `,
      [Roles.DESC_MODERATORS]: role => oneLine`
        The ${role} are the keepers of peace and order. Feel free to ping (or preferably DM) them if there is any issue which requires their attention.
      `,
      [Roles.DESC_MVPS]: role => oneLine`
        The ${role} are people who've proven to be helpful or knowledgeable on the server and may assist you with your issue, if they're available. They generally frequent #code-help and #code-help-too.
      `,
      [Roles.DESC_LIBRARY_MAINTAINERS]: role => oneLine`
        The ${role} are people who are maintainers or contributors of popular/important Vue.js libraries, frameworks and tools.
      `,
      [Roles.DESC_COMMUNITY_LEADERS]: role => oneLine`
        The ${role} are in charge of organising and running things like meetups, events and conferences, or notable community projects and resources.
      `,
      [Roles.DESC_NITRO_BOOSTERS]: role => oneLine`
        The ${role} role consists of people who have boosted the server with their Discord Nitro membership (thanks)!
      `,

      /**
       * Code of Conduct command section.
       */

      [CoC.DESC]: 'Display the Code of Conduct.',
      [CoC.TITLE]: 'VueJS Code of Conduct',
      [CoC.TITLE_PLEDGE]: 'Our Pledge',
      [CoC.DESC_PLEDGE]: oneLine`
        In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to
        making participation in our project and our community a harassment-free experience for everyone, regardless of
        age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience,
        education, socio-economic status, nationality, personal appearance, race, religion, political party, or sexual
        identity and orientation. Note, however, that religion, political party, or other ideological affiliation provide
        no exemptions for the behavior we outline as unacceptable in this Code of Conduct.
      `,
      [CoC.TITLE_STANDARDS]: 'Our Standards',
      [CoC.DESC_STANDARDS]: stripIndent`
        Examples of behavior that contributes to creating a positive environment include:

        • Using welcoming and inclusive language
        • Being respectful of differing viewpoints and experiences
        • Gracefully accepting constructive criticism
        • Focusing on what is best for the community
        • Showing empathy towards other community members

      Examples of unacceptable behavior by participants include:

        • The use of sexualized language or imagery and unwelcome sexual attention or advances
        • Trolling, insulting/derogatory comments, and personal or political attacks
        • Public or private harassment
        • Publishing others’ private information, such as a physical or electronic address, without explicit permission
        • Other conduct which could reasonably be considered inappropriate in a professional setting
      `,
      [CoC.TITLE_RESPONSIBILITIES]: 'Our Responsibilities',
      [CoC.DESC_RESPONSIBILITIES]: oneLine`
        Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to
        take appropriate and fair corrective action in response to any instances of unacceptable behavior.

        Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki
        edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or
        permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.
      `,
      [CoC.TITLE_SCOPE]: 'Scope',
      [CoC.DESC_SCOPE]: oneLine`
        This Code of Conduct applies both within project spaces and in public spaces when an individual is representing
        the project or its community. Examples of representing a project or community include using an official project
        e-mail address, posting via an official social media account, or acting as an appointed representative at an
        online or offline event. Representation of a project may be further defined and clarified by project maintainers.
      `,
      [CoC.TITLE_ENFORCEMENT]: 'Enforcement',
      [CoC.DESC_ENFORCEMENT]: oneLine`
        Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project
        team at [community@vuejs.org](mailto:community@vuejs.org). All complaints will be reviewed and investigated and will result in a response that
        is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain
        confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may
        be posted separately.

        Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or
        permanent repercussions as determined by other members of the project’s leadership.
      `,
      [CoC.TITLE_ATTRIBUTION]: 'Attribution',
      [CoC.DESC_ATTRIBUTION]: oneLine`
        This Code of Conduct is adapted from the [Contributor Covenant, version 1.4](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html)
      `,

      /**
       * Etiquette command section.
       */

      [Etiquette.DESC]: 'Explain the etiquette regarding asking for help.',
      [Etiquette.TITLE_PINGING]: 'Pinging',
      [Etiquette.DESC_PINGING]: stripIndent`
        You don't need to \`@\` someone who responded to you after every message.

        They'll see your responses and respond when they can.

        Additionally, please don't ping people immediately when asking your question (unless you're sure they are the **only** person who can help).
      `,
      [Etiquette.TITLE_AMBIGUITY]: 'Ambiguity',
      [Etiquette.DESC_AMBIGUITY]: stripIndent`
        Try not to make your question super vague / broad.

        If you can, narrow it down to just one main thing that you're struggling with rather than "Can you help me integrate X with Y".

        It will be easier for people to help.
      `,
      [Etiquette.TITLE_POSTING]: 'Cross-posting',
      [Etiquette.DESC_POSTING]: stripIndent`
        Please don't post the same question in multiple channels quickly in succession, see ${command(
          'dry'
        )}.
      `,
      [Etiquette.TITLE_VOLUNTEERS]: 'Volunteers',
      [Etiquette.DESC_VOLUNTEERS]: stripIndent`
        Remember that everyone here is a volunteer - they aren't getting paid to help you.
      `,
      [Etiquette.TITLE_DMS]: 'DMs',
      [Etiquette.DESC_DMS]: stripIndent`
        Please do not DM (private message) people soliciting help without first asking their permission.
      `,
      [Etiquette.TITLE_FORMATTING]: 'Formatting',
      [Etiquette.DESC_FORMATTING]: stripIndent`
        Please use proper code formatting when sharing code snippets, see ${command(
          'code'
        )}.
      `,
      [Etiquette.TITLE_SHARING]: 'Sharing',
      [Etiquette.DESC_SHARING]: stripIndent`
        If possible, provide a reproduction of the issue, see ${command(
          'sharing'
        )}.

        It'll be much easier to help if you do!
      `,

      /**
       * Sharing command section.
       */

      [Sharing.TITLE_JSFIDDLE]: 'JSFiddle',
      [Sharing.DESC_JSFIDDLE]: stripIndent`
        JSFiddle is a great choice for sharing a problem or showing off a demo, so long as you aren't using \`vue-cli\`.

        Features:
          • Add dependencies from CDNJS (but not from NPM)
          • Supports HTML, Haml
          • Supports Babel, TypeScript, CoffeeScript etc.
          • Supports SASS/SCSS and PostCSS
          • Collaboration features (code/debug together)
      `,
      [Sharing.TITLE_CODESANDBOX]: 'CodeSandbox',
      [Sharing.DESC_CODESANDBOX]: stripIndent`
        You can think of CodeSandbox like VS Code but in the browser, it's more of an IDE than a code-sharing site.

        It's the best choice for when your project is using \`vue-cli\`.

        Features:
          • Entire Node ecosystem at your fingertips (NPM support)
          • Supports anything there's an NPM package for
          • Importing from Github (synchronise your repo with a sandbox)
          • Uploading arbitrary files
          • Collaboration features (code/debug together)
      `,
      [Sharing.TITLE_CODEPEN]: 'CodePen',
      [Sharing.DESC_CODEPEN]: stripIndent`
        CodePen is another option that is most similar to JSFiddle.

        It's most often use for demos/showcases relating to vanilla HTML/CSS/JS but you can use it with Vue if you want.

        Features:
          • Add dependencies from CDNJS (but not from NPM)
          • Supports HTML, Haml, Markdown, Pug etc.
          • Supports Less, SASS/SCSS, Stylus etc.
          • Supports Babel, TypeScript, CoffeeScript etc.
          • Collaboration features, live view (requires pro)
          • Uploading arbitrary files (requires a project, limited for non-pro)
      `,
      [Sharing.TITLE_GIST]: 'Gist',
      [Sharing.DESC_GIST]: stripIndent`
        If you don't need any of that and just want to share some code that won't fit on Discord then perhaps Gist is your best option.

        Features:
          • Forking, revisions (every gist is a git repository)
          • Comments
          • Multiple files
      `,

      /**
       * DRY command section.
       */

      [DRY.DESC]: 'Explain etiquette relating to copy-pasting messages.',
      [DRY.TITLE]: "Don't Repeat Yourself",
      [DRY.BODY]: codeHelpChannel => stripIndent`
        When you copy-paste your question in multiple channels, it just leads to duplicated efforts.

        One person might have already answered your question in the first channel.

        Meanwhile, someone in another channel sees your unanswered question and unnecessarily begins to answer.

        If you're not sure where to post your question, just ask. Otherwise, ${codeHelpChannel} is always a safe bet!
      `,

      /**
       * RFC command section.
       */

      [RFC.DESC]: oneLine`
        Interact with VueJS Requests for Comments.
      `,
      [RFC.HELP]: stripIndent`
        • Fuzzy search using !rfc <query> AND/OR
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
      [RFC.ARGUMENT_QUERY]: prefix => oneLine`
        You must specify a valid query.

        For more information consult the help command - ${command('help rfc')}.
      `,
      [RFC.TITLE_NO_MATCHS]: `VueJS RFC Search`,
      [RFC.DESC_NO_MATCHS]: `No results found!`,
      [RFC.LIST_FILTER_INVALID]: (filter, validFilters) =>
        oneLine`
          You specified an invalid filter (\`${filter}\`), valid filters are: ${validFilters}.
        `,
      [RFC.LIST_FILTER_NO_RESULTS]: filter =>
        oneLine`
          No results found matching filter \`${filter}\`
        `,
      [RFC.TITLE_INFO_PAGE]: oneLine`
        VueJS - Requests for Comments
      `,
      [RFC.DESC_INFO_PAGE]: stripIndent`
        • Use the ⏮, ◀, ▶ & ⏭ buttons to navigate between the pages.
        • Jump to an arbitrary page using 🔢.
        • Cancel pagination using ⏹.
        • View this information page with ℹ.
      `,
      [RFC.TITLE_EMBED]: (number, title) => `RFC #${number} - ${title}`,
      [RFC.REFRESH_SUCCESS]: ttl => oneLine`
        I refetched the RFCs from the Github API and re-cached them to disk.

        The cache TTL is ${ttl}.
      `,
      [RFC.REFRESH_FAILURE]: force => oneLine`
        Sorry, something went wrong while fetching the RFCs from Github.
      `,

      /**
       * Miscellaneous section.
       */

      [Misc.ERROR_GENERIC]: stripIndent`
        Sorry, something went wrong!

        The error has been logged and hopefully we'll get to fixing it soon.
      `,
      [Misc.ERROR_PERM_USER]: permissions => oneLine`
        Sorry but you lack the permissions required (${permissions}) to perform that action.
      `,
      [Misc.ERROR_PERM_BOT]: permissions => oneLine`
        Sorry but I lack the permissions required (${permissions}) to perform that action.
      `,
      [Misc.DM_SENT]: oneLine`
        Okay, I've sent them a DM about that as you requested.
      `,
      [Misc.RESOLVER_INVALID_REPO]: (key, value) => stripIndent`
        Sorry but \`${value}\` is not a valid value for \`${key}\` - it must be a valid repository under the VueJS organization.
      `,
      [Misc.RESOLVER_INVALID_RELEASE_ENTRY]: (key, value) => stripIndent`
        Invalid value \`${value}\` for key \`${key}\`.
      `,
      [Misc.AUTHOR]: 'Author',
      [Misc.CREATED_AT]: 'Created',
      [Misc.UPDATED_AT]: 'Updated',
      [Misc.STATUS]: 'Status',
    }
  }

  async init() {
    await super.init()
  }
}
