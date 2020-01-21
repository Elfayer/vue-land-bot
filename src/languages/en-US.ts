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
        • You can (optionally) send the code highlighting tips to a user by mentioning them.
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

      INFO_ROLES_TITLE: 'Vue Land Roles',
      INFO_ROLES_ROLE_CORE_TEAM_DESCRIPTION: role => oneLine`
        The ${role} are the Vue.js developers. They mostly frequent the #vue2-internals and #vue3-discussions channels.
      `,
      INFO_ROLES_ROLE_MODERATORS_DESCRIPTION: role => oneLine`
        The ${role} are the keepers of peace and order. Feel free to ping (or preferably DM) them if there is any issue which requires their attention.
      `,
      INFO_ROLES_ROLE_MVPS_DESCRIPTION: role => oneLine`
        The ${role} are people who've proven to be helpful or knowledgeable on the server and may assist you with your issue, if they're available. They generally frequent #code-help and #code-help-too.
      `,
      INFO_ROLES_ROLE_LIBRARY_MAINTAINERS_DESCRIPTION: role => oneLine`
        The ${role} are people who are maintainers or contributors of popular/important Vue.js libraries, frameworks and tools.
      `,
      INFO_ROLES_ROLE_COMMUNITY_LEADERS_DESCRIPTION: role => oneLine`
        The ${role} are in charge of organising and running things like meetups, events and conferences, or notable community projects and resources.
      `,
      INFO_ROLES_ROLE_NITRO_BOOSTERS_DESCRIPTION: role => oneLine`
        The ${role} role consists of people who have boosted the server with their Discord Nitro membership (thanks)!
      `,

      INFO_COC_TITLE: 'VueJS Code of Conduct',
      INFO_COC_TITLE_PLEDGE: 'Our Pledge',
      INFO_COC_DESC_PLEDGE: oneLine`
        In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to
        making participation in our project and our community a harassment-free experience for everyone, regardless of
        age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience,
        education, socio-economic status, nationality, personal appearance, race, religion, political party, or sexual
        identity and orientation. Note, however, that religion, political party, or other ideological affiliation provide
        no exemptions for the behavior we outline as unacceptable in this Code of Conduct.
      `,
      INFO_COC_TITLE_STANDARDS: 'Our Standards',
      INFO_COC_DESC_STANDARDS: stripIndent`
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
      INFO_COC_TITLE_RESPONSIBILITIES: 'Our Responsibilities',
      INFO_COC_DESC_RESPONSIBILITIES: oneLine`
        Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to
        take appropriate and fair corrective action in response to any instances of unacceptable behavior.

        Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki
        edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or
        permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.
      `,
      INFO_COC_TITLE_SCOPE: 'Scope',
      INFO_COC_DESC_SCOPE: oneLine`
        This Code of Conduct applies both within project spaces and in public spaces when an individual is representing
        the project or its community. Examples of representing a project or community include using an official project
        e-mail address, posting via an official social media account, or acting as an appointed representative at an
        online or offline event. Representation of a project may be further defined and clarified by project maintainers.
      `,
      INFO_COC_TITLE_ENFORCEMENT: 'Enforcement',
      INFO_COC_DESC_ENFORCEMENT: oneLine`
        Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project
        team at [community@vuejs.org](mailto:community@vuejs.org). All complaints will be reviewed and investigated and will result in a response that
        is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain
        confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may
        be posted separately.

        Project maintainers who do not follow or enforce the Code of Conduct in good faith may face temporary or
        permanent repercussions as determined by other members of the project’s leadership.
      `,
      INFO_COC_TITLE_ATTRIBUTION: 'Attribution',
      INFO_COC_DESC_ATTRIBUTION: oneLine`
        This Code of Conduct is adapted from the [Contributor Covenant, version 1.4](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html)
      `,

      INFO_ETIQUETTE_TITLE_PINGING: 'Pinging',
      INFO_ETIQUETTE_DESC_PINGING: stripIndent`
        You don't need to \`@\` someone who responded to you after every message.

        They'll see your responses and respond when they can.

        Additionally, please don't ping people immediately when asking your question (unless you're sure they are the **only** person who can help).
      `,
      INFO_ETIQUETTE_TITLE_AMBIGUITY: 'Ambiguity',
      INFO_ETIQUETTE_DESC_AMBIGUITY: stripIndent`
        Try not to make your question super vague / broad.

        If you can, narrow it down to just one main thing that you're struggling with rather than "Can you help me integrate X with Y".

        It will be easier for people to help.
      `,
      INFO_ETIQUETTE_TITLE_POSTING: 'Cross-posting',
      INFO_ETIQUETTE_DESC_POSTING: stripIndent`
        Please don't post the same question in multiple channels quickly in succession, see \`!dry\`.
      `,
      INFO_ETIQUETTE_TITLE_VOLUNTEERS: 'Volunteers',
      INFO_ETIQUETTE_DESC_VOLUNTEERS: stripIndent`
        Remember that everyone here is a volunteer - they aren't getting paid to help you.
      `,
      INFO_ETIQUETTE_TITLE_DMS: 'DMs',
      INFO_ETIQUETTE_DESC_DMS: stripIndent`
        Please do not DM (private message) people soliciting help without first asking their permission.
      `,
      INFO_ETIQUETTE_TITLE_FORMATTING: 'Formatting',
      INFO_ETIQUETTE_DESC_FORMATTING: stripIndent`
        Please use proper code formatting when sharing code snippets, see \`!code\`.
      `,
      INFO_ETIQUETTE_TITLE_SHARING: 'Sharing',
      INFO_ETIQUETTE_DESC_SHARING: stripIndent`
        If possible, provide a reproduction of the issue, see \`!sharing\`.

        It'll be much easier to help if you do!
      `,

      INFO_SHARING_TITLE_JSFIDDLE: 'JSFiddle',
      INFO_SHARING_DESC_JSFIDDLE: stripIndent`
        JSFiddle is a great choice for sharing a problem or showing off a demo, so long as you aren't using \`vue-cli\`.

        Features:
          • Add dependencies from CDNJS (but not from NPM)
          • Supports HTML, Haml
          • Supports Babel, TypeScript, CoffeeScript etc.
          • Supports SASS/SCSS and PostCSS
          • Collaboration features (code/debug together)
      `,
      INFO_SHARING_TITLE_CODESANDBOX: 'CodeSandbox',
      INFO_SHARING_DESC_CODESANDBOX: stripIndent`
        You can think of CodeSandbox like VS Code but in the browser, it's more of an IDE than a code-sharing site.

        It's the best choice for when your project is using \`vue-cli\`.

        Features:
          • Entire Node ecosystem at your fingertips (NPM support)
          • Supports anything there's an NPM package for
          • Importing from Github (synchronise your repo with a sandbox)
          • Uploading arbitrary files
          • Collaboration features (code/debug together)
      `,
      INFO_SHARING_TITLE_CODEPEN: 'CodePen',
      INFO_SHARING_DESC_CODEPEN: stripIndent`
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
      INFO_SHARING_TITLE_GIST: 'Gist',
      INFO_SHARING_DESC_GIST: stripIndent`
        If you don't need any of that and just want to share some code that won't fit on Discord then perhaps Gist is your best option.

        Features:
          • Forking, revisions (every gist is a git repository)
          • Comments
          • Multiple files
      `,

      INFO_DRY_TITLE: "Don't Repeat Yourself",
      INFO_DRY_DESC: codeHelpChannel => stripIndent`
        When you copy-paste your question in multiple channels, it just leads to duplicated efforts.

        One person might have already answered your question in the first channel.

        Meanwhile, someone in another channel sees your unanswered question and unnecessarily begins to answer.

        If you're not sure where to post your question, just ask. Otherwise, ${codeHelpChannel} is always a safe bet!
      `,

      RFCS_COMMAND_DESCRIPTION: oneLine`
        Interact with VueJS Requests for Comments.
      `,
      RFCS_COMMAND_EXTENDED_HELP: stripIndent`
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
