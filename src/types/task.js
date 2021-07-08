import { ArgumentType } from 'discord.js-commando'

module.exports = class TaskArgumentType extends ArgumentType {
  constructor(client, id = 'task') {
    super(client, id)
  }

  validate(value) {
    return this.client.tasks.has(value)
  }

  parse(value) {
    return this.client.tasks.get(value)
  }
}
