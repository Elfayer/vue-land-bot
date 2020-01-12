import EventEmitter from 'events'
import tasks, { isEmpty } from '../services/tasks'

/**
 * A Task is a task which by default runs for every single message received so
 * long as it is enabled and its shouldExecute() returns true.
 *
 * Example usages:
 *
 *   - Check message contents against a banned word list (and optionally warn/kick/ban)
 *   - etc.
 *
 * A Task does not necessarily need to process messages however - there is a
 * concept of event-only tasks. Such a task should simply return false in
 * shouldExecute and specify a list of Discord/Commando events via TaskOptions.events.
 *
 * When the task is enabled, listeners for those events will be attached to the
 * CommandoClient and when the task is disabled they will be removed.
 *
 * See `src/tasks/log.js` for an example of an event-only task.
 *
 * @event Task#enabled
 * @event Task#disabled
 * @extends EventEmitter
 * @abstract
 */
export default class Task extends EventEmitter {
  /**
   * Create a new Task.
   * @param {CommandoClient} client The CommandoClient instance.
   * @param {TaskOptions} options The options for the Task.
   */
  constructor(client, options = {}) {
    super()

    this.client = client
    this.options = options

    /*
      Tasks are stored as a key-value pair in a Collection (Map) on the client.
      The name is used as the key, as such it must be both provided and unique.
    */
    if (!options.name) {
      throw new Error('Task lacks required option - name.')
    }

    if (client.tasks.has(options.name)) {
      throw new Error(
        `Task names must be unique, conflicting name - ${options.name}.`
      )
    }

    /*
      A list of user, role, channel and category IDs.

      If any of these match then the task will NEVER be executed.
    */
    if (!options.ignored) {
      options.ignored = {}
    }

    ;['roles', 'users', 'channels'].forEach(key => {
      if (!options.ignored[key]) {
        options.ignored[key] = []
      }
    })

    /*
      Arbitrary configuration e.g. log channels, mention roles etc.
    */
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

    if (typeof options.dmOnly === 'undefined') {
      options.dmOnly = false
    }

    if (typeof options.guildOnly === 'undefined') {
      options.guildOnly = false
    }

    if (options.guildOnly && options.dmOnly) {
      console.warn('Conflicting options - guildOnly and warnOnly.')
    }

    if (typeof options.guild !== 'undefined') {
      this.guild = options.guild
    }

    this.name = options.name
    this.events = options.events
    this.config = options.config
    this.ignored = options.ignored
    this.description = options.description || ''

    this.handlers = {}

    // NOTE: We need to bind the events here else their `this` will be `CommandoClient`.
    for (const event of this.events) {
      if (!isValidEvent(event)) {
        continue
      }

      if (typeof this[event] !== 'function') {
        console.warn(`Missing event handler for event ${event} for ${this}.`)
      }

      this.handlers[event] = this[event].bind(this)

      this[event] = (...args) => {
        if (this.shouldEventFire(event, args)) {
          this.handlers[event].apply(this, args)
        }
      }
    }

    if (this.inhibit) {
      this._inhibit = this.inhibit.bind(this)
    }

    this.on('enabled', () => {
      this.attachEventListeners()
      this.registerInhibitor()
    })
    this.on('disabled', () => {
      this.removeEventListeners()
      this.unregisterInhibitor()
    })

    this._dmOnly = options.dmOnly
    this._guildOnly = options.guildOnly

    // The task DB is populated, so we'll override the defaults (`options`).
    if (!isEmpty()) {
      this.readConfig()
    }

    this.enabled = options.enabled // NOTE: Must come last because fires an event.
  }

  /**
   * Attach listeners to the `DiscordClient` for every event in `this.events`,
   * provided that there is an instance method matching the event name.
   */
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

  /**
   * Register the inhibitor with the `DiscordClient`, if applicable.
   */
  registerInhibitor() {
    if (this.inhibit && typeof this.inhibit === 'function') {
      this.client.dispatcher.addInhibitor(this._inhibit)
    }
  }

  /**
   * Register the inhibitor with the `DiscordClient`, if applicable.
   */
  unregisterInhibitor() {
    if (this.inhibit && typeof this.inhibit === 'function') {
      this.client.dispatcher.removeInhibitor(this._inhibit)
    }
  }

  /**
   * The task will not be ran if this returns `false` - even if the task is enabled.
   *
   * By default it checks `this.ignored.roles|users|channels`, returning `false` for
   * any matches - if no matches are found, it returns `true`.
   *
   * @param {CommandoMessage} msg
   * @returns {boolean} Whether to run (execute) the Task or not.
   */
  shouldExecute(msg) {
    if (msg.channel.type === 'dm') {
      if (this.guildOnly) {
        return false
      }
    } else {
      if (this.dmOnly) {
        return false
      }
    }

    if (this.ignored.roles.length && msg.member) {
      return msg.member.roles.some(role => this.ignored.roles.includes(role.id))
    }

    if (this.ignored.users.length) {
      return this.ignored.users.some(userId => msg.author.id === userId)
    }

    if (this.ignored.channels.length) {
      return this.ignored.channels.some(
        channelId => msg.channel.id === channelId
      )
    }

    return true
  }

  /**
   * The task itself - ran if `enabled` is `true` and `shouldExecute` returns `true`.
   *
   * @param {CommandoMessage} message
   */
  /* eslint-disable no-unused-vars */
  run(msg) {}

  /**
   * Returns a string representation of the Task.
   *
   * @return {string} The string representation (e.g. <Task#log>).
   */
  toString() {
    return `<Task#${this.name}>`
  }

  /**
   * Returns the enabled status of the Task as a string.
   *
   * @return {string} Either `enabled` or `disabled`.
   */
  getStatus() {
    return this.enabled ? 'enabled' : 'disabled'
  }

  /**
   * Is the Task enabled?
   *
   * @return {boolean} Is this Task enabled?
   */
  get enabled() {
    return this._enabled
  }

  /**
   * Set a Task as enabled or disabled.
   *
   * @param {boolean} enabled Set as enabled or disabled.
   * @fires Task#enabled
   * @fires Task#disabled
   */
  set enabled(enabled) {
    // NOTE: Without this check, in theory we can end up with duplicate event listeners.
    if (this._enabled === enabled) {
      return
    }

    this._enabled = enabled
    this.writeConfig({ enabled: this._enabled })

    if (enabled) {
      this.emit('enabled')
    } else {
      this.emit('disabled')
    }
  }

  /**
   * Is the Task DM-only?
   *
   * @return {boolean} Is this DM-only?
   */
  get dmOnly() {
    return this._dmOnly
  }

  /**
   * Set a Task as DM-only or not.
   *
   * @param {boolean} value Is the Task DM-only or not.
   * @fires Task#enabled
   * @fires Task#disabled
   */
  set dmOnly(value) {
    this._dmOnly = value
    this.writeConfig({ dmOnly: this._dmOnly })
  }

  /**
   * Is the Task DM-only?
   *
   * @return {boolean} Is this DM-only?
   */
  get guildOnly() {
    return this._guildOnly
  }

  /**
   * Set a Task as DM-only or not.
   *
   * @param {boolean} value Is the Task DM-only or not.
   * @fires Task#enabled
   * @fires Task#disabled
   */
  set guildOnly(value) {
    this._guildOnly = value
    this.writeConfig({ guildOnly: this._guildOnly })
  }

  /**
   * Create a JSON representation of the task.
   */
  toJSON() {
    return {
      name: this.name,
      guild: this.guild,
      guildOnly: this.guildOnly,
      dmOnly: this.dmOnly,
      config: this.config,
      ignored: this.ignored,
      enabled: this.enabled || this.options.enabled, // NOTE: Fallback to handle new tasks.
    }
  }

  /**
   * Read the task's configuration from lowDB and apply it.
   */
  readConfig() {
    try {
      let config = tasks
        .get('tasks')
        .find({ name: this.name })
        .value()

      if (config) {
        this.guild = config.guild
        this.guildOnly = config.guildOnly
        this.dmOnly = config.dmOnly
        this.config = config.config
        this.ignored = config.ignored

        console.debug(
          `${this} Read configuration from DB and applied to instance.`
        )
      } else {
        tasks.get('tasks').push(this.toJSON())

        console.debug(
          `${this} New task (not in DB) detected - writing default configuration!`
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Write the task's configuration to lowDB.
   */
  writeConfig(assign) {
    try {
      if (!assign) {
        assign = this.toJSON()
      }

      tasks
        .get('tasks')
        .find({ name: this.name })
        .assign(assign)
        .write()
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Determine if an event for an enabled task should actually fire.
   *
   * Consider:
   *   - if a task is dmOnly but an event originates from a guild
   *   - if a task is guildOnly but an event originates from a DM
   *   - if a task is guild-specific but the guild does not match
   *
   * @param {string} eventName The name of the event.
   * @param  {array} eventArgs The args passed to the event.
   */
  shouldEventFire(eventName, eventArgs) {
    try {
      let message, channel, guild // We could be looking for any one of these.

      switch (eventName) {
        case 'channelCreate':
        case 'channelDelete':
        case 'channelPinsUpdate':
        case 'channelUpdate':
        case 'emojiCreate':
        case 'emojiDelete':
        case 'emojiUpdate':
        case 'guildMemberAdd':
        case 'guildMemberAvailable':
        case 'guildMemberRemove':
        case 'guildMemberSpeaking':
        case 'guildMemberUpdate':
        case 'message':
        case 'messageDelete':
        case 'messageUpdate':
        case 'presenceUpdate':
        case 'roleCreate':
        case 'roleDelete':
        case 'roleUpdate':
        case 'voiceStateUpdate':
        case 'commandBlocked':
        case 'unknownCommand':
          message = eventArgs[0]
          break

        case 'commandCancel':
        case 'commandError':
        case 'commandRun':
          message = eventArgs[2].message
          break

        case 'typingStart':
        case 'typingStop':
        case 'webhookUpdate':
          channel = eventArgs[0]
          break

        case 'messageDeleteBulk':
          message = eventArgs[0].first()
          break

        case 'guildBanAdd':
        case 'guildBanRemove':
        case 'guildCreate':
        case 'guildDelete':
        case 'guildIntegrationsUpdate':
        case 'guildUnavailable':
        case 'guildUpdate':
        case 'commandPrefixChange':
        case 'commandStatusChange':
          guild = eventArgs[0]
          break

        case 'guildMembersChunk':
          guild = eventArgs[1]
          break

        case 'messageReactionAdd':
        case 'messageReactionRemove':
        case 'messageReactionRemoveAll':
          message = eventArgs[0].message
          break

        // The event cannot be tied to a message/channel/guild
        // therefore options such as `dmOnly` are irrelevant.
        default:
          return true
      }

      let guildId = -1

      if (guild) {
        guildId = guild.id
      } else if (channel && channel.guild) {
        guildId = channel.guild.id
      } else if (message && message.guild) {
        guildId = message.guild.id
      }

      if (this.dmOnly && guildId !== -1) {
        return false // The event originated from a guild - bail.
      } else if (this.guildOnly && guildId === -1) {
        return false // The event originated from a DM - bail.
      }

      // This is a single-guild task - ensure a match.
      if (this.guild && guildId === this.guild) {
        return true
      }

      return false
    } catch (e) {
      console.error(e)
      return false
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
  'commandBlocked', // NOTE: Is commandBlocked in older versions and commandBlock in newer.
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
