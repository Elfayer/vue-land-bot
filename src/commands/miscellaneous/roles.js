import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { ROLES } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'

const ROLE_INFORMATION = [
  {
    title: 'Core Team',
    content: `The <@&${ROLES.CORE_TEAM}> are the Vue.js developers. They mostly frequent the #vue2-internals and #vue3-discussions channels.`,
  },
  {
    title: 'Moderators',
    content: `The <@&${ROLES.MODERATORS}> are the keepers of peace and order. Feel free to ping (or preferably DM) them if there is any issue which requires their attention.`,
  },
  {
    title: 'MVPs',
    content: `The <@&${ROLES.MVPS}> are people who've proven to be helpful on the server and may assist you with your issue, if they're available. They generally frequent #code-help and #code-help-too.`,
  },
  {
    title: 'Library Maintainers',
    content: `The <@&${ROLES.LIBRARY_MAINTAINERS}> are people who are maintainers or contributors of popular/important Vue.js libraries, frameworks and tools.`,
  },
  {
    title: 'Community Leaders',
    content: `The <@&${ROLES.COMMUNITY_LEADERS}> are in charge of organising and running things like meetups, events and conferences, or notable community projects and resources.`,
  },
  {
    title: 'Nitro Booster',
    content: `The <@&${ROLES.NITRO_BOOSTERS}> role consists of people who have boosted the server with their Discord Nitro membership (thanks)!`,
  },
]

module.exports = class MiscCodeCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'role',
          type: 'role',
          prompt:
            'info. about a specific role only (optional), or all roles (default)?',
          error:
            'invalid role provided - please respond with a role (example: `Moderators`).',
          default: 'all',
        },
      ],
      name: 'roles',
      group: 'miscellaneous',
      aliases: ['r', 'role'],
      guildOnly: true,
      memberName: 'roles',
      description: 'Explains the various roles on the server',
      examples: [
        '`!roles` - Show info. for all roles.',
        '`!role Moderators` - Show info. for a specific role.',
        '`!role Mod` - Partial matches are supported.',
      ],
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { role } = args

    const embedMessage = new RichEmbed()
      .setColor('#42b883')
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )

    if (role === 'all') {
      for (const roleInfo of ROLE_INFORMATION) {
        embedMessage.addField(roleInfo.title, roleInfo.content)
      }

      embedMessage
        .setTitle('Vue Land Roles')
        .setDescription(
          '**NOTE:** Please do not ping any of these roles (except Moderators).'
        )
    } else {
      const matchedRole = ROLE_INFORMATION.find(
        roleInfo => roleInfo.title === role.name
      )

      if (matchedRole) {
        embedMessage
          .setColor(role.color)
          .setTitle(`Vue Land Roles - ${matchedRole.title}`)
          .setDescription(matchedRole.content)
      } else {
        embedMessage
          .setColor('ORANGE')
          .setTitle(`Vue Land Roles`)
          .setDescription(
            `Sorry but we we don't have any information about the ${role} role.`
          )
      }
    }

    msg.channel.send(embedMessage).then(() => tryDelete(msg))
  }
}
