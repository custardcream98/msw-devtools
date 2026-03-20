import type { Meta, StoryObj } from "@storybook/react"
import { JsonMockResponseType, MethodOption, StatusOption } from "core"
import React from "react"

import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultResponseDelaySettingsProvider } from "~/components/contexts/default-response-delay"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { EditStateProvider } from "~/components/contexts/edit-state"
import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { MockListProvider } from "~/components/contexts/mock-list"
import { TabProvider } from "~/components/tabs/TabBar"

import { MockListTab } from "./MockListTab"

/** 샘플 mock 데이터 */
const SAMPLE_MOCK_LIST = [
  {
    url: "/api/users",
    method: MethodOption.get,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
      ]
    },
    responseDelay: 0.5,
    isActivated: true,
    shouldPromptResponse: false
  },
  {
    url: "/api/users/:id",
    method: MethodOption.get,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: { id: 1, name: "John Doe", email: "john@example.com" }
    },
    responseDelay: 0,
    isActivated: true,
    shouldPromptResponse: false
  },
  {
    url: "/api/users",
    method: MethodOption.post,
    status: StatusOption["201"],
    response: {
      type: JsonMockResponseType.single,
      response: { id: 3, name: "New User", email: "new@example.com" }
    },
    responseDelay: 1,
    isActivated: true,
    shouldPromptResponse: false
  },
  {
    url: "/api/users/:id",
    method: MethodOption.delete,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: { success: true }
    },
    responseDelay: 0,
    isActivated: false,
    shouldPromptResponse: false
  },
  {
    url: "/api/products",
    method: MethodOption.get,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.sequential,
      response: [
        [{ id: 1, name: "Product A" }],
        [
          { id: 1, name: "Product A" },
          { id: 2, name: "Product B" }
        ]
      ]
    },
    responseDelay: 0,
    isActivated: true,
    shouldPromptResponse: true
  }
]

/**
 * localStorage에 mock 데이터를 동기적으로 주입하는 헬퍼
 * useLocalStorageState는 "MSW_DEVTOOLS" 키 아래 JSON으로 관리됨
 */
const injectMockData = () => {
  const STORAGE_KEY = "MSW_DEVTOOLS"
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
  existing.MOCK_LIST = SAMPLE_MOCK_LIST
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}

// 모듈 로드 시점에 동기적으로 실행 (Provider 마운트 전)
injectMockData()

const AllProviders = ({ children }: React.PropsWithChildren) => (
  <TabProvider>
    <FloatingButtonSettingsProvider>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <DefaultResponseDelaySettingsProvider>
            <MockListProvider>
              <EditStateProvider>{children}</EditStateProvider>
            </MockListProvider>
          </DefaultResponseDelaySettingsProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </FloatingButtonSettingsProvider>
  </TabProvider>
)

const meta = {
  title: "Tabs/MockListTab",
  component: MockListTab,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AllProviders>
        <div style={{ height: 500 }}>
          <Story />
        </div>
      </AllProviders>
    )
  ],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof MockListTab>

export default meta
type Story = StoryObj<typeof meta>

/** Mock 목록 탭 - README image2.png 캡처 소스 */
export const Default: Story = {}
