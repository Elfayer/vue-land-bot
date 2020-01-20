import Job from '../lib/job'

export default class TestJob extends Job {
  constructor(client) {
    super(client, {
      name: 'test',
      enabled: false,
      description: 'Move along, move along.',
    })
  }

  run() {
    console.log('test job executed')
  }
}
