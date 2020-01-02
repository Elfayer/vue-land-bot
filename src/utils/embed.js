import { RichEmbed } from 'discord.js'
import { EMOJIS, EMPTY_MESSAGE, DISCORD_EMBED_FIELD_LIMIT } from './constants'
import { CommandMessage } from 'discord.js-commando'

export const DEFAULT_EMBED_COLOUR = '#42b883'

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
 * @property {boolean} [addRequestedBy=true] Should we display the author on the embed?
 * @property {boolean} [addExtraFieldsToInitialEmbed=false] Should extra fields also be added to the initial embed?
 */

/**
 * @typedef {Object} PaginatedEmbedContext
 * @property {CommandMessage} [msg] The message that triggered the initial command.
 * @property {Channel} [channel] The channel the message belongs to.
 * @property {RichEmbed} [embed] The embed passed to respondWithPaginatedEmbed.
 * @property {Array<string|object|RichEmbed>} [items] The items passed to respondWithPaginatedEmbed.
 * @property {Array<string|object>} [fields] The extra fields passed to respondWithPaginatedEmbed.
 * @property {number} [itemsCount] The number of items.
 * @property {number} [itemsPerPage] The number of items to display per page.
 * @property {number} [pageCurrent] The current page.
 * @property {number} [pageLast] The last page / total number of pages.
 */

const DEFAULT_ITEMS_PER_PAGE = 10

/**
 * Allows paginating embeds!
 *
 * @param {CommandMessage} msg The initial message which triggered the command.
 * @param {RichEmbed} embed The embed template (save for the to-be-paginated fields).
 * @param {Array<object|string|RichEmbed>} items An array of strings, field objects (name/value), or embeds to paginate.
 * @param {Object} fields Any extra fields to add after the paginated fields.
 * @param {PaginatedEmbedOptions} options The options for the paginated embed.
 */
export async function respondWithPaginatedEmbed(
  msg,
  embed,
  items,
  fields = [],
  options = {}
) {
  if (!(msg instanceof CommandMessage)) {
    throw new Error('Invalid message passed!')
  }

  if (!Array.isArray(items)) {
    throw new Error('Cannot paginate a non-array!')
  }

  if (!(embed instanceof RichEmbed)) {
    throw new Error('Invalid embed passed!')
  }

  if (!options.itemsPerPage) {
    options.itemsPerPage = DEFAULT_ITEMS_PER_PAGE
  } else if (options.itemsPerPage > DISCORD_EMBED_FIELD_LIMIT) {
    throw new Error(
      `Items per page may not exceed ${DISCORD_EMBED_FIELD_LIMIT} due to Discord API limits.`
    )
  }

  /*
    If the pagination items are embeds then things work slightly differently.
    Instead, the initial embed is treated as the first page and instead of just 
    changing the fields of the initial embed, instead we change the entire embed.

    This is useful for e.g. disambiguated results (e.g. `!api v-`).
  */
  if (!options.itemsAreEmbeds) {
    options.itemsAreEmbeds = items.every(item => item instanceof RichEmbed)
  }

  /*
    Presumably the user will only want to paginate the fields immediately 
    after initiating the command and only for a short time, so in the interests 
    of efficiency/performance we stop observing reaction events after a while.
  */
  if (!options.observeReactionsFor) {
    options.observeReactionsFor = 1000 * 60 * 5 // 5 minutes
  }

  /*
    It may be that the footer is being used for some other information in which 
    case it is desirable to not have the footer be overwrote by pagination info.
  */
  if (typeof options.showDetailsInFooter === 'undefined') {
    options.showDetailsInFooter = true
  }

  /*
    If enabled the fields will be "inline" which basically means that there'll be 
    3 columns of fields instead of 1, which ends up saving quite a lot of space!
  */
  if (typeof options.inlineFields === 'undefined') {
    options.inlineFields = false
  }

  /*
    By default only the author can paginate (the alternative is people fighting 
    over the it which is rather annoying). However, this is overrideable.
  */
  if (typeof options.authorOnly === 'undefined') {
    options.authorOnly = true
  }

  /*
    By default we add the user's and name to the embed, above the title.
  */
  if (typeof options.addRequestedBy === 'undefined') {
    options.addRequestedBy = true
  }

  /*
    By default, when `itemsAreEmbeds` is `true` & `extraFields` are specified, we 
    don't add the fields to the *initial* embed, only to the paginated item embeds.
  */
  if (typeof options.addExtraFieldsToInitialEmbed === 'undefined') {
    options.addExtraFieldsToInitialEmbed = false
  }

  /*
    The context is passed to functions which can't access data via 
    closures and holds pagination data and so on.
  */
  const context = {
    msg,
    channel: msg.channel,
    embed: { ...embed },
    items: [...items],
    fields,
    itemsCount: items.length,
    itemsPerPage: options.itemsPerPage,
    pageCurrent: 1,
  }
  context.pageLast = options.itemsAreEmbeds
    ? context.itemsCount + 1 // Initial embed also counts as a page.
    : Math.ceil(context.itemsCount / context.itemsPerPage)

  /*
    Compensate for extra (non-paginated) fields, if applicable.
  */
  if (
    context.fields.length &&
    context.itemsPerPage + context.fields.length > DISCORD_EMBED_FIELD_LIMIT
  ) {
    context.itemsPerPage -= context.fields.length
  }

  /*
    Add footer.
  */
  if (options.showDetailsInFooter) {
    context.embed = _setFooter(context.embed, context)
  }

  /*
    Add author.
  */
  if (options.addRequestedBy) {
    context.embed = _setAuthor(context.embed, msg)

    if (options.itemsAreEmbeds) {
      context.items = context.items.map(item => _setAuthor(item, msg))
    }
  }

  /*
    Add extra fields.
  */
  if (options.itemsAreEmbeds) {
    context.items = context.items.map(item =>
      _addFieldsToEmbed(item, context.fields, options.inlineFields)
    )

    if (options.addExtraFieldsToInitialEmbed) {
      context.embed = _addFieldsToEmbed(
        context.embed,
        context.fields,
        options.inlineFields
      )
    }
  } else {
    /*
      1. Clear existing fields
      2. Add paginated fields for first page
      3. Add non-paginated fields
    */
    context.embed.fields = []
    context.embed = _addFieldsToEmbed(
      context.embed,
      items.slice(0, context.itemsPerPage),
      options.inlineFields
    )
    context.embed = _addFieldsToEmbed(
      context.embed,
      context.fields,
      options.inlineFields
    )
  }

  /*
    Send first page + add pagination buttons.
  */
  // eslint-disable-next-line require-atomic-updates
  context.response = await context.channel.send(EMPTY_MESSAGE, {
    embed: context.embed,
  })

  await context.response.react(msg.client.emojis.get(EMOJIS.PAGINATION.FIRST))
  await context.response.react(msg.client.emojis.get(EMOJIS.PAGINATION.PREV))
  await context.response.react(msg.client.emojis.get(EMOJIS.PAGINATION.NEXT))
  await context.response.react(msg.client.emojis.get(EMOJIS.PAGINATION.LAST))

  /*
    Collect relevant reactions.
  */
  const collector = _createCollector(context, options)

  /*
    Handle pagination upon reaction.
  */
  collector.on('collect', _handlePagination(context, options))

  /*
    Clear pagination buttons after `observeReactionsFor` ms.
  */
  collector.on('end', () => {
    // NOTE: The API disallows removing reactions in DMs.
    if (context.channel.type !== 'dm') {
      context.response.clearReactions()
    }
  })
}

/**
 * Returns a reaction collector which only observes ⬅ / ➡ plus
 * respects the `authorOnly` and `observeReactionsFor` options.
 *
 * @param {PaginatedEmbedContext} context The context.
 * @param {PaginatedEmbedOptions} options The options.
 * @returns {Collector} The collector.
 */
function _createCollector(
  { msg, msg: { author }, response },
  { authorOnly, observeReactionsFor }
) {
  return response.createReactionCollector(
    (reaction, user) => {
      if (authorOnly && user.id !== author.id) {
        return false
      }

      // NOTE: Avoids the bot triggering pagination when adding reactions!
      if (!authorOnly && user.id === msg.client.user.id) {
        return false
      }

      return Object.values(EMOJIS.PAGINATION).includes(reaction.emoji.id)
    },
    {
      time: observeReactionsFor,
    }
  )
}

/**
 * Handles all actual pagination logic when the page changes.
 *
 * @param {PaginatedEmbedContext} context The context.
 * @param {PaginatedEmbedOptions} options The options.
 * @returns {Function} The function that will handle pagination.
 */
function _handlePagination(
  {
    response,
    pageCurrent,
    pageLast,
    itemsPerPage,
    embed,
    items,
    fields,
    channel,
    msg: { author },
  },
  { inlineFields, itemsAreEmbeds, showDetailsInFooter }
) {
  return async reaction => {
    switch (reaction.emoji.id) {
      case EMOJIS.PAGINATION.FIRST:
        pageCurrent = 1
        break
      case EMOJIS.PAGINATION.PREV:
        pageCurrent = Math.max(1, --pageCurrent)
        break
      case EMOJIS.PAGINATION.NEXT:
        pageCurrent = Math.min(pageLast, ++pageCurrent)
        break
      case EMOJIS.PAGINATION.LAST:
        pageCurrent = pageLast
        break
    }

    let responseEmbed

    /*
      NOTE: The pages are "human-friendly" so page 1 = index 0, however with 
            the itemsAreEmbeds feature, the *initial* embed is separate and 
            so in that case the offset is 2.
    */
    const pageIndex = itemsAreEmbeds ? pageCurrent - 2 : pageCurrent - 1

    if (itemsAreEmbeds) {
      responseEmbed = new RichEmbed(
        pageCurrent === 1 ? { ...embed } : { ...items[pageIndex] }
      )

      if (showDetailsInFooter) {
        responseEmbed = _setFooter(responseEmbed, { pageCurrent, pageLast })

        if (pageCurrent > 1) {
          if (items[pageIndex].footer) {
            responseEmbed.footer.text += ` | ${items[pageIndex].footer.text}`
          }
        }
      }
    } else {
      const sliceFrom = (pageCurrent - 1) * itemsPerPage
      const sliceTo = Math.min(pageCurrent * itemsPerPage, items.length)
      const itemsForPage = items.slice(sliceFrom, sliceTo)

      responseEmbed = embed
      responseEmbed.fields = []
      responseEmbed = _addFieldsToEmbed(
        responseEmbed,
        itemsForPage,
        inlineFields
      )
      responseEmbed = _addFieldsToEmbed(responseEmbed, fields, inlineFields)

      if (showDetailsInFooter) {
        responseEmbed = _setFooter(responseEmbed, { pageCurrent, pageLast })
      }
    }

    // NOTE: The API disallows removing reactions in DMs.
    if (channel.type !== 'dm') {
      await reaction.remove(author.id)
    }

    response.edit(EMPTY_MESSAGE, { embed: responseEmbed })
  }
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
function _addFieldsToEmbed(embed, fields, inline) {
  function addField(name, value, inline) {
    if (embed instanceof RichEmbed) {
      embed.addField(name, value, inline)
    } else {
      embed.fields.push({ name, value, inline })
    }

    return embed
  }

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]

    if (
      typeof field === 'object' &&
      typeof field.name !== 'undefined' &&
      typeof field.value !== 'undefined'
    ) {
      addField(
        field.name,
        field.value,
        inline ? true : field.inline ? field.inline : false
      )
    } else {
      /*
        NOTE: It may be desirable to allow choosing between the following two 
              via another option (in addition to inline), at some point?

          embed.addField(EMPTY_MESSAGE, field, inline)
          embed.addField(field, EMPTY_MESSAGE, inline)
      */
      addField(EMPTY_MESSAGE, field, inline)
    }
  }

  return embed
}

/**
 * Adds the user's avatar and a little "$user requested:" above the title.
 *
 * @param {RichEmbed|Object} embed
 * @param {CommandMessage} msg
 * @returns {RichEmbed}
 */
function _setAuthor(embed, msg) {
  const name =
    (msg.member ? msg.member.displayName : msg.author.username) + ' requested:'
  const icon = msg.author.avatarURL

  embed.author = {
    name,
    icon,
  }

  return embed
}

/**
 * Displays the pagination information in the footer.
 *
 * @param {RichEmbed|Object} embed
 * @param {PaginatedEmbedContext} context
 * @returns {RichEmbed}
 */
function _setFooter(embed, { pageCurrent, pageLast }) {
  const footerTemplate = `Page ${pageCurrent} of ${pageLast}`

  embed.footer = {
    text: footerTemplate,
  }

  return embed
}
