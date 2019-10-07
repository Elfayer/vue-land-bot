import client from '../client'

/*
  Delete a message safely, if possible.

  Safely means without risking permission errors.
*/
export function tryDelete(msg, delay = 0) {
  console.debug(`Attempting to delete msg #${msg.id}.`)

  if (msg.channel.type === 'dm') {
    if (msg.author.id !== msg.client.user.id) {
      console.debug('Cannot delete - is DM.')
      return false
    }
  } else {
    if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
      console.debug('Cannot delete - lacking permissions.')
      return false
    }

    if (msg.member.hasPermission('ADMINISTRATOR')) {
      if (!msg.guild.me.hasPermission('ADMINISTRATOR')) {
        console.debug('Cannot delete - user is admin but I am not.')
      }
    }
  }

  return msg.delete(delay)
}

/*
  Try to send a message to a channel by id or name if it exists.
*/
export function trySend(channelResolvable, message, embed = {}) {
  let channel

  if (channelResolvable.name) {
    channel = client.channels.find(
      channel => channel.name === channelResolvable.name
    )

    if (!channel) {
      return
    }
  } else {
    if (!channelResolvable.id) {
      channelResolvable = { id: channelResolvable }
    }

    channel = client.channels.get(channelResolvable.id)

    if (!channel) {
      return
    }
  }

  channel.send(message, embed)
}

/*
  Remove emojis from a string.
*/
export function stripEmojis(str) {
  return str.replace(
    /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g,
    ''
  )
}
