import { Command } from "discord.js-commando"

const links = [{
  name: 'vue',
  aliases: ['home', 'vuejs'],
  value: 'https://vuejs.org/'
}, {
  name: 'get-started',
  aliases: ['start', 'intro', 'introduction'],
  value: 'https://vuejs.org/v2/guide/'
}, {
  name: 'installation',
  value: 'https://vuejs.org/v2/guide/installation.html'
}, {
  name: 'class',
  aliases: ['classes'],
  value: 'https://vuejs.org/v2/guide/class-and-style.html#Binding-HTML-Classes'
}, {
  name: 'style',
  aliases: ['styles'],
  value: 'https://vuejs.org/v2/guide/class-and-style.html#Binding-Inline-Styles'
}, {
  name: 'component',
  aliases: ['components'],
  value: 'https://vuejs.org/v2/guide/components.html'
}, {
  name: 'slot',
  aliases: ['slots'],
  value: 'https://vuejs.org/v2/guide/components-slots.html'
}, {
  name: 'prop',
  aliases: ['props'],
  value: 'https://vuejs.org/v2/guide/components-props.html'
}, {
  name: 'event',
  aliases: ['events'],
  value: 'https://vuejs.org/v2/guide/components-custom-events.html'
}, {
  name: 'registration',
  value: 'https://vuejs.org/v2/guide/components-registration.html'
}, {
  name: 'transition',
  aliases: ['transitions'],
  value: 'https://vuejs.org/v2/guide/transitions.html'
}, {
  name: 'mixin',
  aliases: ['mixins'],
  value: 'https://vuejs.org/v2/guide/mixins.html'
}, {
  name: 'directive',
  aliases: ['directives', 'custom-directive', 'custom-directives'],
  value: 'https://vuejs.org/v2/guide/custom-directive.html'
}, {
  name: 'render',
  aliases: ['render-function', 'render-functions'],
  value: 'https://vuejs.org/v2/guide/render-function.html'
}, {
  name: 'lifecycle',
  aliases: ['cycle', 'lifecycles', 'lifecycle-hooks'],
  value: 'https://vuejs.org/v2/api/#Options-Lifecycle-Hooks'
}, {
  name: 'lifecycle-diagram',
  aliases: ['cycle-diag', 'cycle-diagram', 'life-cycle-diagram'],
  value: 'https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram'
}, {
  name: 'cookbook',
  aliases: ['cook'],
  value: 'https://vuejs.org/v2/cookbook/'
}, {
  name: 'style-guide',
  aliases: ['guide'],
  value: 'https://vuejs.org/v2/style-guide/'
}, {
  name: 'example',
  aliases: ['examples'],
  value: 'https://vuejs.org/v2/examples/'
}, {
  name: 'prop-event',
  aliases: ['props-events'],
  value: 'https://vuejs.org/images/props-events.png'
}]

export default class DocsVueCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: "keyword",
          type: "string",
          prompt: "keyword to search for?"
        }
      ],
      name: 'docs',
      group: 'docs',
      aliases: ['d'],
      guildOnly: false,
      memberName: 'docs-docs',
      description: 'Match a keyword with a documentation link.'
    })
  }

  hasPermission(msg) {
    return true
  }

  async run(msg, args) {
    const { keyword } = args
    const found = links.find(
      link => link.name === keyword ||
      (link.aliases && link.aliases.some(alias => alias === keyword))
    )

    if (!found) {
      const linksName = links.map(link => link.name).join(', ')
      message.channel.send(`Documentation not found. Try: ${linksName}`)
    } else {
      message.channel.send(found.value)
    }
  }
}
