const banWords = require('../services/ban-words')

module.exports = {
  name: 'list-ban-words', // should match file name
  description: 'List all ban words used by the ban job.', // for maintainers understanding
  isAvailable: true, // if false, won't be used
  usage: '<word>', // if using args, to show users right args usage
  execute (message) {
    message.channel.send(`Ban words: ${banWords.toString()}`)
  }
}
