import {
  Service,
  Module,
  LocalProvider,
} from './process-module'
import {
  getFullModName,
  getModPath,
} from './utils'
import {
  ResolvedProvider,
  resolveModule,
} from './resolve-module'
export { Module } from './process-module'

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
    console.log(' '.repeat(depth) + `Initializing service '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}' (reused existing).`)
    return existingSvc
  }
  console.log(' '.repeat(depth) + `Initializing service '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}'.`)
  const depSvcs: Service[] = []
  for (const dep of prov.dependencies) {
    const depSvc = await createSvcRecursive(dep, svcMap, depth + 1)
    depSvcs.push(depSvc)
  }
  try {
    const svc = await (prov.processedProvider.rawProvider as LocalProvider).create(...depSvcs)
    svcMap.set(prov, svc)
    return svc
  }
  catch (err) {
    console.log(`Error during initialization of '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}'.`)
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
  console.log('Module initialized ok.')
  return { services }
}
