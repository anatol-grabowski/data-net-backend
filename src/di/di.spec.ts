import { processModuleRecursive, resolveModule, resolveProviderRecursive, depsToStr, initModule } from './di'
import { MainModule } from '../modules/main'

console.log(JSON.stringify(MainModule, null, 2))

const res = resolveModule(MainModule)
console.log(res)
console.log(res.map(r => depsToStr(r)).join('\n'))


initModule(MainModule)
