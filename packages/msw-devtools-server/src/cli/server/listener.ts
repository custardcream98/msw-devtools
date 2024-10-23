import { MSWDevtoolsClientType } from "core"

export type ListenerCleanup = () => void

const _listenerCleanupsMap: Record<MSWDevtoolsClientType, ListenerCleanup[]> = {
  [MSWDevtoolsClientType.CLIENT]: [],
  [MSWDevtoolsClientType.SERVER_CLIENT]: []
}

export const cleanup = (clientType: MSWDevtoolsClientType) => {
  _listenerCleanupsMap[clientType].forEach((fn) => fn())
  _listenerCleanupsMap[clientType] = []
}

export const pushCleanup = (
  clientType: MSWDevtoolsClientType,
  cleanup: ListenerCleanup
) => {
  _listenerCleanupsMap[clientType].push(cleanup)
}
