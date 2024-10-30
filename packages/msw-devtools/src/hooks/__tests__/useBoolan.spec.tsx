import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { useBoolean } from "~/hooks/useBoolean"

const SET_TRUE_ID = "set-true"
const SET_FALSE_ID = "set-false"
const TOGGLE_ID = "toggle"
const RESULT_ID = "result"

const setup = ({
  initial
}: {
  initial?: boolean
} = {}) => {
  const Test = () => {
    const [isTrue, setTrue, setFalse, toggle] = useBoolean(initial)

    return (
      <>
        <button data-testid={SET_TRUE_ID} onClick={setTrue}>
          Set True
        </button>
        <button data-testid={SET_FALSE_ID} onClick={setFalse}>
          Set False
        </button>
        <button data-testid={TOGGLE_ID} onClick={toggle}>
          Toggle
        </button>
        <div data-testid={RESULT_ID}>{isTrue ? "True" : "False"}</div>
      </>
    )
  }

  const user = userEvent.setup()
  render(<Test />)

  return {
    user
  }
}

describe("useBoolean", () => {
  it("initial value should be false", async () => {
    setup()

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("False")
  })

  it("should be able to change initial value", async () => {
    setup({ initial: true })

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("True")
  })

  it("should be able to set true, false, or toggle", async () => {
    const { user } = setup()

    await user.click(screen.getByTestId(SET_TRUE_ID))

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("True")

    await user.click(screen.getByTestId(SET_FALSE_ID))

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("False")

    await user.click(screen.getByTestId(TOGGLE_ID))

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("True")

    await user.click(screen.getByTestId(TOGGLE_ID))

    expect(screen.getByTestId(RESULT_ID).textContent).toBe("False")
  })
})
