import type { Meta, StoryObj } from "@storybook/react"

import { TabProvider } from "./context"
import { TabBar } from "./TabBar"

const meta = {
  title: "Layout/TabBar",
  component: TabBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TabProvider>
        <Story />
      </TabProvider>
    )
  ]
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 TabBar (AddMock 탭 활성) */
export const Default: Story = {}

/** Close 버튼 포함 */
export const WithCloseButton: Story = {
  render: () => (
    <TabBar>
      <button
        type='button'
        className='rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
        onClick={() => alert("Close clicked")}
        title='Close'
      >
        X
      </button>
    </TabBar>
  )
}
