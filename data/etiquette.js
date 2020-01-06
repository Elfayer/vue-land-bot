import { oneLine, stripIndent } from 'common-tags'

export default [
  {
    title: 'Pinging',
    description: stripIndent`
      You don't need to \`@\` someone who responded to you after every message, they'll see your responses and respond when they can.

      Additionally, please don't ping people when asking your question (unless you're sure they are the **only** person who can help).
    `,
  },
  {
    title: 'Ambiguity',
    description: stripIndent`
      Try not to make your question super vague / broad.
      
      If you can, narrow it down to just one main thing that you're struggling with rather than "Can you help me integrate X with Y".

      It will be easier for people to help.
    `,
  },
  {
    title: 'Cross-posting',
    description: stripIndent`
      Please don't post the same question in multiple channels quickly in succession, see \`!dry\`.
    `,
  },
  {
    title: 'Volunteers',
    description: stripIndent`
      Remember that everyone here is a volunteer - they aren't getting paid to help you.
    `,
  },
  {
    title: 'DMs',
    description: stripIndent`
      Please do not DM (private message) people soliciting help without first asking their permission.
    `,
  },
  {
    title: 'Formatting',
    description: stripIndent`
      Please use proper code formatting when sharing code snippets, see \`!code\`.
    `,
  },
  {
    title: 'Sharing',
    description: stripIndent`
      If possible, provide a reproduction of the issue, see \`!sharing\`.

      It'll be much easier to help if you do!
    `,
  },
]
