import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from './constants'
import { CommandMessage } from 'discord.js-commando'
const DEFAULT_EMBED_COLOUR = '#42b883'

export function embedMessage(title, description) {
  return new RichEmbed()
    .setColor(DEFAULT_EMBED_COLOUR)
    .setTitle(title)
    .setDescription(description)
}

/**
 * @typedef {Object} PaginatedEmbedOptions
 * @property {number} [itemsPerPage=10] The number of items to display per page.
 * @property {number} [observeReactionsFor=300000] How long to process reactions for (in milliseconds).
 * @property {boolean} [showDetailsInFooter=true] Show current/total page(s) in the footer?
 * @property {boolean} [inlineFields=false] Should all fields be specified as inline?
 * @property {boolean} [authorOnly=true] Should only authors be allowed to paginate?
 */

/**
 * Allows paginating embeds!
 *
 * @param {CommandMessage} msg The initial message which triggered the command.
 * @param {RichEmbed} embed The embed template (save for the to-be-paginated fields).
 * @param {Array<object, string>} items The items to paginate!
 * @param {Object} extraFields Any extra fields to add after the paginated fields.
 * @param {PaginatedEmbedOptions} options The options for the paginated embed.
 */
export async function respondWithPaginatedEmbed(
  msg,
  embed,
  items,
  extraFields = [],
  options = {}
) {
  if (!(msg instanceof CommandMessage)) {
    throw new Error('Invalid message passed!')
  }

  const { author, channel } = msg

  if (!Array.isArray(items)) {
    throw new Error('Cannot paginate a non-array!')
  }

  if (!(embed instanceof RichEmbed)) {
    throw new Error('Invalid embed passed!')
  }

  if (!options.itemsPerPage) {
    options.itemsPerPage = 10
  }

  /*
    NOTE: API limits such as these are subject to change - should we move
          them all to a centralised location?
  */
  if (options.itemsPerPage > 25) {
    throw new Error(
      'Items per page may not exceed 25 due to Discord API limits.'
    )
  }

  /*
    Presumably the user will only want to paginate the fields immediately 
    after initiating the command and only for a short time so in the interests 
    of efficiency/performance we stop observing reaction events after a while.
  */
  if (!options.observeReactionsFor) {
    options.observeReactionsFor = 1000 * 60 * 5 // 5 minutes
  }

  /*
    It may be that the footer is being used for some other information in which 
    case it is desirable to not have the footer be overwritten by pagination info.
  */
  if (typeof options.showDetailsInFooter === 'undefined') {
    options.showDetailsInFooter = true
  }

  /*
    If enabled the fields will be "inline" which in plain terms means that there'll be 
    3 columns of fields instead of 1, which ends up saving quite a lot of space!
  */
  if (typeof options.inlineFields === 'undefined') {
    options.inlineFields = false
  }

  /*
    By default only the author can paginate (the alternate is people fighting over the current 
    page which is generally nothing more than annoying). However this is overrideable.
  */
  if (typeof options.authorOnly === 'undefined') {
    options.authorOnly = true
  }

  const itemsCount = items.length
  let { itemsPerPage } = options

  let pageCurrent = 1
  const pageLast = Math.ceil(itemsCount / itemsPerPage)

  /*
    Compensate for extra (non-paginated) fields, if applicable.
  */
  if (extraFields.length && itemsPerPage + extraFields.length > 25) {
    itemsPerPage -= extraFields.length
  }

  /*
    1. Clear existing fields
    2. Add paginated fields
    3. Add non-paginated fields
  */
  embed.fields = []
  embed = _addFieldsToEmbed(
    embed,
    items.slice(0, itemsPerPage),
    options.inlineFields
  )
  embed = _addFieldsToEmbed(embed, extraFields, options.inlineFields)

  /*
    Add footer.
  */
  if (options.showDetailsInFooter) {
    embed.setFooter(`Page ${pageCurrent} of ${pageLast}.`)
  }

  /*
    Send first page + add pagination buttons.
  */
  const response = await channel.send(embed)
  await response.react('⬅')
  await response.react('➡')

  /*
    Collect relevant reactions.
  */
  const collector = response.createReactionCollector(
    (reaction, user) => {
      if (options.authorOnly && user.id !== author.id) {
        return false
      }

      // NOTE: Avoids the bot triggering pagination when adding reactions!
      if (!options.authorOnly && user.id === msg.client.user.id) {
        return false
      }

      return ['⬅', '➡'].includes(reaction.emoji.name)
    },
    {
      time: options.observeReactionsFor,
    }
  )

  /*
    Handle reaction.
  */
  collector.on('collect', async reaction => {
    if (reaction.emoji.name === '⬅') {
      pageCurrent = Math.max(1, --pageCurrent)
    } else if (reaction.emoji.name === '➡') {
      pageCurrent = Math.min(pageLast, ++pageCurrent)
    }

    const sliceFrom = (pageCurrent - 1) * itemsPerPage
    const sliceTo = Math.min(pageCurrent * itemsPerPage, items.length)
    const itemsForPage = items.slice(sliceFrom, sliceTo)

    embed.fields = []
    embed = _addFieldsToEmbed(embed, itemsForPage, options.inlineFields)
    embed = _addFieldsToEmbed(embed, extraFields, options.inlineFields)

    if (options.showDetailsInFooter) {
      embed.setFooter(`Page ${pageCurrent} of ${pageLast}.`)
    }

    // NOTE: The API disallows removing reactions in DMs.
    if (channel.type !== 'dm') {
      await reaction.remove(author.id)
    }

    response.edit(EMPTY_MESSAGE, { embed })
  })

  /*
    Remove the buttons once we're done.
  */
  collector.on('end', () => {
    // NOTE: The API disallows removing reactions in DMs.
    if (channel.type !== 'dm') {
      response.clearReactions()
    }
  })
}

/**
 * Internal/private function used by {@link respondWithPaginatedEmbed}.
 * Allows for fields to be an object mirroring the `RichEmbed`'s `addField`
 * params, granting optional control over how the fields are displayed.
 *
 * So the following are both valid `fields` arrays:
 *
 *   - `[ { name: 'Foo', value: 'Hello' }, { name: 'Bar', value: 'World' } ]`
 *   - `[ 'Foo', 'Bar' ]`
 *
 * @param {RichEmbed} embed The embed to add the fields to.
 * @param {Array<string, object>} fields The fields to add.
 * @param {boolean} inlineFields The `inlineFields` option passed to {@link PaginatedEmbedOptions}.
 */
function _addFieldsToEmbed(embed, fields, inlineFields) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]

    if (
      typeof field === 'object' &&
      typeof field.name !== 'undefined' &&
      typeof field.value !== 'undefined'
    ) {
      embed.addField(
        field.name,
        field.value,
        inlineFields ? true : field.inline ? field.inline : false
      )
    } else {
      /*
        NOTE: It may be desirable to allow choosing between the following two via 
              another option (in addition to inlineFields), at some point?

          embed.addField(EMPTY_MESSAGE, field, inlineFields)
          embed.addField(field, EMPTY_MESSAGE, inlineFields)
      */
      embed.addField(EMPTY_MESSAGE, field, inlineFields)
    }
  }

  return embed
}
