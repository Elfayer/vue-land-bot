export default class Job {
  constructor(client, options = {}) {
    this.client = client;

    if ( ! options.name) {
      throw new Error("Job lacks required option - name.")
    }

    this.name = options.name;
    this.enabled = options.enabled || true;
  }
}