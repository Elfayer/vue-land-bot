import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { respondWithPaginatedEmbed } from '../../utils/embed'

/*
  Just some fun/silly made-up data to test pagination with.
*/
const items = [
  { name: 'evan', value: 'so cool they even have their own emoji' },
  { name: 'gusto', value: 'benevolent dictator for life <3' },
  { name: 'elfayer', value: 'unrivaled at archery (except by Robin Hood)' },
  { name: 'naito', value: 'has degree in TypeScript witchcraft' },
  { name: 'lloyd', value: 'is practically neighbours with sustained' },
  { name: 'akryum', value: 'is there anything he cannot do' },
  { name: 'dobromir', value: '#most-attractive-moderator' },
  { name: 'dr. taco', value: 'mexican food specialist and meme expert' },
  { name: 'joe', value: 'has gifs for all possible occasions' },
  { name: 'dave stewart', value: 'saviour of all vuex users' },
  { name: 'galvez', value: 'best hat in all the lands' },
]

/*
  This development-only command allows developers to test the pagination 
  utility. It is only available on the development server.
*/
module.exports = class DevelopmentPaginateCommand extends Command {
  constructor(client) {
    super(client, {
      enabled: process.env.NODE_ENV === 'development',
      guarded: true,
      name: 'paginate',
      args: [
        {
          key: 'itemsPerPage',
          type: 'integer',
          prompt: 'how many items to display per page?',
        },
        {
          key: 'observeReactionsFor',
          type: 'integer',
          prompt: 'how long (in ms) to allow pagination for?',
          default: 1000 * 60 * 2,
        },
        {
          key: 'showDetailsInFooter',
          type: 'boolean',
          prompt: 'show current page etc. in the footer?',
          default: true,
        },
        {
          key: 'inlineFields',
          type: 'boolean',
          prompt: 'make all fields inline?',
          default: false,
        },
        {
          key: 'authorOnly',
          type: 'boolean',
          prompt: 'only allow the author to paginate?',
          default: true,
        },
        {
          key: 'addRequestedBy',
          type: 'boolean',
          prompt: 'show the author details in the embed?',
          default: true,
        },
      ],
      examples: [
        '!paginate 5 - Five items per page',
        '!paginate 5 30000 - As above, plus: Pagination active for 30 seconds.',
        "!paginate 5 30000 false - As above, plus: Don't show details in footer.",
        '!paginate 5 30000 false true - As above, plus: Force all fields to be inline.',
        '!paginate 5 30000 false true false - As above, plus: Allow others to paginate.',
        '!paginate 5 30000 false true false true - As above, plus: Show author details.',
      ],
      group: 'development',
      guildOnly: false,
      memberName: 'paginate',
      description: 'Test the paginated embed utility.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { observeReactionsFor } = args

    const embed = new RichEmbed()
      .setColor('RANDOM')
      .setTitle('Pagination Test')
      .setDescription(
        `**NOTE:** Accepting reactions for: ${observeReactionsFor /
          1000} seconds.`
      )

    const extraFields = [
      { name: 'Testing non-paginated fields', value: 'Test!', inline: true },
    ]

    respondWithPaginatedEmbed(msg, embed, items, extraFields, args)
  }
}
