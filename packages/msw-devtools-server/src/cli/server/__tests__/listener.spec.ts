import { MSWDevtoolsClientType } from "core"

import { cleanup, pushCleanup } from "~/cli/server/listener"

describe("pushCleanup, cleanup", () => {
  it("should push the cleanup function to the correct client type", async () => {
    const cleanupCallback1 = vi.fn()
    const cleanupCallback2 = vi.fn()

    pushCleanup(MSWDevtoolsClientType.CLIENT, cleanupCallback1)
    pushCleanup(MSWDevtoolsClientType.CLIENT, cleanupCallback2)
    await cleanup(MSWDevtoolsClientType.CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()

    await cleanup(MSWDevtoolsClientType.CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()

    const cleanupCallback3 = vi.fn()
    const cleanupCallback4 = vi.fn()

    pushCleanup(MSWDevtoolsClientType.SERVER_CLIENT, cleanupCallback3)
    pushCleanup(MSWDevtoolsClientType.SERVER_CLIENT, cleanupCallback4)
    await cleanup(MSWDevtoolsClientType.SERVER_CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()
    expect(cleanupCallback3).toHaveBeenCalledOnce()
    expect(cleanupCallback4).toHaveBeenCalledOnce()

    await cleanup(MSWDevtoolsClientType.SERVER_CLIENT)

    expect(cleanupCallback1).toHaveBeenCalledOnce()
    expect(cleanupCallback2).toHaveBeenCalledOnce()
    expect(cleanupCallback3).toHaveBeenCalledOnce()
    expect(cleanupCallback4).toHaveBeenCalledOnce()
  })
})
