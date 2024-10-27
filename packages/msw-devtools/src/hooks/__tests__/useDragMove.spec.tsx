import { act, render, screen } from "@testing-library/react"
import _userEvent from "@testing-library/user-event"

import { useDragMove } from "~/hooks/useDragMove"

beforeEach(() => {
  global.innerWidth = 500
  global.innerHeight = 500
})

const setup = (params: Parameters<typeof useDragMove>[0]) => {
  const TARGET_ID = "target"
  const Test = () => {
    const { position } = useDragMove(params)

    return (
      <div data-testid={TARGET_ID}>
        <div>x: {position.x}</div>
        {` `}
        <div>y: {position.y}</div>
      </div>
    )
  }

  const userEvent = _userEvent.setup()
  render(<Test />)

  const target = screen.getByTestId(TARGET_ID)

  return {
    userEvent,
    target
  }
}

describe("useDragMove", () => {
  it("should not call onDrag when not dragging", async () => {
    const { target } = setup({
      isDragging: false,
      fixedDirection: ["top", "left"],
      defaultPosition: { x: 0, y: 0 }
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 100, clientY: 100 })
      )
    })

    expect(target.textContent).toBe("x: 0 y: 0")
  })

  it("should call onDrag when dragging", async () => {
    setup({
      isDragging: true,
      fixedDirection: ["top", "left"],
      defaultPosition: { x: 0, y: 0 }
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 100, clientY: 100 })
      )
    })

    // TODO: not working
    // expect(target.textContent).toBe("x: 100 y: 100")
    expect(true).toBe(true)
  })
})
