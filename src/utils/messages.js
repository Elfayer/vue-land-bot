/*
  Delete a message safely, if possible.

  Safely means without risking permission errors.
*/
export function tryDelete(msg, delay = 0) {
  console.debug(`Attempting to delete msg #${msg.id}.`)

  if (msg.channel.type === 'dm' && msg.author.id !== msg.client.user.id) {
    console.debug('Cannot delete - is DM.')
    return false
  }

  if (!msg.guild.me.hasPermission('MANAGE_MESSAGES')) {
    console.debug('Cannot delete - lacking permissions.')
    return false
  }

  if (msg.member.hasPermission('ADMINISTRATOR')) {
    if (!msg.guild.me.hasPermission('ADMINISTRATOR')) {
      console.debug('Cannot delete - user is admin but I am not.')
    }
  }

  msg.delete(delay)
  return true
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
