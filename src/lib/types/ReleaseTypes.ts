import { ValidVueRepositories } from './MiscTypes'

/**
 * Represents a ReleaseEntry as stored in the guild schema
 *
 * @see ReleaseSchema
 * @see ReleaseEntrySerializer
 */
export interface ReleaseEntry {
  repo: ValidVueRepositories
  version: string
  announced: number
}
