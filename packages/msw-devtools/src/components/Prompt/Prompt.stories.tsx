import type { Meta, StoryObj } from "@storybook/react"
import { JsonMockResponseType, MethodOption, StatusOption } from "core"

import { Prompt } from "./Prompt"

const meta = {
  title: "Overlay/Prompt",
  component: Prompt,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
} satisfies Meta<typeof Prompt>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 Prompt 모달 */
export const Default: Story = {
  args: {
    jsonMock: {
      url: "/api/users",
      method: MethodOption.get,
      status: StatusOption["200"],
      response: {
        type: JsonMockResponseType.single,
        response: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" }
        ]
      },
      responseDelay: 0,
      isActivated: true,
      shouldPromptResponse: true
    },
    onSubmit: (response) => {
      alert("Submitted: " + JSON.stringify(response))
    }
  }
}

/** POST 요청 Prompt */
export const PostRequest: Story = {
  args: {
    jsonMock: {
      url: "/api/users",
      method: MethodOption.post,
      status: StatusOption["201"],
      response: {
        type: JsonMockResponseType.single,
        response: { id: 3, name: "New User", email: "new@example.com" }
      },
      responseDelay: 0,
      isActivated: true,
      shouldPromptResponse: true
    },
    onSubmit: (response) => {
      alert("Submitted: " + JSON.stringify(response))
    }
  }
}

/** 에러 응답 Prompt */
export const ErrorResponse: Story = {
  args: {
    jsonMock: {
      url: "/api/users/:id",
      method: MethodOption.get,
      status: StatusOption["404"],
      response: {
        type: JsonMockResponseType.single,
        response: { error: "User not found", code: "NOT_FOUND" }
      },
      responseDelay: 0,
      isActivated: true,
      shouldPromptResponse: true
    },
    onSubmit: (response) => {
      alert("Submitted: " + JSON.stringify(response))
    }
  }
}
