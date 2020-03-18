import {
  Module,
  ProcessedModule,
  ProcessedProvider,
  LocalProvider,
  ImportedProvider,
  UsedProvider,
  processModuleRecursive,
} from './process-module'

import {
  getFullModName,
  getModPath,
} from './utils'

import * as Debug from 'debug'
const debug = Debug('di:resolve')

export interface ResolvedProvider {
  processedProvider: ProcessedProvider,
  dependencies: ResolvedProvider[],
}

export function resolveProviderRecursive(
  map: Map<ProcessedProvider, ResolvedProvider>,
  mod: ProcessedModule,
  name: string,
  visited: Array<ProcessedProvider> = [],
): ResolvedProvider {
  debug(`${' '.repeat(visited.length)}resolve '${name}' @ '${getModPath(mod)}'`)
  const errorMsg = `Cannot resolve '${name} @ ${getFullModName(mod)}' provider`
  const prov = mod.providers.find(pr => pr.name === name)
  if (!prov) throw Error(`${errorMsg}, not found in providers list.`)
  const resolved = map.get(prov)
  if (resolved) return resolved
  const isVisited = visited.find(v => v === prov)
  if (isVisited) {
    visited.push(prov)
    const cycle = visited.map(v => `${v.name}@${v.module.rawModule.name}`).join(' -> ')
    throw Error(`${errorMsg}, cyclic dependency (${cycle}).`)
  }
  visited.push(prov)

  switch (prov.type) {
    case 'external': {
      const importName = (prov.rawProvider as ImportedProvider).importName || prov.name
      const parentMod = mod.parentModule
      if (!parentMod) throw Error(`${errorMsg}, external dependency declared in root module.`)
      const nameInParent = mod.imports[importName]
      if (!nameInParent) throw Error('nameInParent')
      const resolved = resolveProviderRecursive(map, parentMod, nameInParent, visited)
      map.set(prov, resolved)
      return resolved
    }
    case 'internal': {
      const importFrom = (prov.rawProvider as UsedProvider).importFrom
      const importName = (prov.rawProvider as UsedProvider).importName || prov.name
      const childMod = mod.submodules.find(submod => submod.nameInParent === importFrom)
      if (!childMod) throw Error(`${errorMsg}, submodule ${importFrom} not found.`)
      const nameInChild = childMod.exports[importName]
      if (!nameInChild) throw Error('nameInChild')
      const resolved = resolveProviderRecursive(map, childMod, nameInChild, visited)
      map.set(prov, resolved)
      return resolved
    }
    case 'local': {
      const dependencies = ((prov.rawProvider as LocalProvider).dependencies || [])
        .map(dep => resolveProviderRecursive(map, mod, dep, visited))
      const resolved: ResolvedProvider = map.get(prov) || {
        processedProvider: prov,
        dependencies,
      }
      map.set(prov, resolved)
      return resolved
    }
  }
}
function resolveModRecursive(
  mod: ProcessedModule,
  map: Map<ProcessedProvider, ResolvedProvider> = new Map,
): Map<ProcessedProvider, ResolvedProvider> {
  for (const prov of mod.providers) {
    resolveProviderRecursive(map, mod, prov.name)
  }
  for (const submod of mod.submodules) {
    resolveModRecursive(submod, map)
  }
  return map
}

export function resolveModule(
  mod: Module,
): ResolvedProvider[] {
  const processedMod = processModuleRecursive(mod)
  const map = resolveModRecursive(processedMod)

  const provs = processedMod.providers.map(pr => {
    const resolvedProvider = map.get(pr)
    if (!resolvedProvider) throw Error('provider unresolved') // should never get here
    return resolvedProvider
  })
  return provs
}
