import { initModule } from './di'
import { MainModule } from './modules/main.module'

async function start() {
  const mod = await initModule(MainModule, { doLog: true })
  console.log(mod)
}

exports.start = start
