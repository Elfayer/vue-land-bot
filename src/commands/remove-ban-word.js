const { banWords, saveToFile, toString } = require('../services/ban-words')

module.exports = {
  name: 'remove-ban-word',
  description: 'Remove a word to be used by the ban job.',
  args: true,
  isAvailable: true,
  usage: '<word>',
  execute (message, args) {
    const word = args[0]
    const foundIndex = banWords.findIndex(w => w.toLowerCase() === word.toLowerCase())

    if (foundIndex >= 0) {
      banWords.splice(foundIndex, 1)
      saveToFile()
      message.channel.send(`Ban words: ${toString()}`)
    } else {
      message.channel.send(`I cannot find the word "${word}" in the ban words list.`)
    }
  }
}
