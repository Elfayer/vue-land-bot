import { CommandoClient } from 'discord.js-commando'

const {
  OWNER
} = process.env

const PATH_TYPES = join(__dirname, "types")
const PATH_COMMANDS = join(__dirname, "commands")

const client = new CommandoClient({
  owner : OWNER
})

/*
  Register command groups.

  https://discord.js.org/#/docs/commando/master/class/CommandoRegistry?scrollTo=registerGroups
*/
client.registry.registerGroups([
  {
    id: 'dev',
    name: 'Development'
  },
  {
    id: 'docs',
    name: 'Documentation'
  },
  {
    id: 'misc',
    name: 'Miscellaneous'
  },
  {
    id: 'mod',
    name: 'Moderation'
  }
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

/*
  Set up some global error handling and some purely informational event handlers.
*/

client.on('warn',  console.warn)
client.on('error', console.error)

client.on('ready', () => console.info('Client ready!'))
client.on('resume', () => console.info('Connection resumed!'))
client.on('disconnect', () => console.info('Lost connection!'))
client.on('reconnecting', () => console.info('Attempting to reconnect.'))

process.on('unhandledRejection', console.error)

export default client
