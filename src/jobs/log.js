import Job from '../lib/job'
import { trySend } from '../utils/messages'

export default class LogJob extends Job {
  constructor(client) {
    super(client, {
      name: 'log',
      events: ['ready', 'commandRun', 'unknownCommand'],
      description:
        'Logs various events (connection, command invocations etc.) for debugging purposes/to aid development.',
      enabled: false,
      config: {
        connectionChannel: {
          name: 'connection',
        },
        commandChannel: {
          name: 'commands',
        },
      },
    })
  }

  shouldExecute() {
    return false
  }

  ready() {
    trySend(
      this.config.connectionChannel,
      `Successfully connected - I am now online.`
    )
  }

  resume() {
    trySend(
      this.config.connectionChannel,
      `The connection was lost but automatically resumed.`
    )
  }

  commandRun(cmd, _, msg) {
    trySend(
      this.config.commandChannel,
      `The command ${cmd.name} was ran in ${msg.channel}`
    )
  }

  unknownCommand(msg) {
    trySend(
      this.config.commandChannel,
      `Unknown command, triggered by message from ${msg.author} in ${msg.channel}.`
    )
  }
}
