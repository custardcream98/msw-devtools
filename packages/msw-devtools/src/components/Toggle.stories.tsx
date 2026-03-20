import type { Meta, StoryObj } from "@storybook/react"

import { Toggle } from "./Toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"]
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

/** 비활성 상태 */
export const Off: Story = {
  args: {
    defaultChecked: false
  }
}

/** 활성 상태 */
export const On: Story = {
  args: {
    defaultChecked: true
  }
}

/** 비활성화된 토글 */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: false
  }
}
