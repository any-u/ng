import { defineBuildConfig } from 'unbuild'
import AutoImport from 'unplugin-auto-import/rollup'

export default defineBuildConfig({
  entries: [
    'src/index'
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
    inlineDependencies: true,
  },
})