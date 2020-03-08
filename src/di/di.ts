export type ServiceToken = any
export type Service = any
export type CreateServiceFn = (...createdDependencies: Service) => Service
export type CreateServiceFnAsync = (...createdDependencies: Service) => Promise<Service>

export interface RawProvider {
  dependencies?: ServiceToken[],
  create: CreateServiceFn | CreateServiceFnAsync,
}

export type Provider = null | RawProvider

export interface Providers {
  [serviceName: string]: Provider,
}

/**
 * Provider can be:
 *   - null - external (imported) provider
 *   - Provider - local provider
 */
export interface Module {
  name?: string,
  providers: Providers,
  submodules?: Submodule[],
}

export interface Imports {
  [serviceName: string]: string,
}

export type Exports = Imports

export interface Submodule extends Module {
  imports?: Imports,
  exports?: Exports,
}

export interface ProcessedProvider {
  module: ProcessedModule,
  name: string,
  type: 'local' | 'internal' | 'external',
  rawProvider: Provider,
}

export interface ProcessedImports {
  [serviceName: string]: ProcessedProvider,
}

function getProviderType(name: string, mod: Module): 'local' | 'external' | 'internal' {
  const provider = mod.providers[name]
  if (provider instanceof Object) return 'local'
  const isInternal = mod.submodules?.find(submod => submod.exports?.[name])
  if (isInternal) return 'internal'
  return 'external'
}

interface ProcessedModule {
  name: string,
  parentModule: ProcessedModule | null,
  providers: ProcessedProvider[],
  submodules: ProcessedModule[],
  imports: Imports,
  exports: Exports,
}

export function processModuleRecursive(mod: Submodule, parentModule: ProcessedModule | null = null): ProcessedModule {
  const pMod: ProcessedModule = {
    name: mod.name || '<unnamed>',
    parentModule,
    providers: [],
    submodules: [],
    imports: mod.imports || {},
    exports: mod.exports || {},
  }
  pMod.providers = Object.keys(mod.providers)
    .map(name => {
      const rawProvider = mod.providers[name]
      const type = getProviderType(name, mod)
      return {
        module: pMod,
        name,
        type,
        rawProvider,
      }
    })
  pMod.submodules = (mod.submodules || []).map(submod => processModuleRecursive(submod, pMod))
  return pMod
}

export interface ResolvedProvider {
  processedProvider: ProcessedProvider,
  dependencies: ResolvedProvider[],
}

function getFullModName(mod: ProcessedModule): string {
  let fullname = mod.name
  let currMod = mod
  while (currMod.parentModule) {
    currMod = currMod.parentModule
    fullname = currMod.name + '/' + fullname
  }
  return fullname
}

export function resolveProviderRecursive(
  map: Map<ProcessedProvider, ResolvedProvider>,
  mod: ProcessedModule,
  name: string,
  visited: Array<ProcessedProvider> = [],
): ResolvedProvider {
  const errorMsg = `Cannot resolve '${name} @ ${getFullModName(mod)}' provider`
  const prov = mod.providers.find(pr => pr.name === name)
  if (!prov) throw Error(`${errorMsg}, not found in providers list.`)
  const resolved = map.get(prov)
  if (resolved) return resolved
  const isVisited = visited.find(v => v === prov)
  if (isVisited) {
    visited.push(prov)
    const cycle = visited.map(v => `${v.name}@${v.module.name}`).join(' -> ')
    throw Error(`${errorMsg}, cyclic dependency (${cycle}).`)
  }
  visited.push(prov)

  switch (prov.type) {
    case 'external': {
      if (!mod.parentModule) throw Error(`${errorMsg}, external dependency declared in root module.`)
      const nameInParent = mod.imports[name] || name
      const provInParent = mod.parentModule.providers.find(pr => pr.name === nameInParent)
      if (!provInParent) throw Error(`${errorMsg}, external dependency not found in parent module.`)
      const resolved = resolveProviderRecursive(map, mod.parentModule, nameInParent, visited)
      map.set(prov, resolved)
      return resolved
    }
    case 'internal': {
      const childMod = mod.submodules.find(submod => submod.exports[name])
      if (!childMod) throw Error(`${errorMsg}, internal dependency not found in child modules.`)
      const nameInChild = childMod.exports[name]
      const resolved = resolveProviderRecursive(map, childMod, nameInChild, visited)
      map.set(prov, resolved)
      return resolved
    }
    case 'local': {
      const dependencies = ((prov.rawProvider as RawProvider).dependencies || [])
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

export function depsToStr(resProv: ResolvedProvider): string {
  const str = `${resProv.processedProvider.name} from ${resProv.processedProvider.module.name}`
  const depsStr = resProv.dependencies
    .map(dep => depsToStr(dep))
    .join('\n')
  return str + '\n' + depsStr.replace(/^/gm, ' ')
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
) {
  const processedMod = processModuleRecursive(mod)
  const map = resolveModRecursive(processedMod)
  const provs = processedMod.providers.map(pr => map.get(pr)) as ResolvedProvider[]
  return provs
}

/**
 * Assume there are no empty rawProviders in resolved providers.
 */
export async function createSvcRecursive(
  prov: ResolvedProvider,
  svcMap: Map<ResolvedProvider, Service> = new Map,
  depth = 0,
): Promise<Service> {
  const existingSvc = svcMap.get(prov)
  if (existingSvc) {
    console.log(' '.repeat(depth) + `Initializing service ${prov.processedProvider.name}@${getFullModName(prov.processedProvider.module)} (reused existing).`)
    return existingSvc
  }
  console.log(' '.repeat(depth) + `Initializing service ${prov.processedProvider.name}@${getFullModName(prov.processedProvider.module)}.`)
  const depSvcs: Service[] = []
  for (const dep of prov.dependencies) {
    const depSvc = await createSvcRecursive(dep, svcMap, depth + 1)
    depSvcs.push(depSvc)
  }
  try {
    const svc = await (prov.processedProvider.rawProvider as RawProvider).create(...depSvcs)
    svcMap.set(prov, svc)
    return svc
  }
  catch (err) {
    console.log(`Error during initialization of ${prov.processedProvider.name} @ ${getFullModName(prov.processedProvider.module)}.`)
    throw err
  }
}

export interface InitializedModule {
  services: {
    [svcName: string]: Service,
  },
}

export async function initModule(mod: Module): Promise<InitializedModule> {
  console.log('Module initialization.')
  const provs = resolveModule(mod) // Assume that resolveModule returns only root module providers
  const svcMap = new Map
  const services = {}
  for (const pr of provs) {
    try {
      const svc = await createSvcRecursive(pr, svcMap)
      services[pr.processedProvider.name] = svc
    }
    catch (err) {
      console.log(`Error during module initialization.`)
      throw err
    }
  }
  console.log('Module initialized successfully.')
  return { services }
}
