import { ArgumentType } from 'discord.js-commando'

module.exports = class JobArgumentType extends ArgumentType {
  constructor(client, id = 'job') {
    super(client, id)
  }

  validate(value) {
    return this.client.jobs.has(value)
  }

  parse(value) {
    return this.client.jobs.get(value)
  }
}
