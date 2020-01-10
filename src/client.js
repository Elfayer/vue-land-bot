import { readdirSync } from 'fs'
import { join } from 'path'
import { Collection } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { setDefaults } from './services/tasks'

const { NODE_ENV, COMMAND_PREFIX = '!' } = process.env

/*
  We allow a comma-separated list of owner IDs, so check for 
  that and apply it back onto process.env if found.
*/
let OWNER_IDS = process.env.OWNER_IDS || '269617876036616193' // Default to @evan#9589
if (OWNER_IDS.includes(',')) {
  OWNER_IDS = OWNER_IDS.split(',')
} else {
  OWNER_IDS = [OWNER_IDS]
}
process.env.OWNER_IDS = OWNER_IDS

/*
  Ensure that NODE_ENV is set to development if it is unset.
*/
if (!NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const PATH_TASKS = join(__dirname, 'tasks')
const PATH_TYPES = join(__dirname, 'types')
const PATH_COMMANDS = join(__dirname, 'commands')

const client = new CommandoClient({
  owner: OWNER_IDS,
  commandPrefix: COMMAND_PREFIX,
})

/*
  Initialise tasks.
*/

client.tasks = new Collection()

const taskFiles = readdirSync(PATH_TASKS).filter(file => file.endsWith('.js'))

for (const file of taskFiles) {
  try {
    const { default: taskDefinition } = require(`./tasks/${file}`)

    const taskInstance = new taskDefinition(client)

    client.tasks.set(taskInstance.name, taskInstance)
  } catch (e) {
    console.warn('Could not load task file: ' + file)
    console.error(e)
  }
}

/*
  Write configuration file if applicable (DB doesn't yet exist).
*/
setDefaults(client.tasks.map(task => task.toJSON()))

/*
  Register command groups.

  https://discord.js.org/#/docs/commando/master/class/CommandoRegistry?scrollTo=registerGroups
*/
client.registry.registerGroups([
  {
    id: 'documentation',
    name: 'Documentation',
  },
  {
    id: 'informational',
    name: 'Informational',
  },
  {
    id: 'moderation',
    name: 'Moderation',
  },
  {
    id: 'tasks',
    name: 'Tasks',
  },
  {
    id: 'rfcs',
    name: 'RFCs',
  },
  {
    id: 'development',
    name: 'development',
  },
])

/*
  Register default command groups, commands and argument types.

  And then register our own types and commands.

  https://discord.js.org/#/docs/commando/master/class/CommandoRegistry?scrollTo=registerDefaults
  https://discord.js.org/#/docs/commando/master/class/CommandoRegistry?scrollTo=registerTypesIn
  https://discord.js.org/#/docs/commando/master/class/CommandoRegistry?scrollTo=registerCommandsIn
*/
client.registry.registerDefaults()
client.registry.registerTypesIn(PATH_TYPES)
client.registry.registerCommandsIn(PATH_COMMANDS)

if (NODE_ENV === 'production') {
  const evalCommand = client.registry.findCommands('eval')

  if (evalCommand.length === 1) {
    client.registry.unregisterCommand(evalCommand[0])
  }
}
/*
  Set up some global error handling and some purely informational event handlers.
*/

client.on('warn', console.warn)
client.on('error', console.error)

client.on('ready', () => console.info('Client ready!'))
client.on('resume', () => console.info('Connection resumed!'))
client.on('disconnect', () => console.info('Lost connection!'))
client.on('reconnecting', () => console.info('Attempting to reconnect.'))

process.on('unhandledRejection', console.error)

/*
  Process jobs.
*/
client.on('message', msg => {
  // Don't process own messages.
  if (msg.author.id === msg.client.user.id) {
    return
  }

  client.tasks
    .filter(task => task.enabled)
    .forEach(task => {
      if (task.shouldExecute(msg)) {
        task.run(msg)
      }
    })
})

export default client
