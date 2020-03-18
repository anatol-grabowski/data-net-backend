import { ProcessedModule } from './process-module'
import { ResolvedProvider } from './resolve-module'

export function getFullModName(mod: ProcessedModule): string {
  let fullname = mod.rawModule.name || '<unnamed>'
  let currMod = mod
  while (currMod.parentModule) {
    currMod = currMod.parentModule
    fullname = currMod.rawModule.name + '/' + fullname
  }
  return fullname
}

export function depsToStr(resProv: ResolvedProvider): string {
  const str = `${resProv.processedProvider.name} from ${resProv.processedProvider.module.rawModule.name || '<unnamed>'}`
  const depsStr = resProv.dependencies
    .map(dep => depsToStr(dep))
    .join('\n')
  return str + '\n' + depsStr.replace(/^/gm, ' ')
}

export function getModPath(mod: ProcessedModule): string {
  if (!mod.parentModule) return 'Root'
  return getModPath(mod.parentModule) + '/' + mod.nameInParent
}

