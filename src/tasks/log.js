import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import { trySend } from '../utils/messages'
import { inlineCode } from '../utils/string'
import { GUILDS } from '../utils/constants'

export default class LogTask extends Task {
  constructor(client) {
    super(client, {
      name: 'log',
      guild: GUILDS.CURRENT,
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
        shouldLog: {
          readyEvents: false, // Log when the bot is ready / has connected?
          resumeEvents: false, // Log when the bot resumes a lost connection?
          invokedCommands: true, // Log all commands invocations?
          erroredCommands: true, // Log commands which cause an error to be thrown?
          unknownCommands: true, // Log unknown commands?
        },
        connectionChannel: {
          name: 'connection',
        },
        commandChannel: {
          name: 'commands',
        },
      },
    })
  }

  ready() {
    if (!this.config.shouldLog.readyEvents) {
      return
    }

    trySend(
      this.config.connectionChannel,
      null,
      this.buildEmbed(null, null, {
        title: 'Connection Initiated',
        color: 'GREEN',
      })
    )
  }

  resume() {
    if (!this.config.shouldLog.resumeEvents) {
      return
    }

    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(null, null, {
        title: 'Connection Resumed',
        color: 'BLUE',
      })
    )
  }

  commandRun(cmd, _, msg) {
    if (!this.config.shouldLog.invokedCommands) {
      return
    }

    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(msg, cmd, {
        title: 'Command Invocation',
        color: 'GREEN',
        addCommand: true,
      })
    )
  }

  commandError(cmd, err, msg) {
    if (!this.config.shouldLog.erroredCommands) {
      return
    }

    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(
        msg,
        cmd,
        {
          title: 'Command Error',
          color: 'RED',
          addCommand: true,
        },
        [
          {
            name: 'Error',
            value: err.message,
            inline: true,
          },
        ]
      )
    )
  }

  unknownCommand(msg) {
    if (!this.config.shouldLog.erroredCommands) {
      return
    }

    trySend(
      this.config.commandChannel,
      null,
      this.buildEmbed(msg, null, {
        title: 'Unknown Command',
        color: 'ORANGE',
        addCommand: true,
      })
    )
  }

  buildEmbed(msg, cmd, options, fields = []) {
    const embed = new RichEmbed().setFooter(new Date().toUTCString())

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

    if (options.addCommand) {
      let commandString = cmd
        ? msg.client.commandPrefix + msg.command.name
        : msg.cleanContent

      if (msg.argString) {
        commandString += msg.argString
      }

      embed.addField('Command', inlineCode(commandString), true)
    }

    for (const field of fields) {
      embed.addField(field.name, field.value, field.inline || false)
    }

    return embed
  }
}
