import { Task, TaskStore, TaskOptions } from 'klasa'

/**
 * The RFCRefreshTask is responsible for refreshing the RFCs from the Github API.
 */
export default class RFCRefreshTask extends Task {
  constructor(
    store: TaskStore,
    file: string[],
    directory: string,
    options?: TaskOptions
  ) {
    super(store, file, directory, {
      name: 'RFCRefreshTask',
      enabled: true,
    })
  }

  async run(metadata: any) {}

  async init() {}
}
