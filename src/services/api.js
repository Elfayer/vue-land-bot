import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import HJSON from 'hjson'
import { DATA_DIR } from '../utils/constants'

const API_DATA_FILE = join(DATA_DIR, 'api.hjson')

if (!existsSync(API_DATA_FILE)) {
  throw new Error('Data file "data/api.hjson" does not exist!')
}

let apiData
const aliasMap = {}

export const apis = {}

try {
  apiData = HJSON.parse(readFileSync(API_DATA_FILE, 'utf8'))
} catch (error) {
  console.error(error)
  throw new Error('Data file "data/api.hjson" is unparseable!')
}

/*
  Flatten data and build alias map.
*/
for (const category of apiData.categories) {
  for (const item of category.items) {
    apis[item.title] = Object.assign(item, { category: category.title })

    if (item.aliases) {
      for (const alias of item.aliases) {
        aliasMap[alias] = item.title
      }
    }
  }
}

/**
 * Get an API by name or alias if it exists.
 *
 * @param {string} name Which API to look up, by name (or alias).
 */
export function getAPI(name) {
  if (apis[name]) {
    return apis[name]
  }

  if (aliasMap[name]) {
    return apis[aliasMap[name]]
  }

  throw new Error('API not found: ' + name)
}
