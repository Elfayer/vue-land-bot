import { Command } from 'discord.js-commando'
import { inlineCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import { createDefaultEmbed } from '../../utils/embed'
import { NOTIFICATION_ROLE } from '../../services/version-checker'

module.exports = class AnnouncementsNotifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'notify',
      examples: [inlineCode('!notify')],
      group: 'announcements',
      guildOnly: true,
      memberName: 'notify',
      description: 'Sign yourself up for automated release notifications.',
      clientPermissions: ['MANAGE_ROLES'],
    })
  }

  hasPermission() {
    return true
  }

  async run(msg) {
    const notifyRole = msg.guild.roles.find(
      role => role.name.toLowerCase() === NOTIFICATION_ROLE.toLowerCase()
    )

    try {
      if (!notifyRole) {
        throw new Error(`Unable to find role ${inlineCode(NOTIFICATION_ROLE)}!`)
      }

      const embed = createDefaultEmbed(msg).setTitle(
        'Automated Release Notifications'
      )

      if (msg.member.roles.get(notifyRole.id)) {
        msg.member.removeRole(notifyRole)

        embed
          .setDescription(
            `Okay, you've been removed from the ${notifyRole} role and will no longer be informed of new releases.`
          )
          .setColor('RED')
      } else {
        msg.member.addRole(notifyRole)

        embed
          .setDescription(
            `Okay, you've been added to the ${notifyRole} role and will be informed of any new releases.`
          )
          .setColor('GREEN')
      }

      msg.channel.send(embed)
      cleanupInvocation(msg)
    } catch (error) {
      console.error(error)
      msg.channel.send(this.buildErrorEmbed(msg, error))
      cleanupInvocation(msg)
    }
  }

  buildErrorEmbed(msg, error) {
    return createDefaultEmbed(msg)
      .setTitle('Sorry, an error occured.')
      .setDescription(error.message ? error.message : error)
      .setColor('ORANGE')
  }
}
