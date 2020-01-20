import * as Octokit from '@octokit/rest'

import { NAME, VERSION } from '@libraries/constants'

const { GITHUB_TOKEN } = process.env

export default new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: `${NAME} [${VERSION}] (octokit/rest)`,
})
