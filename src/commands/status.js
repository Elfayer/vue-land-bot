module.exports = {
  name: 'status',
  description: 'Bot status',
  args: false,
  isAvailable: false,
  execute (message, args) {
    message.channel.send('Running.')
  }
}
