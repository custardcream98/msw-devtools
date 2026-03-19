import type { Meta, StoryObj } from "@storybook/react"
import { JsonMockResponseType, MethodOption, StatusOption } from "core"
import React from "react"

import { DefaultResponseSettingsProvider } from "~/components/contexts/default-response"
import { DefaultResponseDelaySettingsProvider } from "~/components/contexts/default-response-delay"
import { DefaultUrlSettingsProvider } from "~/components/contexts/default-url"
import { FloatingButtonSettingsProvider } from "~/components/contexts/floating-button"
import { MockListProvider } from "~/components/contexts/mock-list"
import { TabProvider } from "~/components/tabs/TabBar"

import { MockCard } from "./MockCard"

const AllProviders = ({ children }: React.PropsWithChildren) => (
  <TabProvider>
    <FloatingButtonSettingsProvider>
      <DefaultUrlSettingsProvider>
        <DefaultResponseSettingsProvider>
          <DefaultResponseDelaySettingsProvider>
            <MockListProvider>{children}</MockListProvider>
          </DefaultResponseDelaySettingsProvider>
        </DefaultResponseSettingsProvider>
      </DefaultUrlSettingsProvider>
    </FloatingButtonSettingsProvider>
  </TabProvider>
)

const meta = {
  title: "Tabs/MockCard",
  component: MockCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AllProviders>
        <div style={{ maxWidth: 700, padding: 16 }}>
          <Story />
        </div>
      </AllProviders>
    )
  ]
} satisfies Meta<typeof MockCard>

export default meta
type Story = StoryObj<typeof meta>

/** 닫힌 상태의 MockCard */
export const Collapsed: Story = {
  args: {
    url: "/api/users",
    method: MethodOption.get,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: [{ id: 1, name: "John Doe" }]
    },
    responseDelay: 0.5,
    isActivated: true,
    shouldPromptResponse: false,
    isInitialOpen: false
  }
}

/** 열린 상태의 MockCard (response body 표시) */
export const Expanded: Story = {
  args: {
    url: "/api/users/:id",
    method: MethodOption.get,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: { id: 1, name: "John Doe", email: "john@example.com" }
    },
    responseDelay: 1,
    isActivated: true,
    shouldPromptResponse: false,
    isInitialOpen: true
  }
}

/** 비활성화된 MockCard */
export const Deactivated: Story = {
  args: {
    url: "/api/users/:id",
    method: MethodOption.delete,
    status: StatusOption["200"],
    response: {
      type: JsonMockResponseType.single,
      response: { success: true }
    },
    responseDelay: 0,
    isActivated: false,
    shouldPromptResponse: false,
    isInitialOpen: false
  }
}

/** Sequential Response를 가진 MockCard */
export const SequentialResponse: Story = {
  args: {
    url: "/api/products",
    method: MethodOption.post,
    status: StatusOption["201"],
    response: {
      type: JsonMockResponseType.sequential,
      response: [
        { id: 1, name: "First response" },
        { id: 2, name: "Second response" }
      ]
    },
    responseDelay: 0,
    isActivated: true,
    shouldPromptResponse: false,
    isInitialOpen: true
  }
}
