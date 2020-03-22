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
import * as Debug from 'debug'

const debug = Debug('di')

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
    debug(' '.repeat(depth) + `Initializing service '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}' (reused existing).`)
    return existingSvc
  }
  debug(' '.repeat(depth) + `Initializing service '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}'.`)
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
    debug(`Error during initialization of '${prov.processedProvider.name} @ ${getModPath(prov.processedProvider.module)}'.`)
    throw err
  }
}

export interface InitializedModule {
  services: {
    [svcName: string]: Service,
  },
}

export interface Options {
  doLog: boolean,
}

export async function initModule(mod: Module, options: Options = { doLog: false } ): Promise<InitializedModule> {
  if (options.doLog) {
    debug.enabled = true
  }
  debug('Module initialization.')
  const provs = resolveModule(mod) // Assume that resolveModule returns only root module providers
  const svcMap = new Map
  const services = {}
  for (const pr of provs) {
    try {
      const svc = await createSvcRecursive(pr, svcMap)
      services[pr.processedProvider.name] = svc
    }
    catch (err) {
      debug(`Error during module initialization.`)
      throw err
    }
  }
  debug('Module initialized ok.')
  return { services }
}
