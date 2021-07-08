import { resolve, join } from 'path'
import { unlinkSync } from 'fs'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { DATA_DIR } from '../utils/constants'

const DATABASE_PATH = join(resolve(DATA_DIR), 'tasks', 'db.json')
const adapter = new FileSync(DATABASE_PATH)
const db = low(adapter)

/**
 * Check if the DB is empty.
 *
 * @returns {boolean}
 */
export function isEmpty() {
  return !db.has('tasks').value()
}

/**
 * Reset the DB to the default values in the task classes.
 *
 * @param {Task[]} tasks
 */
export function reset(tasks) {
  unlinkSync(DATABASE_PATH)
  write(tasks)

  for (const task of tasks) {
    task.readConfig()
  }
}

/**
 * Write the tasks to disc, but only if the DB is empty.
 *
 * @param {Task[]} tasks
 */
export function setDefaults(tasks) {
  if (!isEmpty()) {
    return !!console.info(
      'Skipping setting default tasks - data/tasks/db.json exists.'
    )
  }

  write(tasks)
}

/**
 * Write the tasks to disc.
 *
 * @param {Task[]} tasks
 */
export function write(tasks) {
  tasks = tasks.map(task => task.toJSON())

  db.defaults({
    tasks: [...tasks],
  }).write()
}

export default db
