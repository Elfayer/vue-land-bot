import { resolve } from 'path'

import { KlasaClientOptions } from 'klasa'
import { oneLine } from 'common-tags'

import { DEV, NAME, PREFIX, VERSION, LANGUAGE } from '@libraries/constants'

/**
 * The options that will be passed to the {@link VueClient},
 * which will be forwared on to the {@link KlasaClient}.
 */
const OPTIONS: KlasaClientOptions = {
  commandEditing: true,
  commandLogging: true,
  console: {
    colors: {
      debug: {
        message: { background: null, text: null, style: null },
        time: { background: null, text: 'magenta', style: null },
      },
      error: {
        message: { background: null, text: null, style: null },
        time: { background: 'red', text: 'white', style: null },
      },
      info: {
        message: { background: null, text: 'gray', style: null },
        time: { background: null, text: 'lightyellow', style: null },
      },
      log: {
        message: { background: null, text: null, style: null },
        time: { background: null, text: 'lightblue', style: null },
      },
      verbose: {
        message: { background: null, text: 'gray', style: null },
        time: { background: null, text: 'gray', style: null },
      },
      warn: {
        message: { background: null, text: 'lightyellow', style: null },
        time: { background: null, text: 'lightyellow', style: null },
      },
      wtf: {
        message: { background: null, text: 'red', style: null },
        time: { background: 'red', text: 'white', style: null },
      },
    },
    useColor: true,
    utc: true,
  },
  consoleEvents: { verbose: DEV, debug: DEV },
  language: LANGUAGE,
  pieceDefaults: {
    commands: {
      deletable: true,
      quotedStringSupport: true,
      flagSupport: true,
      usageDelim: ' ',
    },
    services: {
      enabled: true,
    },
  },
  prefix: PREFIX,
  presence: { activity: { name: `${PREFIX}help`, type: 'LISTENING' } },
  production: !DEV,
  providers: {
    default: 'json',
    json: {
      baseDirectory: resolve(__dirname, '..', 'data', 'providers', 'json'),
    },
  },
  readyMessage: client =>
    oneLine`
      ${NAME} ${VERSION} ready!
      [${client.user!.tag}]
      [${client.guilds.size} [G]]
      [${client.guilds
        .reduce((sum, guild) => sum + guild.memberCount, 0)
        .toLocaleString()} [U]].
    `,
  schedule: { interval: 10000 },
  slowmode: 1000,
  slowmodeAggressive: true,
}

export default OPTIONS
