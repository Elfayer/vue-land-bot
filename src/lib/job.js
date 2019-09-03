import EventEmitter from 'events'
export default class Job extends EventEmitter {
  constructor(client, options = {}) {
    super()

    this.client = client

    if (!options.name) {
      throw new Error('Job lacks required option - name.')
    }

    if (!options.ignored) {
      options.ignored = {}
    }

    ;['roles', 'users', 'channels', 'categories'].forEach(key => {
      if (!options.ignored[key]) {
        options.ignored[key] = []
      }
    })

    if (!options.config) {
      options.config = {}
    }

    /*
      Discord.js/Commando events we intend to provide listeners for.
    */
    if (!options.events) {
      options.events = []
    }

    if (typeof options.enabled === 'undefined') {
      options.enabled = false
    }

    this.name = options.name
    this.events = options.events
    this.config = options.config
    this.ignored = options.ignored
    this.guildOnly = options.guildOnly
    this.on('enabled', this.attachEventListeners)
    this.on('disabled', this.removeEventListeners)

    // NOTE: Must come last because the setter triggers an event (enabled).
    this.enabled = options.enabled
  }

  attachEventListeners() {
    for (const event of this.events) {
      if (!isValidEvent(event)) {
        continue
      }

      const eventHandler = this[event]

      if (!eventHandler) {
        continue
      }

      this.client.on(event, eventHandler)
    }
  }

  /**
   * Remove event listeners from the `DiscordClient` for every event in `this.events`.
   */
  removeEventListeners() {
    for (const event of this.events) {
      if (!isValidEvent(event)) {
        continue
      }

      const eventHandler = this[event]

      if (!eventHandler) {
        continue
      }

      this.client.removeListener(event, eventHandler)
    }
  }

  shouldExecute(msg) {
    if (msg.channel.type === 'dm') {
      if (this.guildOnly) {
        return
      }

      return true
    }

    if (this.ignored.roles.length) {
      return msg.member.roles.some(role => this.ignored.roles.includes(role.id))
    }

    return true
  }

  toString() {
    return `<Job#${this.name}>`
  }

  getStatus() {
    return this.enabled ? 'enabled' : 'disabled'
  }

  /**
   * Is the job enabled?
   *
   * @return {boolean} Is this job enabled?
   */
  get enabled() {
    return this._enabled
  }

  /**
   * Set a job as enabled or disabled.
   *
   * @param {boolean} enabled Set as enabled or disabled.
   * @fires Job#enabled
   * @fires Job#disabled
   */
  set enabled(enabled) {
    this._enabled = enabled

    if (enabled) {
      this.emit('enabled')
    } else {
      this.emit('disabled')
    }
  }
}

/*
  List of valid Discord/Commando events.

  - https://discord.js.org/#/docs/main/stable/class/Client
  - https://discord.js.org/#/docs/commando/master/class/CommandoClient

  TODO: This probably needs moving elsewhere.
*/
const VALID_DISCORD_EVENTS = [
  // Discord.js Events
  'channelCreate',
  'channelDelete',
  'channelPinsUpdate',
  'channelUpdate',
  'clientUserGuildSettingsUpdate',
  'clientUserSettingsUpdate',
  'debug',
  'disconnect',
  'emojiCreate',
  'emojiDelete',
  'emojiUpdate',
  'error',
  'guildBanAdd',
  'guildBanRemove',
  'guildCreate',
  'guildDelete',
  'guildIntegrationsUpdate',
  'guildMemberAdd',
  'guildMemberAvailable',
  'guildMemberRemove',
  'guildMembersChunk',
  'guildMemberSpeaking',
  'guildMemberUpdate',
  'guildUnavailable',
  'guildUpdate',
  'message',
  'messageDelete',
  'messageDeleteBulk',
  'messageReactionAdd',
  'messageReactionRemove',
  'messageReactionRemoveAll',
  'messageUpdate',
  'presenceUpdate',
  'rateLimit',
  'ready',
  'reconnecting',
  'resume',
  'roleCreate',
  'roleDelete',
  'roleUpdate',
  'typingStart',
  'typingStop',
  'userNoteUpdate',
  'userUpdate',
  'voiceStateUpdate',
  'warn',
  'webhookUpdate',
  // Commando Events
  'commandBlock',
  'commandCancel',
  'commandError',
  'commandPrefixChange',
  'commandRegister',
  'commandReregister',
  'commandRun',
  'commandStatusChange',
  'commandUnregister',
  'groupRegister',
  'groupStatusChange',
  'providerReady',
  'typeRegister',
  'unknownCommand',
]

function isValidEvent(event) {
  return VALID_DISCORD_EVENTS.includes(event)
}
