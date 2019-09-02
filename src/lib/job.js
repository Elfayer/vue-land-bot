export default class Job {
  constructor(client, options = {}) {
    this.client = client

    if (!options.name) {
      throw new Error('Job lacks required option - name.')
    }

    if (!options.ignored) {
      options.ignored = {}
    }

    ;['roles', 'users', 'channels', 'categories'].forEach(key => {
      if (!options.ignored[key]) options.ignored[key] = []
    })

    if (!options.config) {
      options.config = {}
    }

    this.name = options.name
    this.enabled = options.enabled || true
    this.ignored = options.ignored
    this.guildOnly = options.guildOnly || true
  }

  shouldExecute(msg) {
    if (msg.channel.type === 'dm') {
      if (this.guildOnly) return

      return true
    }

    return msg.member.roles.some(role => this.ignored.roles.includes(role.id))
  }

  toString() {
    return this.name
  }
}
