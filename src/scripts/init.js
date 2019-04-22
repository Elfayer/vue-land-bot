const fs = require('fs')

const FILENAME = 'config.json'
const PATH = `./src/${FILENAME}`
const defaultConfig = {
  prefix: '!',
  token: 'your-token-goes-here'
}

fs.access(PATH, (err) => {
  if (!err) {
    return
  }

  fs.writeFile(PATH, JSON.stringify(defaultConfig), 'utf8', (err) => {
    if (err) {
      throw err
    }
    console.log(`A "${PATH}" file has been created, make sure to fill in your token properly.`)
  })
})
