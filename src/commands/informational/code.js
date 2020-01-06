import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { cleanupInvocation } from '../../utils/messages'
import { inlineCode } from '../../utils/string'

module.exports = class InfoCodeHighlightingCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      name: 'code',
      group: 'informational',
      examples: [
        inlineCode('!code'),
        inlineCode('!code user'),
        inlineCode('!code @user#1234'),
      ],
      aliases: ['hl', 'highlight', 'highlighting'],
      guildOnly: true,
      memberName: 'code',
      description: 'Show code highlighting tips.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { member } = args

    let sendToChannel
    if (member === 'none') {
      sendToChannel = msg.channel
    } else {
      sendToChannel = await member.createDM()
      let response = await msg.reply(
        `okay, I sent ${member.displayName} a DM about that as requested.`
      )
      cleanupInvocation(response)
    }

    const embedMessage = new RichEmbed()
      .setColor('#42b883')
      .setTitle('Code Highlight Guide')
      .addField('Inline code', '\\`code\\`')
      .addField('Multiline code', '\\`\\`\\`\n// code\n\\`\\`\\`')
      .addField(
        'Multiline code coloring',
        '\\`\\`\\`html\n<template></template>\n<script></script>\n<style></style>\n\\`\\`\\`'
      )
      .setFooter(
        'Note you can use any language name for multiline coloring such as: html, js, css, sql, etc.'
      )

    sendToChannel.send(embedMessage)
  }
}
