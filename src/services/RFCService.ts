import * as Fuse from 'fuse.js' // SEE: https://fusejs.io/#using-in-typescript
import { FuseOptions, FuseResultWithMatches } from 'fuse.js'
import {
  PullsListResponseItem,
  PullsListResponseItemLabelsItem,
} from '@octokit/rest'
import { formatDistance } from 'date-fns'

import '@schemas/RFCSchema'
import Service from '@structures/Service'
import github from '@libraries/GithubClient'

/**
 * The RFCService is responsible for any and all things relating to RFCs.
 */
export default class RFCService extends Service {
  static OWNER = 'vuejs'
  static REPO = 'rfcs'

  fuse: Fuse<PullsListResponseItem, FuseOptions<PullsListResponseItem>>
  rfcs: PullsListResponseItem[] = []

  run() {}

  async init() {
    const didRefresh = await this.cacheRFCs()

    this.client.console.log(
      didRefresh
        ? `${this} Refreshed the cache.`
        : `${this} Cache still valid (TTL).`
    )
  }

  /**
   * Cache the RFCs to disk and then return them.
   *
   * @param ignoreTTL If `false`, the RFCs will only be recached if the cache expired.
   * @returns Whether or not the cache was refreshed.
   */
  async cacheRFCs(ignoreTTL = false): Promise<boolean> {
    try {
      if (!ignoreTTL && !this.didCacheExpire()) {
        if (!this.isCachePrimed()) {
          this.rfcs = this.client.settings.get(
            'rfcs.cache'
          ) as PullsListResponseItem[]
          this.updateFuzzySearcher()
        }

        return false
      }

      let rfcs = await github.paginate('GET /repos/:owner/:repo/issues', {
        owner: RFCService.OWNER,
        repo: RFCService.REPO,
        state: PullRequestState.ALL,
        sort: PullRequestSort.POPULARITY,
      })
      rfcs = this.extractRelevantData(rfcs)

      await this.client.settings.reset('rfcs.cache')
      await this.client.settings.update([
        ['rfcs.cachedAt', Date.now()],
        ['rfcs.cache', rfcs],
      ])
      this.updateFuzzySearcher()

      this.rfcs = rfcs
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  /**
   * When was the cache written (unix time)?
   */
  getCachedAtTime(): number {
    return this.client.settings.get('rfcs.cachedAt') as number
  }

  /**
   * Did the cache expire yet?
   */
  didCacheExpire(): boolean {
    return Date.now() >= this.getCachedAtTime() + this.getCacheTTL()
  }

  /**
   * Does the cache *seem* valid (i.e. does it have at least one entry)?
   */
  isCachePrimed(): boolean {
    return !!this.rfcs.length
  }

  /**
   * How long is the cache valid for (milliseconds)?
   */
  getCacheTTL(): number {
    return this.client.settings.get('rfcs.cacheTTL') as number
  }

  /**
   * How long is the cache valid for (human-readable)?
   */
  getCacheTTLHuman(): string {
    return formatDistance(new Date(0), this.getCacheTTL())
  }

  /**
   * Return all RFCs, first recaching them to disc if CACHE_TTL has passed.
   */
  async getAllRFCs(
    state: PullRequestState = PullRequestState.ALL
  ): Promise<PullsListResponseItem[]> {
    try {
      await this.cacheRFCs(false)
      return this.rfcs
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * Return all RFCs, first recaching them to disc if CACHE_TTL has passed.
   */
  async getRFCsByState(
    state: PullRequestState = PullRequestState.ALL
  ): Promise<PullsListResponseItem[]> {
    try {
      await this.cacheRFCs(false)

      const rfcs = await this.getAllRFCs()

      return rfcs.filter((rfc, index) => {
        switch (state) {
          case PullRequestState.OPEN:
          case PullRequestState.CLOSED:
            return rfc.state === state
            break
          case PullRequestState.MERGED:
            return Boolean(rfc.merged_at)
            break
          case PullRequestState.POPULAR:
            // NOTE: We sort by popularity by default.
            return index <= Math.floor(Math.log(rfcs.length) * 4)
            break
          default:
          case PullRequestState.ALL:
            return true
            break
        }
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * Return a specific RFC by "number" (the number displayed in the UI).
   *
   * Note that this is **not** the same as the internal PK (id).
   */
  async getRFC(number: any): Promise<PullsListResponseItem | undefined> {
    await this.cacheRFCs(false)

    return this.rfcs.find(
      rfc => rfc.number === parseInt(number.replace('#', ''))
    )
  }

  /**
   * Find a value via fuzzy search.
   */
  async findFuzzy(value: string): Promise<PullsListResponseItem[]> {
    await this.cacheRFCs(false)

    // FIXME: Without the cast we get a very long and confusing error on `map`.
    return (this.fuse.search(value) as FuseResultWithMatches<
      PullsListResponseItem
    >[]).map(
      (result: FuseResultWithMatches<PullsListResponseItem>) => result.item
    )
  }

  /**
   * Find an RFC based on a specific filter key and value.
   */
  async findBy(
    filter: RFCFilter,
    value: string,
    existing?: PullsListResponseItem[]
  ): Promise<PullsListResponseItem[]> {
    await this.cacheRFCs(false)

    value = value.toLowerCase()
    let filtered: PullsListResponseItem[] = []
    const rfcs = existing ?? this.rfcs

    if (filter === RFCFilter.ID) {
      try {
        filtered = [await this.getRFC(value)]
      } catch (e) {
        /* eslint-disable no-empty */
      }
    } else if (filter === RFCFilter.TITLE) {
      filtered = rfcs.filter(rfc => rfc.title.toLowerCase().includes(value))
    } else if (filter === RFCFilter.BODY) {
      filtered = rfcs.filter(rfc => {
        if (rfc.body.toLowerCase().includes(value)) {
        }

        return rfc.body.toLowerCase().includes(value)
      })
    } else if (filter === RFCFilter.AUTHOR) {
      filtered = rfcs.filter(rfc =>
        rfc.user.login.toLowerCase().includes(value)
      )
    } else if (filter === RFCFilter.LABEL) {
      let labels: Array<string>
      let mode: LabelOptions = LabelOptions.OR

      if (!Array.isArray(value)) {
        if (value.includes('&')) {
          mode = LabelOptions.AND
          labels = value.split('&')
        } else if (value.match(/[|,]+/)) {
          labels = value.split('[|,]')
        } else {
          labels = [value]
        }
      } else {
        labels = value
      }

      labels = labels.map(label => label.trim().toLowerCase())

      filtered = rfcs.filter(rfc => {
        if (mode === LabelOptions.AND) {
          return labels.every(labelName =>
            rfc.labels.find((label: PullsListResponseItemLabelsItem) =>
              label.name.toLowerCase().includes(labelName)
            )
          )
        } else if (mode === LabelOptions.OR) {
          return labels.some(labelName =>
            rfc.labels.find((label: PullsListResponseItemLabelsItem) =>
              label.name.toLowerCase().includes(labelName)
            )
          )
        }
      })
    } else if (filter === RFCFilter.STATE) {
      filtered = rfcs.filter((rfc, index) => {
        switch (value) {
          case PullRequestState.OPEN:
          case PullRequestState.CLOSED:
            console.log(`checking that ${rfc.state} is ${value}`)
            return rfc.state === value
          case PullRequestState.MERGED:
            return Boolean(rfc.merged_at)

          case PullRequestState.POPULAR:
            // NOTE: We sort by popularity by default.
            return index <= Math.floor(Math.log(rfcs.length) * 4)

          default:
          case PullRequestState.ALL:
            filtered = rfcs
            break
        }
      })
    }

    return filtered
  }

  /**
   * Create the fuzzy searcher instance.
   *
   * Should be called whenever the RFCs are set/updated.
   */
  private updateFuzzySearcher() {
    this.fuse = new Fuse(this.rfcs, FUSE_OPTIONS)
  }

  /**
   * Reduce storage costs by extracting only the data we care about from the API response.
   */
  private extractRelevantData(rfcs: PullsListResponseItem[]) {
    return rfcs.map(rfc => ({
      user: {
        login: rfc.user.login,
        html_url: rfc.user.html_url,
        avatar_url: rfc.user.avatar_url,
      },
      body: rfc.body,
      title: rfc.title,
      state: rfc.state,
      labels: rfc.labels.map(label => ({
        name: label.name,
        color: label.color,
        description: label.description,
      })),
      number: rfc.number,
      html_url: rfc.html_url,
      created_at: rfc.created_at,
      updated_at: rfc.updated_at,
      merged_at: rfc.merged_at,
    }))
  }

  toString() {
    return '[RFCService]'
  }
}

/**
 * Represents the state of a pull request.
 */
export enum PullRequestState {
  OPEN = 'open',
  CLOSED = 'closed',
  ALL = 'all',
  MERGED = 'merged',
  POPULAR = 'popular',
}

/**
 * The valid sorting options for pull requests.
 */
export enum PullRequestSort {
  POPULARITY = 'popularity',
}

/**
 * Allowed filters for `findBy`.
 */
export enum RFCFilter {
  ID = 'id',
  TITLE = 'title',
  BODY = 'body',
  AUTHOR = 'author',
  LABEL = 'label',
  STATE = 'state',
}

/**
 * Options for labels.
 *
 * @see findBy
 */
enum LabelOptions {
  OR,
  AND,
}

const FUSE_OPTIONS: FuseOptions<PullsListResponseItem> = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.35,
  location: 0,
  distance: 2000,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    {
      name: 'title',
      weight: 1.0,
    },
    {
      name: 'body',
      weight: 0.9,
    },
    {
      name: 'user.login',
      weight: 0.3,
    },
    {
      name: 'labels.name',
      weight: 0.3,
    },
  ],
}
