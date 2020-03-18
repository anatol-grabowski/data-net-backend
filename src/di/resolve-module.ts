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

function mapSet(map: Map<ProcessedProvider, ResolvedProvider>, prov: ProcessedProvider, resolved: ResolvedProvider): ResolvedProvider {
  for (const mapped of map.values()) {
    if (mapped === resolved) {
      map.set(prov, resolved)
      return resolved
    }
    if (mapped.processedProvider.rawProvider !== resolved.processedProvider.rawProvider) continue
    if (mapped.dependencies.length !== resolved.dependencies.length) continue
    const doDepsMatch = mapped.dependencies.every((dep, i) => dep === resolved.dependencies[i])
    if (!doDepsMatch) continue
    debug(`Provider ${resolved.processedProvider.name} @ ${getModPath(resolved.processedProvider.module)} uses the same dependencies as @ ${getModPath(mapped.processedProvider.module)} (reused)`)
    map.set(prov, mapped)
    return mapped
  }
  map.set(prov, resolved)
  return resolved
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
      return mapSet(map, prov, resolved)
    }
    case 'internal': {
      const importFrom = (prov.rawProvider as UsedProvider).importFrom
      const importName = (prov.rawProvider as UsedProvider).importName || prov.name
      const childMod = mod.submodules.find(submod => submod.nameInParent === importFrom)
      if (!childMod) throw Error(`${errorMsg}, submodule ${importFrom} not found.`)
      const nameInChild = childMod.exports[importName]
      if (!nameInChild) throw Error('nameInChild')
      const resolved = resolveProviderRecursive(map, childMod, nameInChild, visited)
      return mapSet(map, prov, resolved)
    }
    case 'local': {
      const dependencies = ((prov.rawProvider as LocalProvider).dependencies || [])
        .map(dep => resolveProviderRecursive(map, mod, dep, visited))
      const resolved: ResolvedProvider = map.get(prov) || {
        processedProvider: prov,
        dependencies,
      }
      return mapSet(map, prov, resolved)
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
