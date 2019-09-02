import Job from '../lib/job'

export default class TestJob extends Job {
  constructor(client) {
    super(client, {
      name: 'test',
      enabled: false,
      description: 'Move along, move along.',
    })
  }

  run(msg) {
    return msg.channel.send('test job executed')
  }
}
