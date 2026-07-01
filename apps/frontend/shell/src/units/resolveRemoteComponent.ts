import type { ComponentType } from 'react'

function isComponent(value: unknown): value is ComponentType<any> {
  return typeof value === 'function'
}

export function resolveRemoteComponent<T extends string>(
  module: unknown,
  exportName: T,
): ComponentType<any> {
  const mod = module as Record<string, unknown> | undefined
  const direct = mod?.[exportName]

  if (isComponent(direct)) {
    return direct
  }

  const defaultExport = mod?.default

  if (isComponent(defaultExport)) {
    return defaultExport
  }

  if (defaultExport && typeof defaultExport === 'object') {
    const nested = (defaultExport as Record<string, unknown>)[exportName]

    if (isComponent(nested)) {
      return nested
    }
  }

  throw new Error(`Remote export ${exportName} is not a React component`)
}
