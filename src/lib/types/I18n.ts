/**
 * Represents I18n language keys.
 *
 * The rationale for doing this is that an invalid key is now a type error.
 */
export const I18n = {
  /**
   * I18n keys for tasks.
   */
  Tasks: {
    Release: {
      NO_CHANNEL_WARNING: 'TASK_RELEASE_NO_CHANNEL_WARNING',
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
        DESC: 'COMMAND_CODE_DESC',
        HELP: 'COMMAND_CODE_HELP',
        TITLE_INPUT: 'COMMAND_CODE_TITLE_INPUT',
        TITLE_OUTPUT: 'COMMAND_CODE_TITLE_OUTPUT',
        INFO_PAGE_CONTENT: 'COMMAND_CODE_INFO_PAGE_CONTENT',
        FIELD_NAME_INLINE: 'COMMAND_CODE_FIELD_NAME_INLINE',
        FIELD_VALUE_INLINE: 'COMMAND_CODE_FIELD_VALUE_INLINE',
        FIELD_NAME_BLOCK: 'COMMAND_CODE_FIELD_NAME_BLOCK',
        FIELD_VALUE_BLOCK: 'COMMAND_CODE_FIELD_VALUE_BLOCK',
      },

      /**
       * I18n keys for the roles command.
       *
       * NOTE: If the keys change, or new roles are added, then
       * `@libraries/types/Roles` will also need to be changed.
       */
      Roles: {
        DESC: 'COMMAND_ROLES_DESC',
        HELP: 'COMMAND_ROLES_HELP',
        TITLE: 'COMMAND_ROLES_TITLE',
        DESC_CORE_TEAM: 'COMMAND_ROLES_DESC_CORE_TEAM',
        DESC_MODERATORS: 'COMMAND_ROLES_DESC_MODERATORS',
        DESC_MVPS: 'COMMAND_ROLES_DESC_MVPS',
        DESC_LIBRARY_MAINTAINERS: 'COMMAND_ROLES_DESC_LIBRARY_MAINTAINERS',
        DESC_COMMUNITY_LEADERS: 'COMMAND_ROLES_DESC_COMMUNITY_LEADERS',
        DESC_NITRO_BOOSTERS: 'COMMAND_ROLES_DESC_NITRO_BOOSTERS',
      },

      /**
       * I18n keys for the coc command.
       */
      CoC: {
        DESC: 'COMMAND_COC_DESC',
        HELP: 'COMMAND_COC_HELP',
        TITLE: 'COMMAND_COC_TITLE',
        TITLE_PLEDGE: 'COMMAND_COC_TITLE_PLEDGE',
        DESC_PLEDGE: 'COMMAND_COC_DESC_PLEDGE',
        TITLE_STANDARDS: 'COMMAND_COC_TITLE_STANDARDS',
        DESC_STANDARDS: 'COMMAND_COC_DESC_STANDARDS',
        TITLE_RESPONSIBILITIES: 'COMMAND_COC_TITLE_RESPONSIBILITIES',
        DESC_RESPONSIBILITIES: 'COMMAND_COC_DESC_RESPONSIBILITIES',
        TITLE_SCOPE: 'COMMAND_COC_TITLE_SCOPE',
        DESC_SCOPE: 'COMMAND_COC_DESC_SCOPE',
        TITLE_ENFORCEMENT: 'COMMAND_COC_TITLE_ENFORCEMENT',
        DESC_ENFORCEMENT: 'COMMAND_COC_DESC_ENFORCEMENT',
        TITLE_ATTRIBUTION: 'COMMAND_COC_TITLE_ATTRIBUTION',
        DESC_ATTRIBUTION: 'COMMAND_COC_DESC_ATTRIBUTION',
      },

      /**
       * I18n keys for the etiquette command.
       *
       * NOTE: See also the `EtiquetteSections` export below.
       */
      Etiquette: {
        DESC: 'COMMAND_ETIQUETTE_DESC',
        HELP: 'COMMAND_ETIQUETTE_HELP',
        TITLE_PINGING: 'COMMAND_ETIQUETTE_TITLE_PINGING',
        DESC_PINGING: 'COMMAND_ETIQUETTE_DESC_PINGING',
        TITLE_AMBIGUITY: 'COMMAND_ETIQUETTE_TITLE_AMBIGUITY',
        DESC_AMBIGUITY: 'COMMAND_ETIQUETTE_DESC_AMBIGUITY',
        TITLE_POSTING: 'COMMAND_ETIQUETTE_TITLE_POSTING',
        DESC_POSTING: 'COMMAND_ETIQUETTE_DESC_POSTING',
        TITLE_VOLUNTEERS: 'COMMAND_ETIQUETTE_TITLE_VOLUNTEERS',
        DESC_VOLUNTEERS: 'COMMAND_ETIQUETTE_DESC_VOLUNTEERS',
        TITLE_DMS: 'COMMAND_ETIQUETTE_TITLE_DMS',
        DESC_DMS: 'COMMAND_ETIQUETTE_DESC_DMS',
        TITLE_FORMATTING: 'COMMAND_ETIQUETTE_TITLE_FORMATTING',
        DESC_FORMATTING: 'COMMAND_ETIQUETTE_DESC_FORMATTING',
        TITLE_SHARING: 'COMMAND_ETIQUETTE_TITLE_SHARING',
        DESC_SHARING: 'COMMAND_ETIQUETTE_DESC_SHARING',
      },

      /**
       * I18n keys for the sharing command.
       *
       * NOTE: See also the `SharingSections` export below.
       */
      Sharing: {
        DESC: 'COMMAND_SHARING_DESC',
        HELP: 'COMMAND_SHARING_HELP',
        TITLE_JSFIDDLE: 'COMMAND_SHARING_TITLE_JSFIDDLE',
        DESC_JSFIDDLE: 'COMMAND_SHARING_DESC_JSFIDDLE',
        TITLE_CODESANDBOX: 'COMMAND_SHARING_TITLE_CODESANDBOX',
        DESC_CODESANDBOX: 'COMMAND_SHARING_DESC_CODESANDBOX',
        TITLE_CODEPEN: 'COMMAND_SHARING_TITLE_CODEPEN',
        DESC_CODEPEN: 'COMMAND_SHARING_DESC_CODEPEN',
        TITLE_GIST: 'COMMAND_SHARING_TITLE_GIST',
        DESC_GIST: 'COMMAND_SHARING_DESC_GIST',
      },

      /**
       * I18n keys for the DRY command.
       */
      DRY: {
        DESC: 'COMMAND_DRY_DESC',
        HELP: 'COMMAND_DRY_HELP',
        TITLE: 'COMMAND_DRY_TITLE',
        BODY: 'COMMAND_DRY_BODY',
      },
    },

    /**
     * I18n keys for commands in the documentation category.
     */
    Docs: {
      Guide: {
        DESC: 'COMMAND_GUIDE_DESC',
        HELP: 'COMMAND_GUIDE_HELP',
        INFO_PAGE_TITLE: 'COMMAND_GUIDE_INFO_PAGE_TITLE',
        INFO_PAGE_DESC: 'COMMAND_GUIDE_INFO_PAGE_DESC',
      },

      API: {
        DESC: 'COMMAND_API_DESC',
        HELP: 'COMMAND_API_HELP',
        INFO_PAGE_TITLE: 'COMMAND_API_INFO_PAGE_TITLE',
        INFO_PAGE_DESC: 'COMMAND_API_INFO_PAGE_DESC',
      },
    },

    RFC: {
      // PREFIX: 'COMMAND_RFC',
      DESC: 'COMMAND_RFC_DESC',
      HELP: 'COMMAND_RFC_HELP',
      ARGUMENT_QUERY: 'COMMAND_RFC_ARGUMENT_QUERY',
      TITLE_NO_MATCHS: 'COMMAND_RFC_TITLE_NO_MATCHS',
      DESC_NO_MATCHS: 'COMMAND_RFC_DESC_NO_MATCHS',
      LIST_FILTER_INVALID: 'COMMAND_RFC_LIST_FILTER_INVALID',
      LIST_FILTER_NO_RESULTS: 'COMMAND_RFC_LIST_FILTER_NO_RESULTS',
      TITLE_INFO_PAGE: 'COMMAND_RFC_TITLE_INFO_PAGE',
      DESC_INFO_PAGE: 'COMMAND_RFC_DESC_INFO_PAGE',
      TITLE_EMBED: 'COMMAND_RFC_TITLE_EMBED',
      REFRESH_SUCCESS: 'COMMAND_RFC_REFRESH_SUCCESS',
      REFRESH_FAILURE: 'COMMAND_RFC_REFRESH_FAILURE',
      MERGED_AT: 'COMMAND_RFC_MERGED_AT,',
    },
  },

  /**
   * I18n keys for services.
   */
  Services: {
    Doc: {
      ERROR_CLIENT_DISABLED: 'SERVICE_DOC_ERROR_CLIENT_DISABLED',
      ERROR_GUILD_DISABLED: 'SERVICE_DOC_ERROR_GUILD_DISABLED',
    },
  },

  /**
   * Miscellaneous I18n keys that don't fit anywhere else.
   */
  Misc: {
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

  DEFAULT: 'DEFAULT',
} as const

export type Translations = Record<I18nKey, I18nValue>

export const EtiquetteSections = {
  PINGING: 'PINGING',
  AMBIGUITY: 'AMBIGUITY',
  POSTING: 'POSTING',
  VOLUNTEERS: 'VOLUNTEERS',
  DMS: 'DMS',
  FORMATTING: 'FORMATTING',
  SHARING: 'SHARING',
} as const

export const SharingSections = {
  JSFIDDLE: 'JSFIDDLE',
  CODESANDBOX: 'CODESANDBOX',
  CODEPEN: 'CODEPEN',
  GIST: 'GIST',
} as const

type I18nKey = DeepAllValues<typeof I18n, string>
type I18nValue = string | string[] | ((...args: any[]) => string | string[])
type Helper<T, U> = {
  [K in keyof T]: T[K] extends U ? T[K] : DeepAllValues<T[K], U>
}
type DeepAllValues<T, U> = Helper<T, U>[keyof Helper<T, U>]
