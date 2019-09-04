import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { rfcs } from '../../github'
import { EMPTY_MESSAGE } from '../../utils/constants'

module.exports = class RFCsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'filter',
          type: 'string',
          validate(value) {
            return ['all', 'open', 'closed', 'popular'].includes(value)
          },
          prompt: 'the filter (all, open, closed, merged, popular)?',
        },
      ],
      name: 'list-rfcs',
      group: 'rfcs',
      aliases: ['rfcs'],
      guildOnly: true,
      memberName: 'rfcs',
      description: 'List all RFCs.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { filter } = args

    rfcs
      .listPullRequests()
      .then(({ status, data: rfcs }) => {
        if (status !== 200) {
          return console.warn(`Got status code ${status} when fetching RFCs.`)
        }

        if (filter === 'open') {
          rfcs = rfcs.filter(rfc => rfc.state === 'open')
        } else if (filter === 'closed') {
          rfcs = rfcs.filter(rfc => rfc.state === 'closed')
        } else if (filter === 'popular') {
          return msg.reply('Not yet implemented')
        }

        const embeds = [new RichEmbed('Request for Comments')]

        for (let i = 0, j = 0; i < rfcs.length; i++) {
          // Max 25 fields per embed.
          if (i > 0 && i % 25 === 0) {
            embeds.push(new RichEmbed().setTitle('Continued'))
            j++
          }

          const rfc = rfcs[i]
          const embed = embeds[j]

          embed.addField(`${rfc.number} - ${rfc.title}`, rfc.html_url)
        }

        for (const embed of embeds) {
          msg.channel.send(EMPTY_MESSAGE, { embed })
        }
      })
      .catch(() => {
        return msg.reply('Sorry, an unknown error occured.')
      })
  }
}
