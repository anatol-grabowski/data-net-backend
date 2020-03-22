import * as Debug from 'debug'
export type ServiceToken = any
export type Service = any
export type CreateServiceFn = (...createdDependencies: Service) => Service
export type CreateServiceFnAsync = (...createdDependencies: Service) => Promise<Service>

const debug = Debug('di:preprocess')

interface ExportableProvider {
  doExport?: boolean,
  exportName?: string,
}

export interface LocalProvider extends ExportableProvider {
  dependencies?: ServiceToken[],
  create: CreateServiceFn | CreateServiceFnAsync,
}

export interface UsedProvider extends ExportableProvider {
  importFrom: string,
  importName?: string,
}

export interface ImportedProvider {
  importFrom: null,
  importName?: string,
}

export type Provider = LocalProvider | UsedProvider | ImportedProvider

export interface Providers {
  [serviceName: string]: Provider,
}

export interface Submodules {
  [moduleName: string]: {
    module: Module,
    imports?: Imports,
  },
}

export interface Module {
  providers: Providers,
  submodules?: Submodules,
}

export interface Imports {
  [serviceName: string]: string,
}

export type Exports = Imports

export interface ProcessedProvider {
  module: ProcessedModule,
  name: string,
  type: 'local' | 'internal' | 'external',
  rawProvider: Provider,
}

export interface ProcessedModule {
  rawModule: Module,
  imports: Imports,
  exports: Exports,
  parentModule?: ProcessedModule,
  nameInParent?: string,
  providers: ProcessedProvider[],
  submodules: ProcessedModule[],
}

function getProviderType(provider: Provider): 'local' | 'external' | 'internal' {
  if ((provider as UsedProvider | ImportedProvider).importFrom === undefined) return 'local'
  if ((provider as UsedProvider | ImportedProvider).importFrom === null) return 'external'
  return 'internal'
}

function getModNameInParent(mod: Module, parentModule: Module): string {
  const submods = parentModule.submodules
  if (!submods) throw Error('err')
  const nameInParent = Object.keys(submods)
    .find(submodName => submods[submodName].module === mod)
  if (!nameInParent) throw Error('err')
  return nameInParent
}

function getModImports(mod: Module, parentMod?: Module, nameInParent?: string): Imports {
  const imports = {}
  for (const provName of Object.keys(mod.providers)) {
    const type = getProviderType(mod.providers[provName])
    if (type !== 'external') continue
    imports[provName] = provName
  }
  if (!parentMod) return imports

  if (!nameInParent) throw Error('err')
  return {
    ...imports,
    ...parentMod.submodules?.[nameInParent].imports,
  }
}

function getModExports(mod: Module, parentMod?: Module, nameInParent?: string): Exports {
  const exports = {}
  for (const provName of Object.keys(mod.providers)) {
    const prov = mod.providers[provName] as unknown as ExportableProvider
    if (!prov.doExport && !prov.exportName) continue
    exports[provName] = prov.exportName || provName
  }
  return exports
}

/**
 * Convert module description object into format suitable for further dependency resolution.
 */
export function processModuleRecursive(mod: Module, parentMod?: ProcessedModule, nameInParent?: string): ProcessedModule {
  debug(`processing module '${nameInParent}'`)
  const rawSubmods = mod.submodules || {}

  const procMod: ProcessedModule = {
    rawModule: mod,
    parentModule: parentMod,
    nameInParent,
    imports: getModImports(mod, parentMod?.rawModule, nameInParent),
    exports: getModExports(mod, parentMod?.rawModule, nameInParent),
    providers: [],
    submodules: [],
  }
  procMod.providers = Object.keys(mod.providers)
    .map(name => {
      const rawProvider = mod.providers[name]
      const type = getProviderType(rawProvider)
      return {
        module: procMod,
        name,
        type,
        rawProvider,
      }
    })
  debug(` providers: ${Object.keys(mod.providers)}`)
  debug(` imports: ${Object.keys(procMod.imports)}`)
  debug(` exports: ${Object.values(procMod.exports)}`)
  debug(` submodules: ${Object.keys(rawSubmods)}`)
  procMod.submodules = Object.keys(rawSubmods)
    .map(submodName => {
      const submod = rawSubmods[submodName].module
      return processModuleRecursive(submod, procMod, submodName)
    })
  return procMod
}

