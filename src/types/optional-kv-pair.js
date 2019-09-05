import { ArgumentType } from 'discord.js-commando'

/**
 * Represents an optional key-value pair. Useful for commands where you
 * would like to allow both a shorthand form + longer disambiguation form:
 *
 * !rfc some title       -> ['empty', 'some title']
 * !rfc title:some title -> ['title', 'some title']
 */
module.exports = class OptionalKeyValuePairArgumentType extends ArgumentType {
  constructor(client, id = 'optional-kv-pair') {
    super(client, id)
  }

  parse(val) {
    let k = 'empty'
    let v = val

    if (val.includes(':')) {
      ;[k, v] = val.split(':').map(part => part.trim())
    } else if (val.indexOf('#') === 0) {
      k = 'id'
      v = val.substr(1)
    }

    return [k, v]
  }
}
