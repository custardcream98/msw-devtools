import type { Meta, StoryObj } from "@storybook/react"

import { PromptModePill } from "./PromptModePill"

const meta = {
  title: "Components/PromptModePill",
  component: PromptModePill,
  argTypes: {
    isPromptModeActivated: {
      control: "boolean"
    }
  },
  tags: ["autodocs"]
} satisfies Meta<typeof PromptModePill>

export default meta
type Story = StoryObj<typeof meta>

/** 프롬프트 모드 활성화 */
export const Activated: Story = {
  args: {
    isPromptModeActivated: true
  }
}

/** 프롬프트 모드 비활성화 (렌더링 없음) */
export const Deactivated: Story = {
  args: {
    isPromptModeActivated: false
  }
}
