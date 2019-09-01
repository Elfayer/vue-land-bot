const Discord = require('discord.js')

module.exports = {
  name: 'code',
  description: 'Show code highlight tips',
  args: false,
  isAvailable: true,
  execute (message) {
    const embedMessage = new Discord.RichEmbed()
      .setColor('#42b883')
      .setTitle('Code highlight guide')
      .addField('Inline code', '\\`code\\`')
      .addField('Multiline code', '\\`\\`\\`\n// code\n\\`\\`\\`')
      .addField('Multiline code coloring', '\\`\\`\\`html\n<template></template>\n<script></script>\n<style></style>\n\\`\\`\\`')
      .setFooter('Note you can use any language name for multiline coloring such as: html, js, css, sql, etc.')

    message.channel.send(embedMessage)
  }
}
