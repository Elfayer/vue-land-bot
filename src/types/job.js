import { ArgumentType } from 'discord.js-commando'

export default class JobArgumentType extends ArgumentType {
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
