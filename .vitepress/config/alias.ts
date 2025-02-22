import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../..', import.meta.url))

export function r(path = '', base = root) {
  return join(base, path).replace(/\\/g, '/')
}

export const ROOT_PATH = r()
export const MAIN_PATH = r('.vitepress')

// align with tsconfig.json paths
export const tsConfigPaths = [
  { find: /^~\//, replacement: `${ROOT_PATH}/` },
  { find: /^@\//, replacement: `${MAIN_PATH}/` },
]
export const vpComponentAlias = overrideVpComponents([
  ['VPSwitchAppearance', 'toggle-dark-mode'],
  ['VPDocFooter', 'doc-footer'],
])

function overrideVpComponents(list: Array<[string, string]>) {
  return list.map(([filename, newFilename]) => ({
    find: new RegExp(`^.*\\/${filename}\\.vue$`),
    replacement: r(`theme/components/${newFilename}.vue`, MAIN_PATH),
  }))
}
