const client = require('../client.js')

module.exports = {
  name: 'warn',
  description: 'Rules to warn Moderators',
  isAvailable: false,
  execute (message) {
    const notifyRole = message.guild.roles.find(role => role.name === 'Admin')
    const notifyChannel = client.channels.find(channel => channel.name === 'spam')

    console.log(notifyRole)

    notifyChannel.send(`${notifyRole} Suspicious user: ${message.author} in channel ${message.channel}`)
  }
}
