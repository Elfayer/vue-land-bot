import {
  RichDisplay,
  RichDisplayEmojisObject,
  Extendable,
  ExtendableStore,
} from 'klasa'

export default class extends Extendable {
  constructor(store: ExtendableStore, file: string[], directory: string) {
    super(store, file, directory, { appliesTo: [RichDisplay] })
  }

  /**
   * Override the default RichDisplay emojis with our own variants.
   */
  /*
    WARNING: If the bot is not part of the Vue Land Bot Testing
    guild then this will fail - how should we handle this?
  */
  get emojis(): RichDisplayEmojisObject {
    return {
      first: '661289441171865660',
      back: '661289441184317441',
      forward: '661289441674919946',
      last: '661289441218002984',
      jump: '668947609100222468',
      info: '668947609209143317',
      stop: '668947609066536980',
    }
  }

  set emojis(value) {}
}
