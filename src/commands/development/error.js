import { Command } from 'discord.js-commando'

/*
  This development-only command just throws an error.
*/
module.exports = class DevelopmentErrorCommand extends Command {
  constructor(client) {
    super(client, {
      guarded: true,
      name: 'error',
      examples: ['!error'],
      group: 'development',
      guildOnly: false,
      memberName: 'error',
      description: 'Create a command error.',
    })
  }

  hasPermission() {
    return true
  }

  async run() {
    throw new Error('Well, you asked for it.')
  }
}
