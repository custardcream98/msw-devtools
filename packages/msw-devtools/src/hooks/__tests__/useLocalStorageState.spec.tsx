import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useEffect } from "react"

import {
  getLocalStorageItem,
  setLocalStorageItem,
  useLocalStorageState
} from "~/hooks/useLocalStorageState"

const TestComponent = <Key extends string>({
  storageKey,
  initialValue
}: {
  storageKey: Key
  initialValue: number
}) => {
  const [value, setValue] = useLocalStorageState(
    storageKey as any,
    initialValue
  )

  useEffect(() => {
    return () => {
      setValue("unmount")
    }
  }, [setValue])

  return (
    <div>
      <div data-testid='value'>{JSON.stringify(value)}</div>
      <button onClick={() => setValue((prev: number) => (prev ? prev + 1 : 1))}>
        Increment
      </button>
    </div>
  )
}

afterEach(() => {
  localStorage.clear()
})

describe("getLocalStorageItem", () => {
  it("should return undefined when key does not exist", () => {
    expect(getLocalStorageItem("count" as any)).toBeUndefined()
  })

  it("should return value when key exists", () => {
    localStorage.setItem("MSW_DEVTOOLS", JSON.stringify({ count: 5 }))

    expect(getLocalStorageItem("count" as any)).toBe(5)
  })
})

describe("setLocalStorageItem", () => {
  it("should set value to local storage", () => {
    setLocalStorageItem("count" as any, 5)

    expect(JSON.parse(localStorage.getItem("MSW_DEVTOOLS")!)).toEqual({
      count: 5
    })
  })

  it("should update value in local storage", () => {
    localStorage.setItem("MSW_DEVTOOLS", JSON.stringify({ count: 5 }))

    setLocalStorageItem("count" as any, 10)

    expect(JSON.parse(localStorage.getItem("MSW_DEVTOOLS")!)).toEqual({
      count: 10
    })
  })
})

describe("useLocalStorageState", () => {
  it("should initialize state with initial value", () => {
    render(<TestComponent storageKey='count' initialValue={0} />)
    expect(screen.getByTestId("value")).toHaveTextContent("0")
  })

  it("should initialize state with local storage value", () => {
    setLocalStorageItem("count" as any, 5)

    render(<TestComponent storageKey='count' initialValue={0} />)
    expect(screen.getByTestId("value")).toHaveTextContent("5")
  })

  it("should update state when setValue is called", async () => {
    const user = userEvent.setup()
    render(<TestComponent storageKey='count' initialValue={0} />)

    await user.click(screen.getByText("Increment"))

    expect(screen.getByTestId("value")).toHaveTextContent("1")
  })

  it("should persist state in local storage", async () => {
    const user = userEvent.setup()
    render(<TestComponent storageKey='count' initialValue={0} />)

    await user.click(screen.getByText("Increment"))

    expect(JSON.parse(localStorage.getItem("MSW_DEVTOOLS")!)).toEqual({
      count: 1
    })
  })

  it("should be able to set state on unmount", () => {
    const { unmount } = render(
      <TestComponent storageKey='count' initialValue={0} />
    )

    unmount()

    expect(JSON.parse(localStorage.getItem("MSW_DEVTOOLS")!)).toEqual({
      count: "unmount"
    })
  })

  it("should persist state whether it got unmounted and remounted", async () => {
    const { unmount } = render(
      <TestComponent storageKey='count' initialValue={10} />
    )

    unmount()

    render(<TestComponent storageKey='count' initialValue={0} />)

    expect(screen.getByTestId("value")).toHaveTextContent("unmount")
  })
})
