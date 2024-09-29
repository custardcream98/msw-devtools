import { render, screen } from "@testing-library/react"
import _userEvent from "@testing-library/user-event"

import { useDrag } from "~/hooks/useDrag"

const setup = (params: Parameters<typeof useDrag>[0]) => {
  const TARGET_ID = "target"
  const Test = () => {
    const props = useDrag(params)

    return <div data-testid={TARGET_ID} {...props}></div>
  }

  const userEvent = _userEvent.setup()
  render(<Test />)

  const target = screen.getByTestId(TARGET_ID)

  return {
    userEvent,
    target
  }
}

describe("useDrag", () => {
  it("should not call onDrag when not dragging", async () => {
    const onDrag = vi.fn()
    const { target, userEvent } = setup({ isDragging: false, onDrag })

    await userEvent.pointer({ target, coords: { x: 100, y: 100 } })

    expect(onDrag).not.toHaveBeenCalled()
  })

  it("should call onDrag when dragging", async () => {
    const onDrag = vi.fn()
    const { target, userEvent } = setup({ isDragging: true, onDrag })

    await userEvent.pointer({
      target,
      coords: { x: 100, y: 100 }
    })

    expect(onDrag).toHaveBeenCalled()
  })
})
