import { readFileSync, readFile } from 'fs'
import { join } from 'path'

import { KlasaGuild } from 'klasa'
import { ReposListReleasesResponseItem } from '@octokit/rest'
import * as semver from 'semver'

import '@schemas/ReleaseSchema'

import github from '@libraries/GithubClient'
import { ValidVueRepositories } from '@libraries/types/MiscTypes'
import Service from '@structures/Service'
import { ReleaseSettings } from '@settings/ReleaseSettings'
import { PATHS } from '@libraries/constants'

/**
 * The ReleaseService is responsible for most things relating to
 * checking official VueJS repositories for new releases/announcing them.
 */
/*
  TODO: We need to cache the release lists from Github, because otherwise if the
  release check task runs too often then we will flood the API with unnecessary
  requests - the likelihood of there being new releases 1 minute or 5 minutes from
  the last check is extremely miniscule. Also, we should probably abstract this into
  some kind of CachedJSON class, since the RFCService also does that kind of thing.
*/
export default class ReleaseService extends Service {
  /**
   * The user/organisation which owns all Vue repositories.
   */
  static OWNER = 'vuejs'

  /**
   * When enabled. we'll use a local cache of the release data, instead of
   * hitting the Github API, this data will also be used by the test suite.
   *
   * @see debugPayloads
   */
  static DEBUG_MODE = true

  /**
   * The from-disc payloads for `getReleases` in `DEBUG_MODE`. Note that
   * only vue, vuex, vue-cli and vue-router have debug payloads.
   */
  static debugPayloads: {
    [key: string]: ReposListReleasesResponseItem[]
  } = {}

  async init() {
    this.log('Initialised.')

    if (ReleaseService.DEBUG_MODE) {
      for (const repo of ['vue', 'vuex', 'vue-cli', 'vue-router']) {
        ReleaseService.debugPayloads[repo] = JSON.parse(
          readFileSync(join(PATHS.DATA, 'test', 'releases', `${repo}.json`), {
            encoding: 'utf8',
          })
        )
      }

      this.log('Loaded debug payloads.')
    }
  }

  /**
   * Return **all** releases for a specific VueJS repo, sorted by newest tag names in
   * ascending order, filtering out data we're not interested in for each release.
   *
   * Returns an empty array if an error occurs.
   */
  async getReleases(repo: string) {
    this.debug(`Requesting releases for ${repo}.`)

    if (ReleaseService.DEBUG_MODE) {
      return ReleaseService.debugPayloads[repo] ?? []
    }

    try {
      const response: ReposListReleasesResponseItem[] = await github.paginate(
        'GET /repos/:owner/:repo/releases',
        {
          owner: ReleaseService.OWNER,
          repo: repo,
        }
      )

      return response
        .sort((a, b) => (semver.lt(a.tag_name, b.tag_name) ? 1 : -1))
        .map(release => this.extractData(repo, release))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  /**
   * Extract only the data we care about from the API response.
   */
  private extractData(
    repo: string,
    release: ReposListReleasesResponseItem
  ): Release {
    return {
      url: release.html_url,
      repo: repo,
      tag_name: release.tag_name,
      draft: release.draft,
      prerelease: release.prerelease,
      author: {
        login: release.author.login,
        url: release.author.html_url,
        avatar_url: release.author.avatar_url,
      },
      body: release.body,
      created_at: new Date(release.created_at).toUTCString(),
    }
  }

  /**
   * Run `getReleases` for every repo passed.
   */
  async getAllReleases(repos: Set<string>) {
    this.debug(`Requesting all releases (${Array.from(repos).join(', ')}).`)

    const promises = []
    for (const repo of repos) {
      promises.push(this.getReleases(repo))
    }

    return Promise.all(promises)
      .then(results =>
        results.reduce((array, item) => {
          array.push(...item)
          return array
        }, [])
      )
      .catch(error => {
        this.error(error)
        return []
      })
  }

  /**
   * Returns a Collection containing guilds which have release announcements enabled.
   */
  getEnabledGuilds(checkForValidChannel = true) {
    return this.client.guilds.filter(guild => {
      try {
        return guild.settings.get(ReleaseSettings.Guild.ENABLED)
      } catch (error) {
        this.error(error)
        return false
      }
    })
  }

  /**
   * The repositories we'll need to check can vary depending on guild settings.
   *
   * Consider:
   *
   *   - Guild A: `releases.repos = ['vue', 'vuex']`
   *   - Guild B: `releases.repos = ['vue-router', 'vue']`
   *
   * Thus the list of repos to check is `['vue', 'vuex', 'vue-router']`.
   */
  getEnabledRepositories(): Set<ValidVueRepositories> {
    const result = new Set<ValidVueRepositories>()
    const guilds = this.getEnabledGuilds()

    for (const [id, guild] of guilds) {
      try {
        guild.settings
          .get(ReleaseSettings.Guild.REPOS)
          .forEach(repoName => result.add(repoName))
      } catch (error) {
        this.error(error)
      }
    }

    this.debug(`Enabled repositories are ${Array.from(result).join(', ')}`)

    return result
  }

  /**
   * Determine which release(s) are newer than the guild's last-announced
   * release(s), then filters them down to a sane amount and build an object.
   */
  filterGuildReleases(
    repos: Release[],
    guild: KlasaGuild
  ): {
    [key: string]: Release[]
  } {
    try {
      if (!guild) {
        this.warn(`No guild passed to filterGuildReleases!`)
        throw new Error('No guild passed!')
      }

      this.verbose(`Filtering ${repos.length} guild releases for ${guild.name}`)

      const enabledRepos = guild.settings.get(ReleaseSettings.Guild.REPOS)

      return repos
        .filter(release => enabledRepos.some(repo => repo === release.repo))
        .filter(release => {
          try {
            // The ReleaseEntry for this repo, from the last announcement.
            const guildVersions =
              guild.settings.get(ReleaseSettings.Guild.VERSIONS) ?? []
            const lastGuildRelease = guildVersions.find(
              ({ repo }) => repo === release.repo
            )

            // prettier-ignore
            this.verbose(
              `Checking if ${release.repo} ${release.tag_name} (api) > ${lastGuildRelease?.version ?? 'n/a'} (settings).`
            )

            return lastGuildRelease
              ? semver.gt(release.tag_name, lastGuildRelease.version)
              : true
          } catch (error) {
            this.error(error)
            // NOTE: Filter out releases where we couldn't parse the version (tag name).
            return false
          }
        })
        .reduce((object, release) => {
          if (!object[release.repo]) {
            object[release.repo] = []
          }
          object[release.repo].push(release)
          return object
        }, {})
    } catch (error) {
      this.error(error)
      return {}
    }
  }
}

/**
 * Represents a minimised ReposListReleasesResponseItem, containing only relevant data.
 *
 * @see extractData
 */
export interface Release {
  url: string
  repo: string
  tag_name: string
  draft: boolean
  prerelease: boolean
  author: {
    login: string
    url: string
    avatar_url: string
  }
  body: string
  created_at: string
}
