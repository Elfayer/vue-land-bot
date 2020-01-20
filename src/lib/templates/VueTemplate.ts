import { MessageEmbed } from 'discord.js'
import { util, KlasaMessage } from 'klasa'

const SIDEBAR_COLOUR = '#42b883'

/**
 * @param title An optional title.
 * @param addLogo Add the Vue logo to the embed?
 * @param addAuthor Add the author name and avatar to the embed?
 */
interface VueTemplateOptions {
  title?: string
  addLogo?: boolean
  addAuthor?: boolean
}

/**
 * The default options for {@link createVueTemplate}.
 */
const DEFAULT_OPTIONS: VueTemplateOptions = {
  addAuthor: true,
  addLogo: true,
}

/**
 * Create a Vue-branded embed.
 *
 * @param options The {@link VueTemplateOptions}.
 * @param message The message containing the author, if `addAuthor` is `true`.
 */
export default function createVueTemplate(
  message: KlasaMessage,
  options?: VueTemplateOptions
): MessageEmbed {
  options = util.mergeDefault(DEFAULT_OPTIONS, options)

  const embed = new MessageEmbed().setColor(SIDEBAR_COLOUR)

  if (options.title) {
    embed.setTitle(options.title)
  }

  if (options.addLogo) {
    embed.setThumbnail('attachment://vue.png').attachFiles([
      {
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      },
    ])
  }

  if (options.addAuthor && message?.member) {
    embed.setAuthor(
      `${message?.member.displayName} requested:`,
      message.author.avatarURL()
    )
  }

  return embed
}
