/* eslint-disable no-unused-vars */
import Job from '../lib/job'
import { tryDelete } from '../utils/messages'

/*
  Commando is quite spammy in certain cases. This cleans up the spam automatically, 
  shortly after giving the user a little while to read the error or information.

    - When a command sets userPermissions, a user without permissions receives:
        @user, The example command requires you to have the following permissions: ...
    - When an unknown command is triggered, a user receives:
        @user, Unknown command. Use !help to view the list of all commands.
    - When a command errors, a user receives:
        @user, An error occurred while running the command: Error: ...
    - When argument parsing is cancelled, a user receives:
        @user, Cancelled command.
  
  These messages can overwhelm the chat and are not particularly useful after having 
  been read (except for errors which we should (and will) keep track of).
*/
export default class CleanupJob extends Job {
  constructor(client) {
    super(client, {
      name: 'cleanup',
      events: [
        'commandBlocked',
        'commandCancel',
        'commandError',
        'unknownCommand',
      ],
      description:
        'Cleans up bot-spam from blocked, cancelled, errored and unknown commands.',
      enabled: true,
      config: {
        removeMessagesAfter: 7500,
      },
    })
  }

  shouldExecute() {
    return false
  }

  commandBlocked(msg, reason, data) {
    if (reason === 'throttling' || reason === 'permission') {
      this.cleanup(msg)
    }
  }

  /*
    NOTE: This one isn't going to work until we upgrade Commando.
  */
  commandCancel(cmd, reason, msg, result) {
    this.cleanup(msg)
  }

  commandError(cmd, err, msg, args, fromPattern, result) {
    this.cleanup(msg)
  }

  unknownCommand(msg) {
    this.cleanup(msg)
  }

  cleanup(msg) {
    setTimeout(async () => {
      /**
       * @see https://discord.js.org/#/docs/commando/v0.10.0/class/CommandMessage?scrollTo=responses
       */
      const responseMessages = Object.values(msg.responses)

      if (!responseMessages.length) {
        return tryDelete(msg)
      }

      for (const messages of responseMessages) {
        for (const message of messages) {
          await tryDelete(message)
        }
      }

      tryDelete(msg)
    }, this.config.removeMessagesAfter)
  }
}
