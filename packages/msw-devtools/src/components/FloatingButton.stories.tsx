import type { Meta, StoryObj } from "@storybook/react"

import { FloatingButtonSettingsContext } from "~/components/contexts/floating-button"

import { FloatingButton } from "./FloatingButton"

const meta = {
  title: "Components/FloatingButton",
  component: FloatingButton,
  decorators: [
    (Story) => (
      <FloatingButtonSettingsContext value={[1, () => {}]}>
        <div style={{ width: "100%", height: 400, position: "relative" }}>
          <Story />
        </div>
      </FloatingButtonSettingsContext>
    )
  ],
  tags: ["autodocs"]
} satisfies Meta<typeof FloatingButton>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 플로팅 버튼 */
export const Default: Story = {
  args: {
    onClick: () => alert("FloatingButton clicked!")
  }
}

/** 반투명 플로팅 버튼 */
export const HalfOpacity: Story = {
  decorators: [
    (Story) => (
      <FloatingButtonSettingsContext value={[0.5, () => {}]}>
        <div style={{ width: "100%", height: 400, position: "relative" }}>
          <Story />
        </div>
      </FloatingButtonSettingsContext>
    )
  ],
  args: {
    onClick: () => {}
  }
}
