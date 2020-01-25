import { Task, TaskStore } from 'klasa'

import { MiscSettings } from '@settings/MiscSettings'

/**
 * This task is responsible for periodically updating the bot's status/presence.
 *
 * @see MiscSchema
 * @see MiscSettings
 * @see lib/consants
 */
export default class UpdatePresenceTask extends Task {
  private static TASK_NAME = 'UpdatePresenceTask'

  constructor(store: TaskStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: UpdatePresenceTask.TASK_NAME,
      enabled: true,
    })
  }

  async init() {
    if (!this.client.schedule.get(UpdatePresenceTask.TASK_NAME)) {
      this.client.schedule.create(UpdatePresenceTask.TASK_NAME, '0 * * * *', {
        id: UpdatePresenceTask.TASK_NAME,
      })
    }
  }

  async run() {
    try {
      const statuses = this.client.settings.get(MiscSettings.Client.STATUSES)
      const [type, name]: [string, string] = statuses[
        Math.floor(Math.random() * statuses.length)
      ]
      this.client.user.setPresence({
        activity: { name, type: type as STATUS },
        status: 'online',
      })
      this.debug(`Updated status to ${type.toLowerCase()} - ${name}.`)
    } catch (error) {
      this.error(error)
    }
  }
}

type STATUS = 'PLAYING' | 'LISTENING' | 'WATCHING'
