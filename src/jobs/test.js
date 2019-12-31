import Task from '../lib/task'

export default class TestTask extends Task {
  constructor(client) {
    super(client, {
      name: 'test',
      enabled: false,
      description: 'Move along, move along.',
    })
  }

  run() {
    console.log('[TestTask] Executed!')
  }
}
