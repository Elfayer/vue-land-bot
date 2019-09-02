import fs from 'fs'
import { resolve } from 'path'

const FILENAME = 'ban-words.txt'
const PATH = resolve(__dirname, '../../data/', FILENAME)
const SEPARATOR = '\r\n'

export const banWords = []

export function saveToFile() {
  fs.access(PATH, err => {
    if (err) {
      throw err
    }

    fs.writeFile(PATH, banWords.join(SEPARATOR), 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      console.log(`File "${PATH}" updated.`)
    })
  })
}

export function toString() {
  return banWords.reduce(
    (acc, val) => (acc ? `${acc}, \`${val}\`` : `\`${val}\``),
    ''
  )
}

function _initFromFile() {
  fs.access(PATH, err => {
    if (err) {
      throw err
    }

    fs.readFile(PATH, 'utf8', (err, data) => {
      if (err) {
        throw err
      }
      banWords.push(...data.split(SEPARATOR))
    })
  })
}

_initFromFile()
