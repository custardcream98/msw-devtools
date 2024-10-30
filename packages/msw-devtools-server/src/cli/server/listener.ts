import { MSWDevtoolsClientType } from "core"

export type ListenerCleanup = () => unknown | Promise<unknown>

const _listenerCleanupsMap: Record<MSWDevtoolsClientType, ListenerCleanup[]> = {
  [MSWDevtoolsClientType.CLIENT]: [],
  [MSWDevtoolsClientType.SERVER_CLIENT]: []
}

export const cleanup = async (clientType: MSWDevtoolsClientType) => {
  for (const cleanupFn of _listenerCleanupsMap[clientType]) {
    await cleanupFn()
  }

  _listenerCleanupsMap[clientType] = []
}

export const pushCleanup = (
  clientType: MSWDevtoolsClientType,
  cleanup: ListenerCleanup
) => {
  _listenerCleanupsMap[clientType].push(cleanup)
}
