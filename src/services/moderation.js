import { resolve, join } from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { DATA_DIR } from '../utils/constants'

const adapter = new FileSync(join(resolve(DATA_DIR), 'moderation', 'db.json'))
const db = low(adapter)

db.defaults({
  triggers: [
    {
      trigger: 'amazingsexdating.com',
      action: 'notify',
    },
    {
      trigger: 'viewc.site',
      action: 'notify',
    },
    {
      trigger: 'nakedphoto.club',
      action: 'notify',
    },
    {
      trigger: 'privatepage.vip',
      action: 'notify',
    },
  ],
}).write()

export default db
