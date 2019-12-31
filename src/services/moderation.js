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
      action: 'ban',
    },
    {
      trigger: 'viewc.site',
      action: 'ban',
    },
    {
      trigger: 'nakedphoto.club',
      action: 'ban',
    },
    {
      trigger: 'privatepage.vip',
      action: 'ban',
    },
  ],
}).write()

export default db
