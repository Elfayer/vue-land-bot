import client from '../client'
import {
  AUTOMATICALLY_DELETE_ERRORS,
  AUTOMATICALLY_DELETE_INVOCATIONS,
  DELETE_ERRORS_AFTER_MS,
  DELETE_INVOCATIONS_AFTER_MS,
} from './constants'
import { CommandMessage } from 'discord.js-commando'

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

/**
 * Check if we should remove a command invocation (the message that triggered a command)
 * and if so then remove said message.
 *
 * @param {CommandMessage} msg The message containing the command invocation.
 */
export function cleanupInvocation(msg) {
  if (!AUTOMATICALLY_DELETE_INVOCATIONS) {
    return
  }

  return tryDelete(msg, DELETE_INVOCATIONS_AFTER_MS)
}

/**
 * Check if we should remove an error response (a message sent in response to a command invocation,
 * that specifies that some kind of error occured) and if so then remove said response.
 *
 * @param {CommandMessage} msg The message containing the error response.
 */
export function cleanupErrorResponse(msg) {
  if (!AUTOMATICALLY_DELETE_ERRORS) {
    return
  }

  return tryDelete(msg, DELETE_ERRORS_AFTER_MS)
}
