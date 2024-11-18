import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { useId } from "~/hooks/useId"

const setup = () => {
  const Test = () => {
    const id1 = useId()
    const id2 = useId()

    return (
      <>
        <div data-testId={"id1"}>{id1}</div>
        <div data-testId={"id2"}>{id2}</div>
      </>
    )
  }

  const user = userEvent.setup()
  render(<Test />)

  return {
    user
  }
}

describe("useId", () => {
  it("should generate unique IDs", async () => {
    setup()

    const id1 = screen.getByTestId("id1").textContent
    const id2 = screen.getByTestId("id2").textContent

    expect(id1).not.toBe(id2)
  })

  it("should prefix the ID with 'msw-devtools-'", async () => {
    setup()

    const id1 = screen.getByTestId("id1").textContent
    const id2 = screen.getByTestId("id2").textContent

    expect(id1).toMatch(/^msw-devtools-/)
    expect(id2).toMatch(/^msw-devtools-/)
  })
})
