import { resolve, join } from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { DATA_DIR } from '../utils/constants'

const adapter = new FileSync(join(resolve(DATA_DIR), 'tasks', 'db.json'))
const db = low(adapter)

export function isEmpty() {
  return !db.has('tasks').value()
}

export function setDefaults(tasks) {
  if (!isEmpty()) {
    return !!console.info('Skipping setting defaults - config file exists.')
  }
  db.defaults({
    tasks: [...tasks],
  }).write()
}

export default db
