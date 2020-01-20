import 'module-alias/register'
import VueClient from '@libraries/VueClient'
import CLIENT_OPTIONS from './vuebot.config'

const { BOT_TOKEN } = process.env

new VueClient(CLIENT_OPTIONS).login(BOT_TOKEN)
