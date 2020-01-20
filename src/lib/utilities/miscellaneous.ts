import { execSync } from 'child_process'
import { oneLine } from 'common-tags'

/**
 * Return the current tag, branch or commit - whichever is found first.
 */
export function getVersion() {
  return execSync(oneLine`
    git describe --tags --exact-match 2> /dev/null ||
    git symbolic-ref -q --short HEAD ||
    git rev-parse --short HEAD
  `).toString('utf8')
}
