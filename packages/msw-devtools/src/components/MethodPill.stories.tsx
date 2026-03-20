import type { Meta, StoryObj } from "@storybook/react"
import { MethodOption } from "core"

import { MethodPill } from "./MethodPill"

const meta = {
  title: "Components/MethodPill",
  component: MethodPill,
  argTypes: {
    method: {
      control: "select",
      options: Object.values(MethodOption)
    }
  },
  tags: ["autodocs"]
} satisfies Meta<typeof MethodPill>

export default meta
type Story = StoryObj<typeof meta>

export const GET: Story = {
  args: {
    method: MethodOption.get
  }
}

export const POST: Story = {
  args: {
    method: MethodOption.post
  }
}

export const PUT: Story = {
  args: {
    method: MethodOption.put
  }
}

export const PATCH: Story = {
  args: {
    method: MethodOption.patch
  }
}

export const DELETE: Story = {
  args: {
    method: MethodOption.delete
  }
}

export const OPTIONS: Story = {
  args: {
    method: MethodOption.options
  }
}

export const HEAD: Story = {
  args: {
    method: MethodOption.head
  }
}

/** 모든 HTTP 메서드를 한눈에 비교 */
export const AllMethods: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {Object.values(MethodOption).map((method) => (
        <MethodPill key={method} method={method} />
      ))}
    </div>
  ),
  args: {
    method: MethodOption.get
  }
}
