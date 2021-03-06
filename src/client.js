import { readdirSync } from 'fs'
import { join } from 'path'
import { Collection } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'

const { NODE_ENV, COMMAND_PREFIX = '!' } = process.env

let OWNER_IDS = process.env.OWNER_IDS || '269617876036616193' // Default to @evan#9589
if (OWNER_IDS.includes(',')) {
  OWNER_IDS = OWNER_IDS.split(',')
} else {
  OWNER_IDS = [OWNER_IDS]
}
process.env.OWNER_IDS = OWNER_IDS

const PATH_JOBS = join(__dirname, 'jobs')
const PATH_TYPES = join(__dirname, 'types')
const PATH_COMMANDS = join(__dirname, 'commands')

const client = new CommandoClient({
  owner: OWNER_IDS,
  commandPrefix: COMMAND_PREFIX,
})

/*
  Initialise jobs.
*/

client.jobs = new Collection()

const jobFiles = readdirSync(PATH_JOBS).filter(file => file.endsWith('.js'))

for (const file of jobFiles) {
  try {
    const { default: jobDefinition } = require(`./jobs/${file}`)

    const jobInstance = new jobDefinition(client)

    client.jobs.set(jobInstance.name, jobInstance)
  } catch (e) {
    console.warn('Could not load job file: ' + file)
    console.error(e)
  }
}

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
    id: 'jobs',
    name: 'Jobs',
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

  client.jobs
    .filter(job => job.enabled)
    .forEach(job => {
      if (job.shouldExecute(msg)) {
        job.run(msg)
      }
    })
})

export default client
