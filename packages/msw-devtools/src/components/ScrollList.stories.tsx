import type { Meta, StoryObj } from "@storybook/react"

import { ScrollList } from "./ScrollList"

const meta = {
  title: "Components/ScrollList",
  component: ScrollList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{ height: 300, border: "1px solid #e2e5ea", borderRadius: 8 }}
      >
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ScrollList>

export default meta
type Story = StoryObj<typeof meta>

/** 아이템이 적은 경우 */
export const FewItems: Story = {
  render: () => (
    <ScrollList>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className='mb-2 rounded border border-slate-200 p-3'>
          Item {i + 1}
        </div>
      ))}
    </ScrollList>
  )
}

/** 아이템이 많아 스크롤이 발생하는 경우 */
export const ManyItems: Story = {
  render: () => (
    <ScrollList>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className='mb-2 rounded border border-slate-200 p-3'>
          Item {i + 1}
        </div>
      ))}
    </ScrollList>
  )
}

/** 빈 목록 */
export const Empty: Story = {
  render: () => <ScrollList />
}
