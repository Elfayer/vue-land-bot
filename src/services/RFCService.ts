import * as Fuse from 'fuse.js' // SEE: https://fusejs.io/#using-in-typescript
import { FuseOptions, FuseResultWithMatches } from 'fuse.js'
import { PullsListResponseItem } from '@octokit/rest'

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
    await this.cacheRFCs()
  }

  /**
   * Cache the RFCs to disk and then return them.
   *
   * Does not check the `CACHE_TTL` as {@link getAllRFCs} does.
   */
  async cacheRFCs(): Promise<PullsListResponseItem[]> {
    try {
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
      return this.rfcs
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /**
   * When was the cache written (unix time)?
   */
  getCachedAtTime(): number {
    return this.client.settings.get('rfcs.cachedAt') as number
  }

  /**
   * How long is the cache valid for (milliseconds)?
   */
  getCacheTTL(): number {
    return this.client.settings.get('rfcs.cacheTTL') as number
  }

  /**
   * Return all RFCs, first recaching them to disc if CACHE_TTL has passed.
   */
  async getAllRFCs(
    state: PullRequestState = PullRequestState.ALL
  ): Promise<PullsListResponseItem[]> {
    try {
      if (Date.now() >= this.getCachedAtTime() + this.getCacheTTL()) {
        await this.cacheRFCs()
      }
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
      if (!this.rfcs.length) {
        await this.cacheRFCs()
      }

      const rfcs = await this.getAllRFCs()

      return rfcs.filter(rfc => {
        switch (state) {
          case PullRequestState.OPEN:
          case PullRequestState.CLOSED:
            return rfc.state === state
            break
          case PullRequestState.MERGED:
            return Boolean(rfc.merged_at)
            break
          case PullRequestState.POPULAR:
            this.client.console.warn('Popular filter not yet implemented.')
            return false
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
    if (!this.rfcs.length) {
      await this.cacheRFCs()
    }

    return this.rfcs.find(rfc => rfc.number === parseInt(number))
  }

  /**
   * Find a value via fuzzy search.
   */
  findFuzzy(value: string): PullsListResponseItem[] {
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
    value: string
  ): Promise<PullsListResponseItem[]> {
    value = value.toLowerCase()
    let filtered: PullsListResponseItem[] = []

    if (filter === 'id') {
      try {
        filtered = [await this.getRFC(value)]
      } catch (e) {
        /* eslint-disable no-empty */
      }
    } else if (filter === 'title') {
      filtered = this.rfcs.filter(rfc =>
        rfc.title.toLowerCase().includes(value)
      )
    } else if (filter === 'body') {
      filtered = this.rfcs.filter(rfc => rfc.body.toLowerCase().includes(value))
    } else if (filter === 'author') {
      filtered = this.rfcs.filter(rfc =>
        rfc.user.login.toLowerCase().includes(value)
      )
    } else if (filter === 'label') {
      let labels: Array<string>

      if (!Array.isArray(value)) {
        if (value.includes(',')) {
          labels = value.split(',')
        } else if (value.includes('|')) {
          labels = value.split('|')
        } else {
          labels = [value]
        }
      } else {
        labels = value
      }

      labels = labels.map(label => label.trim())

      filtered = this.rfcs.filter(rfc =>
        labels.every(labelName =>
          rfc.labels.find(
            (label: any) => label.name.toLowerCase() === labelName
          )
        )
      )
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

export enum PullRequestSort {
  POPULARITY = 'popularity',
}

enum RFCFilter {
  ID = 'id',
  TITLE = 'title',
  BODY = 'body',
  AUTHOR = 'author',
  LABEL = 'label',
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
