import * as RolesEnums from '@libraries/types/Roles'

/**
 * Represents I18n language keys.
 */
export const I18n = {
  /**
   * I18n keys for tasks.
   */
  Tasks: {
    Release: {
      NO_CHANNEL_WARNING: 'NO_CHANNEL_WARNING',
    },
  },

  /**
   * I18n keys for commands.
   */
  Cmd: {
    /**
     * I18n keys for commands in the informational category.
     */
    Info: {
      /**
       * I18n keys for the code command.
       */
      Code: {
        PREFIX: 'CODE',

        DESC: 'CODE_DESC',
        HELP: 'CODE_HELP',
        TITLE_INPUT: 'CODE_TITLE_INPUT',
        TITLE_OUTPUT: 'CODE_TITLE_OUTPUT',
        INFO_PAGE_CONTENT: 'CODE_INFO_PAGE_CONTENT',
        FIELD_NAME_INLINE: 'CODE_FIELD_NAME_INLINE',
        FIELD_VALUE_INLINE: 'CODE_FIELD_VALUE_INLINE',
        FIELD_NAME_BLOCK: 'CODE_FIELD_NAME_BLOCK',
        FIELD_VALUE_BLOCK: 'CODE_FIELD_VALUE_BLOCK',
      },

      /**
       * I18n keys for the roles command.
       */
      Roles: {
        PREFIX: 'ROLES',

        DESC: 'ROLES_DESC',
        HELP: 'ROLES_HELP',
        TITLE: 'ROLES_TITLE',
        DESC_CORE_TEAM: 'ROLES_DESC_CORE_TEAM',
        DESC_MODERATORS: 'ROLES_DESC_MODERATORS',
        DESC_MVPS: 'ROLES_DESC_MVPS',
        DESC_LIBRARY_MAINTAINERS: 'ROLES_DESC_LIBRARY_MAINTAINERS',
        DESC_COMMUNITY_LEADERS: 'ROLES_DESC_COMMUNITY_LEADERS',
        DESC_NITRO_BOOSTERS: 'ROLES_DESC_NITRO_BOOSTERS',

        /*
          NOTE: Make sure to go to @libraries/types/Roles and update things, if
          the above language keys ever change (e.g. NITRO_BOOSTERS -> BOOSTERS).
          FIXME: Would be nice if it wasn't necessary but it's doubtful they'll change.
        */
        ROLES_NAMES: RolesEnums.ROLES_NAMES,
        ROLES_FRIENDLY_NAMES: RolesEnums.ROLES_FRIENDLY_NAMES,
      },

      /**
       * I18n keys for the coc command.
       */
      CoC: {
        PREFIX: 'COC',

        DESC: 'COC_DESC',
        HELP: 'COC_HELP',
        TITLE: 'COC_TITLE',
        TITLE_PLEDGE: 'COC_TITLE_PLEDGE',
        DESC_PLEDGE: 'COC_DESC_PLEDGE',
        TITLE_STANDARDS: 'COC_TITLE_STANDARDS',
        DESC_STANDARDS: 'COC_DESC_STANDARDS',
        TITLE_RESPONSIBILITIES: 'COC_TITLE_RESPONSIBILITIES',
        DESC_RESPONSIBILITIES: 'COC_DESC_RESPONSIBILITIES',
        TITLE_SCOPE: 'COC_TITLE_SCOPE',
        DESC_SCOPE: 'COC_DESC_SCOPE',
        TITLE_ENFORCEMENT: 'COC_TITLE_ENFORCEMENT',
        DESC_ENFORCEMENT: 'COC_DESC_ENFORCEMENT',
        TITLE_ATTRIBUTION: 'COC_TITLE_ATTRIBUTION',
        DESC_ATTRIBUTION: 'COC_DESC_ATTRIBUTION',
      },

      /**
       * I18n keys for the etiquette command.
       */
      Etiquette: {
        PREFIX: 'ETIQUETTE',

        DESC: 'ETIQUETTE_DESC',
        HELP: 'ETIQUETTE_HELP',
        TITLE_PINGING: 'ETIQUETTE_TITLE_PINGING',
        DESC_PINGING: 'ETIQUETTE_DESC_PINGING',
        TITLE_AMBIGUITY: 'ETIQUETTE_TITLE_AMBIGUITY',
        DESC_AMBIGUITY: 'ETIQUETTE_DESC_AMBIGUITY',
        TITLE_POSTING: 'ETIQUETTE_TITLE_POSTING',
        DESC_POSTING: 'ETIQUETTE_DESC_POSTING',
        TITLE_VOLUNTEERS: 'ETIQUETTE_TITLE_VOLUNTEERS',
        DESC_VOLUNTEERS: 'ETIQUETTE_DESC_VOLUNTEERS',
        TITLE_DMS: 'ETIQUETTE_TITLE_DMS',
        DESC_DMS: 'ETIQUETTE_DESC_DMS',
        TITLE_FORMATTING: 'ETIQUETTE_TITLE_FORMATTING',
        DESC_FORMATTING: 'ETIQUETTE_DESC_FORMATTING',
        TITLE_SHARING: 'ETIQUETTE_TITLE_SHARING',
        DESC_SHARING: 'ETIQUETTE_DESC_SHARING',

        SectionNames: {
          PINGING: 'PINGING',
          AMBIGUITY: 'AMBIGUITY',
          POSTING: 'POSTING',
          VOLUNTEERS: 'VOLUNTEERS',
          DMS: 'DMS',
          FORMATTING: 'FORMATTING',
          SHARING: 'SHARING',
        },
      },

      /**
       * I18n keys for the sharing command.
       */
      Sharing: {
        PREFIX: 'SHARING',

        DESC: 'SHARING_DESC',
        HELP: 'SHARING_HELP',
        TITLE_JSFIDDLE: 'SHARING_TITLE_JSFIDDLE',
        DESC_JSFIDDLE: 'SHARING_DESC_JSFIDDLE',
        TITLE_CODESANDBOX: 'SHARING_TITLE_CODESANDBOX',
        DESC_CODESANDBOX: 'SHARING_DESC_CODESANDBOX',
        TITLE_CODEPEN: 'SHARING_TITLE_CODEPEN',
        DESC_CODEPEN: 'SHARING_DESC_CODEPEN',
        TITLE_GIST: 'SHARING_TITLE_GIST',
        DESC_GIST: 'SHARING_DESC_GIST',

        SectionNames: {
          JSFIDDLE: 'JSFIDDLE',
          CODESANDBOX: 'CODESANDBOX',
          CODEPEN: 'CODEPEN',
          GIST: 'GIST',
        },
      },

      /**
       * I18n keys for the DRY command.
       */
      DRY: {
        PREFIX: 'DRY',

        DESC: 'DRY_DESC',
        HELP: 'DRY_HELP',
        TITLE: 'DRY_TITLE',
        BODY: 'DRY_BODY',
      },
    },

    /**
     * I18n keys for commands in the documentation category.
     */
    Docs: {
      Guide: {
        DESC: 'GUIDE_DESC',
        HELP: 'GUIDE_HELP',
        INFO_PAGE_TITLE: 'GUIDE_INFO_PAGE_TITLE',
        INFO_PAGE_DESC: 'GUIDE_INFO_PAGE_DESC',
      },

      API: {
        DESC: 'API_DESC',
        HELP: 'API_HELP',
        INFO_PAGE_TITLE: 'API_INFO_PAGE_TITLE',
        INFO_PAGE_DESC: 'API_INFO_PAGE_DESC',
      },
    },

    RFC: {
      PREFIX: 'RFC',

      DESC: 'RFC_DESC',
      HELP: 'RFC_HELP',
      ARGUMENT_QUERY: 'RFC_ARGUMENT_QUERY',
      TITLE_NO_MATCHS: 'RFC_TITLE_NO_MATCHS',
      DESC_NO_MATCHS: 'RFC_DESC_NO_MATCHS',
      LIST_FILTER_INVALID: 'RFC_LIST_FILTER_INVALID',
      LIST_FILTER_NO_RESULTS: 'RFC_LIST_FILTER_NO_RESULTS',
      TITLE_INFO_PAGE: 'RFC_TITLE_INFO_PAGE',
      DESC_INFO_PAGE: 'RFC_DESC_INFO_PAGE',
      TITLE_EMBED: 'RFC_TITLE_EMBED',
      REFRESH_SUCCESS: 'RFC_REFRESH_SUCCESS',
      REFRESH_FAILURE: 'RFC_REFRESH_FAILURE',
      MERGED_AT: 'RFC_MERGED_AT,',
    },
  },

  /**
   * I18n keys for services.
   */
  Services: {
    Doc: {
      ERROR_CLIENT_DISABLED: 'DOC_ERROR_CLIENT_DISABLED',
      ERROR_GUILD_DISABLED: 'DOC_ERROR_GUILD_DISABLED',
    },
  },

  /**
   * Miscellaneous I18n keys that don't fit anywhere else.
   */
  Misc: {
    PREFIX: 'MISC',

    ERROR_GENERIC: 'MISC_ERROR_GENERIC',
    ERROR_PERM_USER: 'MISC_ERROR_PERM_USER',
    ERROR_PERM_BOT: 'MISC_ERROR_PERM_BOT',
    ERROR_NO_DMS: 'ERROR_NO_DMS',
    DM_SENT: 'MISC_DM_SENT',
    RESOLVER_INVALID_REPO: 'MISC_RESOLVER_INVALID_REPO',
    RESOLVER_INVALID_RELEASE_ENTRY: 'MISC_RESOLVER_INVALID_RELEASE_ENTRY',
    UPDATED_AT: 'MISC_UPDATED_AT',
    CREATED_AT: 'MISC_CREATED_AT',
    LABELS: 'MISC_LABELS',
    STATUS: 'MISC_STATUS',
    AUTHOR: 'MISC_AUTHOR',
    COMMENTS: 'MISC_COMMENTS',
    NONE: 'MISC_NONE',
    TITLE_NO_MATCHES: 'MISC_TITLE_NO_MATCHES',
    DESC_NO_MATCHES: 'DESC_TITLE_NO_MATCHES',
  },
} as const
