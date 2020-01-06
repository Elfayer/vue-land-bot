import { stripIndent } from 'common-tags'

export default [
  {
    title: 'JSFiddle',
    description: stripIndent`
      JSFiddle is a great choice for sharing a problem or showing off a demo, so long as you aren't using \`vue-cli\`.

      Features:
        - Add dependencies from CDNJS (but not from NPM)
        - Supports HTML, Haml
        - Supports Babel, TypeScript, CoffeeScript etc.
        - Supports SASS/SCSS and PostCSS
        - Collaboration features (code/debug together)
    `,
    url: 'https://jsfiddle.net/boilerplate/vue',
  },
  {
    title: 'CodeSandbox',
    description: stripIndent`
      You can think of CodeSandbox like VS Code but in the browser, it's more of an IDE than a code-sharing site.

      It's the best choice for when your site is using \`vue-cli\`.

      Features:
        - Entire Node ecosystem at your fingerprints (NPM support)
        - Supports anything there's an NPM package for
        - Importing from Github (synchronise your project to a sandbox)
        - Uploading arbitrary files
        - Collaboration features (code/debug together)
    `,
    url: 'https://codesandbox.io/s/vue',
  },
  {
    title: 'CodePen',
    description: stripIndent`
      CodePen is another option that is most similar to JSFiddle.

      It's most often use for demos/showcases relating to vanilla HTML/CSS/JS but you can use it with Vue if you want.

      Features:
        - Add dependencies from CDNJS (but not from NPM)
        - Supports HTML, Haml, Markdown, Pug etc.
        - Supports Less, SASS/SCSS, Stylus etc.
        - Supports Babel, TypeScript, CoffeeScript etc.
        - Collaboration features, live view (requires pro).
        - Uploading arbitrary files (requires a project, limited for non-pro)
    `,
    url: 'https://codepen.io/',
  },
  {
    title: 'Gist',
    description: stripIndent`
      If you don't need any of that and just want to share some code that won't fit on Discord then perhaps Gist is your best option.

      Features:
        - Forking, revisions (every gist is a git repository)
        - Comments
        - Multiple files
    `,
    url: 'https://gist.github.com/',
  },
]
