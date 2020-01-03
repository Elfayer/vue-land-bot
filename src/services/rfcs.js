import { join } from 'path'
import { promises, existsSync, readFileSync } from 'fs'
import github from '../github'
import { DATA_DIR } from '../utils/constants'
const { stat, writeFile } = promises

const { NODE_ENV = 'development' } = process

export const CACHE_TTL =
  NODE_ENV === 'development' ? 1000 * 60 * 5 : 1000 * 60 * 60 * 3
export const PATH_CACHE_FILE = join(DATA_DIR, 'rfcs/', 'rfcs.json')
export const repository = github.getRepo('vuejs', 'rfcs')

export let rfcs = []

export class RFCDoesNotExistError extends Error {}

/*
  Initial cache.
*/
if (!existsSync(PATH_CACHE_FILE)) {
  reloadCache()
    .then('Performed initial caching of RFC data!')
    .catch(console.error)
} else {
  console.info('Cache file was found at startup!')
  rfcs = JSON.parse(readFileSync(PATH_CACHE_FILE))
}

/**
 * Write the PRs for the RFC repo to disc then return them.
 *
 * Does not check the `CACHE_TTL` as `getAllRFCs` does.
 *
 * @returns {Promise<Array>} An array of RFC PRs.
 */
export async function reloadCache() {
  try {
    /*
      WORKAROUND: We should be using repo.listPullRequests({ state: 'all' }) but it's 
                  not working at the moment due to some pagination-related issues.

      https://github.com/github-tools/github/issues/593
      https://github.com/github-tools/github/issues/578
    */
    const { data } = await repository._requestAllPages(
      `/repos/${repository.__fullname}/pulls?state=all`
    )

    if (Array.isArray(data) && data.length) {
      await writeFile(PATH_CACHE_FILE, JSON.stringify(data))
    }

    console.info(`Cached ${data.length} RFCs to disc!`)

    rfcs = data
    return rfcs
  } catch (e) {
    console.error(e)
    throw new Error(e.message)
  }
}

/**
 * When was the cache file was written?
 *
 * @async
 * @returns {Promise<Number>} The time the cached file was written to disc in milliseconds.
 */
export async function getCachedAtTime() {
  try {
    const { mtimeMs } = await stat(PATH_CACHE_FILE)

    return mtimeMs
  } catch (e) {
    console.error(e)
    return 0
  }
}

/**
 * Return all RFCs, first recaching them to disc if CACHE_TTL has passed.
 *
 * @returns {Promise<Array>} An array of RFCs PRs.
 */
export async function getAllRFCs() {
  try {
    const cachedAt = await getCachedAtTime()

    if (Date.now() >= cachedAt + CACHE_TTL) {
      console.info('Reloading cache!')
      await reloadCache()
    }

    return rfcs
  } catch (e) {
    console.error(e)

    return []
  }
}

/**
 * Return a specific RFC by "number", which is NOT the same as the internal PK (id).
 *
 * @param {Number} number The number of the PR (as displayed in the UI).
 */
export async function getRFC(number) {
  if (!rfcs.length) {
    await reloadCache()
  }

  const rfc = rfcs.filter(rfc => rfc.number === parseInt(number))

  if (!rfc.length) {
    throw new RFCDoesNotExistError(`Could not find RFC number ${number}.`)
  }

  return rfc[0]
}

/**
 * Filter RFCs by title, body, labels or author name.
 *
 * @returns {Array} An array of RFCs that matched the filter.
 */
export async function filterRFCsBy(filter, value) {
  let filtered = []

  if (filter === 'id') {
    try {
      filtered = await getRFC(value)
      filtered = [filtered]
    } catch (e) {
      /* eslint-disable no-empty */
    }
  } else if (filter === 'title') {
    filtered = rfcs.filter(rfc => rfc.title.toLowerCase().includes(value))
  } else if (filter === 'body') {
    filtered = rfcs.filter(rfc => rfc.body.toLowerCase().includes(value))
  } else if (filter === 'author') {
    filtered = rfcs.filter(rfc => rfc.user.login.toLowerCase().includes(value))
  } else if (filter === 'label') {
    if (!Array.isArray(value)) {
      if (value.includes(',')) {
        value = value.split(',')
      } else if (value.includes('|')) {
        value = value.split('|')
      } else {
        value = [value]
      }
    }

    value = value.map(label => label.trim())

    filtered = rfcs.filter(rfc =>
      value.every(labelName =>
        rfc.labels.find(label => label.name === labelName)
      )
    )
  }

  return filtered
}

/**
 * Tries to find RFCs using filterRFCsBy for every possible filter.
 *
 * @returns {Array} An array of RFCs that matched the filter.
 */
export async function findRFCs(value) {
  const filters = ['id', 'title', 'body', 'author', 'label']

  for (const filter of filters) {
    const filtered = await filterRFCsBy(filter, value)

    if (filtered.length) {
      return filtered
    }
  }

  return []
}
