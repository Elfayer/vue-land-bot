import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import { trySend } from '../utils/messages'
import { inlineCode } from '../utils/string'

export default class LogTask extends Task {
  constructor(client) {
    super(client, {
      name: 'log',
      events: [
        'ready',
        'resume',
        'commandRun',
        'commandError',
        'unknownCommand',
      ],
      description:
        'Logs various events (connection, command invocations etc.) for debugging purposes/to aid development.',
      enabled: true,
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
      null,
      this.buildEmbed(null, { title: 'Connection Initiated', color: 'GREEN' })
    )
  }

  resume() {
    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(null, { title: 'Connection Resumed', color: 'BLUE' })
    )
  }

  commandRun(cmd, _, msg) {
    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(msg, { title: 'Command Invocation', color: 'GREEN' }, [
        { name: 'Command', value: inlineCode(msg.command.name) },
      ])
    )
  }

  commandError(cmd, err, msg) {
    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(msg, { title: 'Command Error', color: 'RED' }, [
        { name: 'Command', value: inlineCode(cmd.name) },
      ])
    )
  }

  unknownCommand(msg) {
    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(msg, { title: 'Unknown Command', color: 'ORANGE' }, [
        {
          name: 'Command',
          value: inlineCode(msg.cleanContent),
        },
      ])
    )
  }

  buildEmbed(msg, options, fields = []) {
    const embed = new RichEmbed().setTimestamp()

    if (options.title) {
      embed.setTitle(options.title)
    }
    if (options.description) {
      embed.setDescription(options.description)
    }
    if (options.color) {
      embed.setColor(options.color)
    }

    if (msg) {
      embed
        .addField('Guild', msg.guild ? msg.guild : 'N/A', true)
        .addField('Channel', msg.channel, true)
        .addField('User', msg.author, true)
    }

    for (const field of fields) {
      embed.addField(field.name, field.value)
    }

    return embed
  }
}
