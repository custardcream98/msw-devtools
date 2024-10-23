import { MSWDevtoolsClientType } from "core"

import { cleanup, pushCleanup } from "~/cli/server/listener"

describe("pushCleanup, cleanup", () => {
  it("should push the cleanup function to the correct client type", () => {
    const cleanupCallback1 = vi.fn()
    const cleanupCallback2 = vi.fn()

    pushCleanup(MSWDevtoolsClientType.CLIENT, cleanupCallback1)
    pushCleanup(MSWDevtoolsClientType.CLIENT, cleanupCallback2)
    cleanup(MSWDevtoolsClientType.CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()

    cleanup(MSWDevtoolsClientType.CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()

    const cleanupCallback3 = vi.fn()
    const cleanupCallback4 = vi.fn()

    pushCleanup(MSWDevtoolsClientType.SERVER_CLIENT, cleanupCallback3)
    pushCleanup(MSWDevtoolsClientType.SERVER_CLIENT, cleanupCallback4)
    cleanup(MSWDevtoolsClientType.SERVER_CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()
    expect(cleanupCallback3).toHaveBeenCalledOnce()
    expect(cleanupCallback4).toHaveBeenCalledOnce()

    cleanup(MSWDevtoolsClientType.SERVER_CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()
    expect(cleanupCallback3).toHaveBeenCalledOnce()
    expect(cleanupCallback4).toHaveBeenCalledOnce()
  })
})
