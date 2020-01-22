import * as RolesEnums from '@libraries/types/Roles'

/**
 * Represents I18n language keys.
 */
export namespace I18n {
  /**
   * I18n keys for tasks.
   */
  export namespace Tasks {
    export namespace Release {
      export const NO_CHANNEL_WARNING = 'NO_CHANNEL_WARNING'
    }
  }

  /**
   * I18n keys for commands.
   */
  export namespace Cmd {
    /**
     * I18n keys for commands in the informational category.
     */
    export namespace Info {
      /**
       * I18n keys for the code command.
       */
      export namespace Code {
        export const PREFIX = 'CODE'

        export const DESC = 'CODE_DESC'
        export const HELP = 'CODE_HELP'
        export const TITLE_INPUT = 'CODE_TITLE_INPUT'
        export const TITLE_OUTPUT = 'CODE_TITLE_OUTPUT'
        export const INFO_PAGE_CONTENT = 'CODE_INFO_PAGE_CONTENT'
        export const FIELD_NAME_INLINE = 'CODE_FIELD_NAME_INLINE'
        export const FIELD_VALUE_INLINE = 'CODE_FIELD_VALUE_INLINE'
        export const FIELD_NAME_BLOCK = 'CODE_FIELD_NAME_BLOCK'
        export const FIELD_VALUE_BLOCK = 'CODE_FIELD_VALUE_BLOCK'
      }

      /**
       * I18n keys for the roles command.
       */
      export namespace Roles {
        export const PREFIX = 'ROLES'

        export const DESC = 'ROLES_DESC'
        export const HELP = 'ROLES_HELP'
        export const TITLE = 'ROLES_TITLE'
        export const DESC_CORE_TEAM = 'ROLES_DESC_CORE_TEAM'
        export const DESC_MODERATORS = 'ROLES_DESC_MODERATORS'
        export const DESC_MVPS = 'ROLES_DESC_MVPS'
        export const DESC_LIBRARY_MAINTAINERS = 'ROLES_DESC_LIBRARY_MAINTAINERS'
        export const DESC_COMMUNITY_LEADERS = 'ROLES_DESC_COMMUNITY_LEADERS'
        export const DESC_NITRO_BOOSTERS = 'ROLES_DESC_NITRO_BOOSTERS'

        /*
          NOTE: Make sure to go to @libraries/types/Roles and update things, if
          the above language keys ever change (e.g. NITRO_BOOSTERS -> BOOSTERS).
          FIXME: Would be nice if it wasn't necessary but it's doubtful they'll change.
        */
        export const ROLES_NAMES = RolesEnums.ROLES_NAMES
        export const ROLES_FRIENDLY_NAMES = RolesEnums.ROLES_FRIENDLY_NAMES
      }

      /**
       * I18n keys for the coc command.
       */
      export namespace CoC {
        export const PREFIX = 'COC'

        export const DESC = 'COC_DESC'
        export const HELP = 'COC_HELP'
        export const TITLE = 'COC_TITLE'
        export const TITLE_PLEDGE = 'COC_TITLE_PLEDGE'
        export const DESC_PLEDGE = 'COC_DESC_PLEDGE'
        export const TITLE_STANDARDS = 'COC_TITLE_STANDARDS'
        export const DESC_STANDARDS = 'COC_DESC_STANDARDS'
        export const TITLE_RESPONSIBILITIES = 'COC_TITLE_RESPONSIBILITIES'
        export const DESC_RESPONSIBILITIES = 'COC_DESC_RESPONSIBILITIES'
        export const TITLE_SCOPE = 'COC_TITLE_SCOPE'
        export const DESC_SCOPE = 'COC_DESC_SCOPE'
        export const TITLE_ENFORCEMENT = 'COC_TITLE_ENFORCEMENT'
        export const DESC_ENFORCEMENT = 'COC_DESC_ENFORCEMENT'
        export const TITLE_ATTRIBUTION = 'COC_TITLE_ATTRIBUTION'
        export const DESC_ATTRIBUTION = 'COC_DESC_ATTRIBUTION'
      }

      /**
       * I18n keys for the etiquette command.
       */
      export namespace Etiquette {
        export const PREFIX = 'ETIQUETTE'

        export const DESC = 'ETIQUETTE_DESC'
        export const HELP = 'ETIQUETTE_HELP'
        export const TITLE_PINGING = 'ETIQUETTE_TITLE_PINGING'
        export const DESC_PINGING = 'ETIQUETTE_DESC_PINGING'
        export const TITLE_AMBIGUITY = 'ETIQUETTE_TITLE_AMBIGUITY'
        export const DESC_AMBIGUITY = 'ETIQUETTE_DESC_AMBIGUITY'
        export const TITLE_POSTING = 'ETIQUETTE_TITLE_POSTING'
        export const DESC_POSTING = 'ETIQUETTE_DESC_POSTING'
        export const TITLE_VOLUNTEERS = 'ETIQUETTE_TITLE_VOLUNTEERS'
        export const DESC_VOLUNTEERS = 'ETIQUETTE_DESC_VOLUNTEERS'
        export const TITLE_DMS = 'ETIQUETTE_TITLE_DMS'
        export const DESC_DMS = 'ETIQUETTE_DESC_DMS'
        export const TITLE_FORMATTING = 'ETIQUETTE_TITLE_FORMATTING'
        export const DESC_FORMATTING = 'ETIQUETTE_DESC_FORMATTING'
        export const TITLE_SHARING = 'ETIQUETTE_TITLE_SHARING'
        export const DESC_SHARING = 'ETIQUETTE_DESC_SHARING'

        export enum SectionNames {
          PINGING = 'PINGING',
          AMBIGUITY = 'AMBIGUITY',
          POSTING = 'POSTING',
          VOLUNTEERS = 'VOLUNTEERS',
          DMS = 'DMS',
          FORMATTING = 'FORMATTING',
          SHARING = 'SHARING',
        }
      }

      /**
       * I18n keys for the sharing command.
       */
      export namespace Sharing {
        export const PREFIX = 'SHARING'

        export const DESC = 'SHARING_DESC'
        export const HELP = 'SHARING_HELP'
        export const TITLE_JSFIDDLE = 'SHARING_TITLE_JSFIDDLE'
        export const DESC_JSFIDDLE = 'SHARING_DESC_JSFIDDLE'
        export const TITLE_CODESANDBOX = 'SHARING_TITLE_CODESANDBOX'
        export const DESC_CODESANDBOX = 'SHARING_DESC_CODESANDBOX'
        export const TITLE_CODEPEN = 'SHARING_TITLE_CODEPEN'
        export const DESC_CODEPEN = 'SHARING_DESC_CODEPEN'
        export const TITLE_GIST = 'SHARING_TITLE_GIST'
        export const DESC_GIST = 'SHARING_DESC_GIST'

        export enum SectionNames {
          JSFIDDLE = 'JSFIDDLE',
          CODESANDBOX = 'CODESANDBOX',
          CODEPEN = 'CODEPEN',
          GIST = 'GIST',
        }
      }

      /**
       * I18n keys for the DRY command.
       */
      export namespace DRY {
        export const PREFIX = 'DRY'

        export const DESC = 'DRY_DESC'
        export const HELP = 'DRY_HELP'
        export const TITLE = 'DRY_TITLE'
        export const BODY = 'DRY_BODY'
      }
    }

    export namespace RFC {
      export const PREFIX = 'RFC'

      export const DESC = 'RFC_DESC'
      export const HELP = 'RFC_HELP'
      export const ARGUMENT_QUERY = 'RFC_ARGUMENT_QUERY'
      export const TITLE_NO_MATCHS = 'RFC_TITLE_NO_MATCHS'
      export const DESC_NO_MATCHS = 'RFC_DESC_NO_MATCHS'
      export const LIST_FILTER_INVALID = 'RFC_LIST_FILTER_INVALID'
      export const LIST_FILTER_NO_RESULTS = 'RFC_LIST_FILTER_NO_RESULTS'
      export const TITLE_INFO_PAGE = 'RFC_TITLE_INFO_PAGE'
      export const DESC_INFO_PAGE = 'RFC_DESC_INFO_PAGE'
      export const TITLE_EMBED = 'RFC_TITLE_EMBED'
      export const REFRESH_SUCCESS = 'RFC_REFRESH_SUCCESS'
      export const REFRESH_FAILURE = 'RFC_REFRESH_FAILURE'
    }
  }

  /**
   * Miscellaneous I18n keys that don't fit anywhere else.
   */
  export namespace Misc {
    export const PREFIX = 'MISC'

    export const ERROR_GENERIC = 'MISC_ERROR_GENERIC'
    export const ERROR_PERM_USER = 'MISC_ERROR_PERM_USER'
    export const ERROR_PERM_BOT = 'MISC_ERROR_PERM_BOT'
    export const DM_SENT = 'MISC_DM_SENT'
    export const RESOLVER_INVALID_REPO = 'MISC_RESOLVER_INVALID_REPO'
    export const RESOLVER_INVALID_RELEASE_ENTRY =
      'MISC_RESOLVER_INVALID_RELEASE_ENTRY'
    export const UPDATED_AT = 'MISC_UPDATED_AT'
    export const CREATED_AT = 'MISC_CREATED_AT'
    export const LABELS = 'MISC_LABELS'
    export const STATUS = 'MISC_STATUS'
    export const AUTHOR = 'MISC_AUTHOR'
  }
}
