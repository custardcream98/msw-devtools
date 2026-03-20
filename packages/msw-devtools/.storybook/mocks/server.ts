// Storybook용 server mock 모듈
// 실제 WebSocket 서버 없이 동작할 수 있도록 stub 함수 제공

export const sendMockListToServer = () => {}
export const addServerMockListUpdateListener = () => () => {}
export const startServer = () => {}
export const enableServer = () => {}
export const isServerEnabled = () => false
export const serverGuard = () => undefined
