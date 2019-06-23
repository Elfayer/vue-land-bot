const { banWords, saveToFile, toString } = require('../services/ban-words')

module.exports = {
  name: 'add-ban-word',
  description: 'Add a word to be used by the ban job.',
  args: true,
  isAvailable: true,
  usage: '<word>',
  execute (message, args) {
    const word = args[0]

    banWords.push(word)
    saveToFile()
    message.channel.send(`Ban words: ${toString()}`)
  }
}
