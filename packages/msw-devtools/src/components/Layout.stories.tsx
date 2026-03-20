import type { Meta, StoryObj } from "@storybook/react"

import { Layout } from "./Layout"

const meta = {
  title: "Layout/Layout",
  component: Layout,
  argTypes: {
    isOpened: { control: "boolean" }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: 500, position: "relative" }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

/** 패널 열림 상태 */
export const Opened: Story = {
  args: {
    isOpened: true,
    children: (
      <div className='flex items-center justify-center p-4 text-sm text-slate-500'>
        Layout Content Area
      </div>
    )
  }
}

/** 패널 닫힘 상태 (화면 아래로 슬라이드) */
export const Closed: Story = {
  args: {
    isOpened: false,
    children: (
      <div className='flex items-center justify-center p-4 text-sm text-slate-500'>
        Layout Content Area
      </div>
    )
  }
}
