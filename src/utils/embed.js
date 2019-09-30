import { RichEmbed } from 'discord.js'

export const DEFAULT_EMBED_COLOUR = '#42b883'

export function embedMessage(title, description) {
  return new RichEmbed()
    .setColor(DEFAULT_EMBED_COLOUR)
    .setTitle(title)
    .setDescription(description)
}
