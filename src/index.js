import client from './client.js'

const { BOT_TOKEN } = process.env

if (!BOT_TOKEN) {
  console.error(
    'The environmental variable BOT_TOKEN is required but was not present!'
  )
  process.exit()
}

try {
  client.login(BOT_TOKEN)
} catch (e) {
  console.error(
    'The provided BOT_TOKEN environmental variable could not be used to login!'
  )
  console.error(e)
  process.exit(1)
}
