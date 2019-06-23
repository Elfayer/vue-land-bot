module.exports = {
  name: 'status',
  description: 'Bot status',
  args: false,
  isAvailable: false,
  execute (message) {
    message.channel.send('Running.')
  }
}
