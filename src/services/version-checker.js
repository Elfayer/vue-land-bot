import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import github from '../github'
import semver from 'semver'
import { DATA_DIR, DISCORD_EMBED_DESCRIPTION_LIMIT } from '../utils/constants'
import { addEllipsis } from '../utils/string'

const PATH_VERSION_FILE = join(DATA_DIR, 'versions.json')

/**
 * If the versions file doesn't exist then we'll default it to
 * the current version numbers (at the time of this PR).
 */
const _DEFAULTS = {
  vue: 'v2.6.11',
  vuex: 'v3.1.2',
  'vue-router': 'v3.1.3',
  'vue-cli': 'v4.1.2',
  'vue-devtools': 'v5.3.3',
  'vue-test-utils': 'v1.0.0-beta.30',
  vetur: '0.23.0',
}

if (!existsSync(PATH_VERSION_FILE)) {
  _writeDefaults()
}

let _versions = readVersions()
const REPO_NAMES = Object.keys(_versions)

export const ANNOUNCEMENT_CHANNEL = 'announcements'
export const NOTIFICATION_ROLE = 'releases'

function _writeDefaults() {
  writeFileSync(PATH_VERSION_FILE, JSON.stringify(_DEFAULTS), {
    encoding: 'utf8',
  })
}

export function readVersions() {
  return JSON.parse(readFileSync(PATH_VERSION_FILE, { encoding: 'utf8' }))
}

export function writeVersion(repository, version) {
  const toWrite = { ..._versions }
  toWrite[repository] = version
  _versions = toWrite
  return writeFileSync(PATH_VERSION_FILE, JSON.stringify(toWrite), {
    encoding: 'utf8',
  })
}

export function getVersion(repository) {
  return _versions[repository]
}

export function getVersions() {
  return _versions
}

export function getRepos() {
  return REPO_NAMES
}

export function isValidRepo(repository) {
  return REPO_NAMES.includes(repository)
}

export async function getAllNewReleases(updateVersions = false) {
  const promises = []
  for (const repo of REPO_NAMES) {
    promises.push(getNewReleases(repo, updateVersions))
  }
  return Promise.all(promises).then(results =>
    results.reduce((array, item) => {
      array.push(...item)
      return array
    }, [])
  )
}

export async function getNewReleases(repository, updateVersions = false) {
  try {
    const response = await github.getRepo('vuejs', repository).listReleases()

    if (response.status !== 200) {
      throw new Error('Non-200 status code received, something went wrong')
    }

    const releases = response.data
      .filter(release => {
        try {
          return semver.gt(release.tag_name, getVersion(repository))
        } catch (error) {
          return false
        }
      })
      .sort((a, b) => {
        return semver.gt(a.tag_name, b.tag_name)
      })
      .map(release => {
        return {
          url: release.html_url,
          repo: repository,
          version: release.tag_name,
          draft: release.draft,
          prerelease: release.prerelease,
          author: release.author,
          body: addEllipsis(release.body, DISCORD_EMBED_DESCRIPTION_LIMIT - 4),
          created_at: new Date(release.created_at).toUTCString(),
        }
      })

    if (updateVersions && releases.length) {
      const lastRelease = releases[releases.length - 1].version
      writeVersion(repository, lastRelease)
    }

    return releases
  } catch (e) {
    console.error(e)
    return []
  }
}
