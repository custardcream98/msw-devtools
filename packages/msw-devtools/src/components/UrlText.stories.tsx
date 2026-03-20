import type { Meta, StoryObj } from "@storybook/react"

import { UrlText } from "./UrlText"

const meta = {
  title: "Components/UrlText",
  component: UrlText,
  tags: ["autodocs"]
} satisfies Meta<typeof UrlText>

export default meta
type Story = StoryObj<typeof meta>

export const SimpleURL: Story = {
  args: {
    children: "/api/users"
  }
}

export const LongURL: Story = {
  args: {
    children: "/api/v2/organizations/:orgId/projects/:projectId/tasks/:taskId"
  }
}

export const URLWithQueryParams: Story = {
  args: {
    children: "/api/users?page=1&limit=10&sort=name"
  }
}

export const WildcardURL: Story = {
  args: {
    children: "/api/users/*"
  }
}

/** 긴 URL이 부모 컨테이너에서 잘리는 모습 */
export const Truncated: Story = {
  render: () => (
    <div style={{ width: 200, overflow: "hidden" }}>
      <UrlText>/api/v2/organizations/:orgId/projects/:projectId/tasks</UrlText>
    </div>
  )
}
