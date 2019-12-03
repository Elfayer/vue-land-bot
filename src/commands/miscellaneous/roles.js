import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { ROLES } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'

module.exports = class MiscCodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roles',
      group: 'miscellaneous',
      aliases: ['r'],
      guildOnly: true,
      memberName: 'roles',
      description: 'Explains the various roles on the server',
      examples: ['!roles'],
    })
  }

  hasPermission() {
    return true
  }

  async run(msg) {
    const embedMessage = new RichEmbed()
      .setColor('#42b883')
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )
      .setTitle('Vue Land Roles')
      .setDescription(
        '**NOTE:** Please do not ping any of these roles (except Moderators).'
      )
      .addField(
        'Core Team',
        `The <@&${ROLES.CORE_TEAM}> are the Vue.js developers. They mostly frequent the #vue2-internals and #vue3-discussions channels.`
      )
      .addField(
        'Moderators',
        `The <@&${ROLES.MODERATORS}> are the keepers of peace and order. Feel free to ping (or preferably DM) them if there is any issue which requires their attention.`
      )
      .addField(
        'MVPs',
        `The <@&${ROLES.MVPS}> are people who've proven to be helpful on the server and may assist you with your issue, if they're available. They generally frequent #code-help and #code-help-too.`
      )
      .addField(
        'Library Maintainers',
        `The <@&${ROLES.LIBRARY_MAINTAINERS}> are people who are maintainers or contributors of popular/important Vue.js libraries, frameworks and tools.`
      )
      .addField(
        'Community Leaders',
        `The <@&${ROLES.COMMUNITY_LEADERS}> are in charge of organising and running things like meetups, events and conferences, or notable community projects and resources.`
      )
      .addField(
        'Nitro Booster',
        `The <@&${ROLES.NITRO_BOOSTERS}> role consists of people who have boosted the server with their Discord Nitro membership (thanks)!`
      )

    msg.channel.send(embedMessage).then(() => tryDelete(msg))
  }
}
