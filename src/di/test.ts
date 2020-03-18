import {
  processModuleRecursive,
  resolveModule,
  resolveProviderRecursive,
  depsToStr,
  initModule,
  Module,
} from '.'

const ConfigMod: Module = {
  providers: {
    'configSvc': {
      doExport: true,
      create: () => ({ url: 'http://url.com' })
    },
  },
}

const ApiMod: Module = {
  providers: {
    'configSvc': { importFrom: null },
    'apiSvc': {
      doExport: true,
      dependencies: ['configSvc'],
      create: (configSvc) => ({ config: configSvc }),
    },
  },
}

const MainMod: Module = {
  providers: {
    'configSvc': { importFrom: 'Config' },
    'apiSvc': { importFrom: 'Api' },
  },
  submodules: {
    'Config': { module: ConfigMod },
    'Api': { module: ApiMod },
  }
}


async function main() {
  console.log(JSON.stringify(MainMod, null, 2))
  const resolved = await initModule(MainMod)
  console.log(resolved)
}

main()


