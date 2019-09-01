export default {
  name: 'warn',
  description: 'Rules to warn Moderators',
  enabled: false,
  run(msg) {
    const notifyRole = msg.guild.roles.find(role => role.name === 'Admin')
    const notifyChannel = msg.client.channels.find(channel => channel.name === 'spam')

    notifyChannel.send(`${notifyRole} Suspicious user: ${message.author} in channel ${message.channel}`)
  }
}
