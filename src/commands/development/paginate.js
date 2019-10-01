import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { respondWithPaginatedEmbed } from '../../utils/embed'

let items = [
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
items = [...items, ...items, ...items]

/*
  This development-only command allows one to test the pagination utility.
*/
module.exports = class DevelopmentPaginateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'paginate',
      args: [
        {
          key: 'itemsPerPage',
          type: 'integer',
          prompt: 'how many items to display per page?',
          default: 2,
          validate(value) {
            return value <= items.length
          },
        },
        {
          key: 'observeReactionsFor',
          type: 'integer',
          prompt: 'how long (in ms) to allow pagination for?',
          default: 1000 * 60 * 5,
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
          prompt: 'only the author can paginate?',
          default: true,
        },
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

    let embed = new RichEmbed()
      .setColor('RANDOM')
      .setTitle('Pagination Test')
      .setDescription(
        `**NOTE:** Accepting reactions for: ${observeReactionsFor /
          1000} seconds.`
      )

    respondWithPaginatedEmbed(
      msg,
      embed,
      items,
      [
        { name: 'Foo', value: 'Extra', inline: true },
        { name: 'Bar', value: 'Field', inline: true },
        { name: 'Baz', value: 'Test', inline: true },
      ],
      args
    )
  }
}
