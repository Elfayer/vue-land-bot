# **vue-land-bot**

**UPDATE 02/09/2019:** Aimed to be rewritten using [Commando.js](https://discord.js.org/#/docs/commando/master/general/welcome) for easiness of maintainability.

API Doc: https://discord.js.org

Based on guide: https://discordjs.guide/

Not implemented:

- [Setting a command as guild-only](https://discordjs.guide/commando/guild-only.html#setting-a-command-as-guild-only)
- [Cooldowns](https://discordjs.guide/command-handling/adding-features.html#cooldowns)
- [Command aliases](https://discordjs.guide/command-handling/adding-features.html#command-aliases)

# Setup

To make this code work, you'll need to setup your own bot with its own token.
To do so, follow [this steps](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

# How to run?

```sh
# Install dependencies
npm install

# Start bot
npm run serve
```

# FAQ

### When I run `npm run serve`, I get: `UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided`

Make sure you have a `./src/config.json` file with your token properly filled.

To get a default `config.json`, run `npm run init`.

To setup your token, see the [Setup](#Setup) section.