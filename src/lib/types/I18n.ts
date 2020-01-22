const S = Symbol

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
      export const NO_CHANNEL_WARNING = S('NO_CHANNEL_WARNING')
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
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE_INPUT = S('TITLE_INPUT')
        export const TITLE_OUTPUT = S('TITLE_OUTPUT')
        export const INFO_PAGE_CONTENT = S('INFO_PAGE_CONTENT')
        export const FIELD_NAME_INLINE = S('FIELD_NAME_INLINE')
        export const FIELD_VALUE_INLINE = S('FIELD_VALUE_INLINE')
        export const FIELD_NAME_BLOCK = S('FIELD_NAME_BLOCK')
        export const FIELD_VALUE_BLOCK = S('FIELD_VALUE_BLOCK')
      }

      /**
       * I18n keys for the roles command.
       */
      export namespace Roles {
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE = S('TITLE')
        export const DESC_CORE_TEAM = S('DESC_CORE_TEAM')
        export const DESC_MODERATORS = S('DESC_MODERATORS')
        export const DESC_MVPS = S('DESC_MVPS')
        export const DESC_LIBRARY_MAINTAINERS = S('DESC_LIBRARY_MAINTAINERS')
        export const DESC_COMMUNITY_LEADERS = S('DESC_COMMUNITY_LEADERS')
        export const DESC_NITRO_BOOSTERS = S('DESC_NITRO_BOOSTERS')

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
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE = S('TITLE')
        export const TITLE_PLEDGE = S('TITLE_PLEDGE')
        export const DESC_PLEDGE = S('DESC_PLEDGE')
        export const TITLE_STANDARDS = S('TITLE_STANDARDS')
        export const DESC_STANDARDS = S('DESC_STANDARDS')
        export const TITLE_RESPONSIBILITIES = S('TITLE_RESPONSIBILITIES')
        export const DESC_RESPONSIBILITIES = S('DESC_RESPONSIBILITIES')
        export const TITLE_SCOPE = S('TITLE_SCOPE')
        export const DESC_SCOPE = S('DESC_SCOPE')
        export const TITLE_ENFORCEMENT = S('TITLE_ENFORCEMENT')
        export const DESC_ENFORCEMENT = S('DESC_ENFORCEMENT')
        export const TITLE_ATTRIBUTION = S('TITLE_ATTRIBUTION')
        export const DESC_ATTRIBUTION = S('DESC_ATTRIBUTION')
      }

      /**
       * I18n keys for the etiquette command.
       */
      export namespace Etiquette {
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE_PINGING = S('TITLE_PINGING')
        export const DESC_PINGING = S('DESC_PINGING')
        export const TITLE_AMBIGUITY = S('TITLE_AMBIGUITY')
        export const DESC_AMBIGUITY = S('DESC_AMBIGUITY')
        export const TITLE_POSTING = S('TITLE_POSTING')
        export const DESC_POSTING = S('DESC_POSTING')
        export const TITLE_VOLUNTEERS = S('TITLE_VOLUNTEERS')
        export const DESC_VOLUNTEERS = S('DESC_VOLUNTEERS')
        export const TITLE_DMS = S('TITLE_DMS')
        export const DESC_DMS = S('DESC_DMS')
        export const TITLE_FORMATTING = S('TITLE_FORMATTING')
        export const DESC_FORMATTING = S('DESC_FORMATTING')
        export const TITLE_SHARING = S('TITLE_SHARING')
        export const DESC_SHARING = S('DESC_SHARING')

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
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE_JSFIDDLE = S('TITLE_JSFIDDLE')
        export const DESC_JSFIDDLE = S('DESC_JSFIDDLE')
        export const TITLE_CODESANDBOX = S('TITLE_CODESANDBOX')
        export const DESC_CODESANDBOX = S('DESC_CODESANDBOX')
        export const TITLE_CODEPEN = S('TITLE_CODEPEN')
        export const DESC_CODEPEN = S('DESC_CODEPEN')
        export const TITLE_GIST = S('TITLE_GIST')
        export const DESC_GIST = S('DESC_GIST')

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
        export const DESC = S('DESC')
        export const HELP = S('HELP')
        export const TITLE = S('TITLE')
        export const BODY = S('BODY')
      }
    }

    export namespace RFC {
      export const DESC = S('DESC')
      export const HELP = S('HELP')
      export const ARGUMENT_QUERY = S('ARGUMENT_QUERY')
      export const TITLE_NO_MATCHS = S('TITLE_NO_MATCHS')
      export const DESC_NO_MATCHS = S('DESC_NO_MATCHS')
      export const LIST_FILTER_INVALID = S('LIST_FILTER_INVALID')
      export const LIST_FILTER_NO_RESULTS = S('LIST_FILTER_NO_RESULTS')
      export const TITLE_INFO_PAGE = S('TITLE_INFO_PAGE')
      export const DESC_INFO_PAGE = S('DESC_INFO_PAGE')
      export const TITLE_EMBED = S('TITLE_EMBED')
      export const REFRESH_SUCCESS = S('REFRESH_SUCCESS')
      export const REFRESH_FAILURE = S('REFRESH_FAILURE')
    }
  }

  /**
   * Miscellaneous I18n keys that don't fit anywhere else.
   */
  export namespace Misc {
    export const ERROR_GENERIC = S('ERROR_GENERIC')
    export const ERROR_PERM_USER = S('ERROR_PERM_USER')
    export const ERROR_PERM_BOT = S('ERROR_PERM_BOT')
    export const DM_SENT = S('DM_SENT')
    export const RESOLVER_INVALID_REPO = S('RESOLVER_INVALID_REPO')
    export const RESOLVER_INVALID_RELEASE_ENTRY = S(
      'RESOLVER_INVALID_RELEASE_ENTRY'
    )
  }
}
