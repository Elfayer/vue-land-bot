# **vue-land-bot**

This is the official bot for the Vue Land Discord server.

It's written in JS and built on [Discord.js](https://github.com/discordjs/discord.js/) and [Commando](https://github.com/discordjs/Commando).

# Changelog

You will find the changelog [here](https://github.com/Elfayer/vue-land-bot/blob/master/CHANGELOG.md#changelog)

# Table of Contents

- [Requirements](#requirements)
- [Set up the bot](#setup)
  - [Necessary steps](#necessary-steps)
    - [Install dependencies](#install-dependencies)
    - [Create Discord app and bot](#create-discord-application-and-bot-user)
    - [Create the `.env` file](#create-the-.env-file)
    - [Add Discord token to `.env` file](#add-discord-token-to-.env-file)
  - [Optional steps](#optional-steps)
    - [Configure role and user IDs](#configure-role-and-user-ids)
- [Run the bot](#running)
- [FAQ](#faq)
- [Contributors](#contributors)

# Requirements

- Node 10+ is required for the experimental promise-based file system API.

# Setup

## Necessary steps

### Install dependencies

As always:

```bash
npm install
```

### Create Discord application and bot user

Before you can run vue-land-bot, you'll need to setup a Discord Application and attach a bot user to it.

Once you're done, copy the bot token to your clipboard.

If you're not sure what to do you can [follow this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

### Create the `.env` file

You'll need to copy `.env.example` to `.env`.

On \*nix/bsd you can run this command:

```bash
cp .env.example .env
```

### Add Discord token to `.env` file

Next you need to add the bot token to the `.env` file (as `DISCORD_TOKEN`).

> **IMPORTANT:** You should treate the Discord bot token like a password - keep it safe! Especially if you plan on giving it permissions like `ADMINISTRATOR`!

[Back to top](#vue-land-bot)

## Optional steps

<!--
### Create Github personal access token

If you want the RFCs command group to work then you'll need to create a [Github personal access token](https://github.com/settings/tokens) and add it to the `.env` file (as `GITHUB_TOKEN`).

You don't _need_ to give it any scopes.

> **IMPORTANT:** You should treate the Github personal access token like a password - keep it safe! Especially if you add any scopes!
-->

### Configure role and user IDs

While not necessary per se, it's recommended to check out `src/constants/development.js` and `src/constants/production.js`.

The relevant file is included based on the `NODE_ENV` environmental variable.

These files contain various [Snowflakes](https://discordapp.com/developers/docs/reference#snowflakes) (basically IDs) for users and roles.

[Back to top](#vue-land-bot)

# Running

To run the bot simply run:

```bash
npm run serve
```

[Back to top](#vue-land-bot)

# FAQ

## When I run `npm run serve` I get an error

### "The environmental variable BOT_TOKEN is required but was not present!"

Please read the [necessary steps](#necessary-steps) section of the README.

### Error: Incorrect login details were provided.

Ensure you copy-pasted the token correctly. Perhaps you accidentally added a space, for instance?

[Back to top](#vue-land-bot)

# Contributors

- Lead Developer / Maintainer
  - [Elfayer](https://github.com/elfayer/), Hong Kong
- Contributors
  - [sustained](https://github.com/sustained/), United Kingdom
- Ideas, Feedback & Testing
  - [gusto](https://github.com/gustojs/), Poland
  - [laquasicinque](https://github.com/laquasicinque) United Kingdom

[Back to top](#vue-land-bot)
