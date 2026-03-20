import type { Meta, StoryObj } from "@storybook/react"
import { StatusOption } from "core"

import { StatusPill } from "./StatusPill"

const meta = {
  title: "Components/StatusPill",
  component: StatusPill,
  argTypes: {
    status: {
      control: "select",
      options: Object.values(StatusOption)
    }
  },
  tags: ["autodocs"]
} satisfies Meta<typeof StatusPill>

export default meta
type Story = StoryObj<typeof meta>

export const OK: Story = {
  args: {
    status: StatusOption["200"]
  }
}

export const Created: Story = {
  args: {
    status: StatusOption["201"]
  }
}

export const BadRequest: Story = {
  args: {
    status: StatusOption["400"]
  }
}

export const NotFound: Story = {
  args: {
    status: StatusOption["404"]
  }
}

export const ServerError: Story = {
  args: {
    status: StatusOption["500"]
  }
}

/** 모든 상태 코드를 한눈에 비교 */
export const AllStatuses: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {Object.values(StatusOption).map((status) => (
        <StatusPill key={status} status={status} />
      ))}
    </div>
  ),
  args: {
    status: StatusOption["200"]
  }
}
