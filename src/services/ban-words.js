const fs = require('fs')
const path = require('path')
const FILENAME = 'ban-words.txt'
const PATH = path.join(__dirname, FILENAME)
const SEPARATOR = '\r\n'
const banWords = []

function _initFromFile () {
  fs.access(PATH, (err) => {
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

function saveToFile () {
  fs.access(PATH, (err) => {
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

function toString () {
  return banWords.reduce((acc, val) => acc ? `${acc}, \`${val}\`` : `\`${val}\``, '')
}

_initFromFile()

module.exports = {
  saveToFile,
  toString,
  banWords
}
