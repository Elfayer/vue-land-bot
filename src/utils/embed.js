const Discord = require('discord.js')

function embedMessage (title, description) {
  return new Discord.RichEmbed()
    .setColor('#42b883')
    .setTitle(title)
    .setDescription(description)
}

module.exports = {
  embedMessage
}
