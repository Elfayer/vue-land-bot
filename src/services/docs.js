import { join } from 'path'
import { resolve } from 'url'
import { readFileSync, existsSync } from 'fs'
import HJSON from 'hjson'
import Fuse from 'fuse.js'
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import { DATA_DIR, DOCS_BASE_URL, DOCS_MARKDOWN_DIR } from '../utils/constants'

const API_DATA_FILE = join(DATA_DIR, 'docs.hjson')

if (!existsSync(API_DATA_FILE)) {
  throw new Error('Data file "data/docs.hjson" does not exist!')
}

let apiData

/*
  Parse HJSON.
*/
try {
  apiData = HJSON.parse(readFileSync(API_DATA_FILE, 'utf8'))
} catch (error) {
  console.error(error)
  throw new Error('Data file "data/docs.hjson" is unparseable!')
}

const aliasMap = {}
export const apis = {}

/*
  Extend item, flatten data and build alias map.
*/
for (const category of apiData.categories) {
  for (let item of category.items) {
    item = _extendItem(item, category)
    apis[item.id] = item

    if (item.aliases) {
      for (const alias of item.aliases) {
        aliasMap[alias.toLowerCase()] = item.id
      }
    }
  }
}

/*
  Fuzzy searcher instance.
*/
const fuse = new Fuse(Object.values(apis), {
  shouldSort: true,
  includeScore: true,
  threshold: 0.4,
  location: 0,
  distance: 42,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    { name: 'title', weight: 1.0 },
    { name: 'aliases', weight: 1.0 },
    { name: 'headings.text', weight: 0.75 },
  ],
})

/**
 * Get a Doc item by id or alias.
 *
 * @param {string} name Which Doc item to look up, by id (or alias).
 * @returns {undefined|object} The Doc item if found, or undefined.
 */
export function getDoc(id) {
  id = id.toLowerCase()

  if (apis[id]) {
    return apis[id]
  }

  if (aliasMap[id]) {
    return apis[aliasMap[id]]
  }
}

/**
 * Find a Doc item via fuzzy search.
 *
 * @param {string} search The string to search for in the title and through the aliases.
 * @returns {Array} Any API results that match the search string.
 */
export function findDoc(name) {
  const search = fuse.search(name)

  if (search.length > 0) {
    return search.map(({ item }) => item)
  }

  return []
}

export class DocNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'DocNotFoundError'
  }
}

/**
 * Extract the headings from a raw markdown document.
 * @param {string} markdown The raw markdown.
 * @returns {Array} The headings.
 */
function _extractHeadings(markdown) {
  const parsed = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .parse(markdown)
    .children.filter(node => node.type === 'heading')

  const headings = []

  for (const node of parsed) {
    headings.push({
      text: node.children.map(child => child.value).join(''),
      depth: node.depth,
    })
  }

  return headings
}

/**
 * Extend the doc item with extra data e.g. category, markdown headings etc.
 * @param {object} item The doc item to extend.
 * @param {object} category The category the doc item belongs to.
 * @returns {object} The extended item.
 */
function _extendItem(item, category) {
  if (!item.id) {
    item.id = item.title
  }
  item.id = item.id.toLowerCase()

  if (typeof item.extractHeadings === 'undefined' && item.path) {
    item.extractHeadings = true
  }

  if (item.headings) {
    item.headings = item.headings.map(heading => ({ depth: 2, text: heading }))
  }

  let headings = item.headings ? item.headings : []

  if (item.extractHeadings) {
    const markdown = readFileSync(join(DOCS_MARKDOWN_DIR, `${item.path}.md`), {
      encoding: 'utf8',
    })
    headings = _extractHeadings(markdown)
  }

  if (!item.description) {
    item.description = headings
      .filter(heading => heading.depth === 2)
      .map(heading => `- ${heading.text}`)
      .join('\n')
  }

  item.link = resolve(DOCS_BASE_URL, `${item.path}.html`)
  item.category = category.title

  return item
}
