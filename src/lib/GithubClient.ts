import * as Octokit from '@octokit/rest'
import OctokitPluginThrottling from '@octokit/plugin-throttling'

import { NAME, VERSION } from '@libraries/constants'

const { GITHUB_TOKEN } = process.env

Octokit.plugin((OctokitPluginThrottling as unknown) as Octokit.Plugin)

const client = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: `${NAME} [${VERSION}] (octokit/rest)`,
  throttle: {
    onRateLimit: (retryAfter: number, options) => {
      client.log.warn(
        `[GithubClient] Request quota exhausted for request ${options.method} ${options.url}`
      )

      console.log(`Retrying after ${retryAfter} seconds!`)
      return true
    },
    onAbuseLimit: (_retryAfter: number, options) => {
      client.log.warn(
        `[GithubClient] Abuse detected for request ${options.method} ${options.url}`
      )
    },
  },
})

export default client
