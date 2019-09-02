import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'

module.exports = class MiscCodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'code',
      group: 'miscellaneous',
      aliases: ['hl', 'highlight', 'highlighting'],
      guildOnly: false,
      memberName: 'code',
      description: 'Show code highlighting tips.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg) {
    /*
      TODO: Extract fields and build dynamically? Makes for easier reading + modification.
    */
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

    msg.channel.send(embedMessage)
  }
}
