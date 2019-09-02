import { Command } from 'discord.js-commando'

import links from '../../../data/documentation'

export default class DocsDocsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'keyword',
          type: 'string',
          prompt: 'keyword to search for?',
        },
      ],
      name: 'docs',
      group: 'docs',
      aliases: ['d'],
      guildOnly: false,
      memberName: 'docs-docs',
      description: 'Match a keyword with a documentation link.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { keyword } = args
    const found = links.find(
      link =>
        link.name === keyword ||
        (link.aliases && link.aliases.some(alias => alias === keyword))
    )

    if (!found) {
      const linksName = links.map(link => link.name).join(', ')
      msg.channel.send(`Documentation not found. Try: ${linksName}`)
    } else {
      msg.channel.send(found.value)
    }
  }
}
