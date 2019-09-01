import client from './client.js'

const {
  BOT_TOKEN,
} = process.env

client.login(BOT_TOKEN)
