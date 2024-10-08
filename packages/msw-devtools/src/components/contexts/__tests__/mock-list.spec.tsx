import type { JsonMock } from "@custardcream/msw-devtools-core"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/node"

import { MockListProvider, useMockList } from "~/components/contexts/mock-list"

const server = setupServer()

beforeAll(() => server.listen())
beforeEach(() => {
  window.localStorage.clear()
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

vi.mock("~/lib/msw/worker", () => ({
  getWorker: () => server
}))

const setup = ({ mock }: { mock: JsonMock }) => {
  const MOCK_LIST_ID = "mock-list"
  const Test = () => {
    const {
      mockList,
      pushMock,
      removeMock,
      activateMock,
      deactivateMock,
      clearAllMocks
    } = useMockList()

    return (
      <div>
        <div data-testid={MOCK_LIST_ID}>{JSON.stringify(mockList)}</div>
        <button onClick={() => pushMock(mock)}>pushMock</button>
        <button onClick={() => removeMock(mock)}>removeMock</button>
        <button onClick={() => activateMock(mock)}>activateMock</button>
        <button onClick={() => deactivateMock(mock)}>deactivateMock</button>
        <button onClick={() => clearAllMocks()}>clearAllMocks</button>
      </div>
    )
  }

  return {
    userEvent: userEvent.setup(),
    ...render(
      <MockListProvider>
        <Test />
      </MockListProvider>
    ),
    mockListWrapper: screen.getByTestId(MOCK_LIST_ID)
  }
}

describe("mock-list", () => {
  it("should push a mock", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))

    expect(mockListWrapper).toHaveTextContent(JSON.stringify([mock]))
  })

  it("should not push a mock if the same mock already exists", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))
    await userEvent.click(screen.getByText("pushMock"))

    expect(mockListWrapper).toHaveTextContent(JSON.stringify([mock]))
  })

  it("should remove a mock", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))
    await userEvent.click(screen.getByText("removeMock"))

    expect(mockListWrapper).toHaveTextContent(JSON.stringify([]))
  })

  it("should activate a mock", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: false,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))
    await userEvent.click(screen.getByText("activateMock"))

    mock.isActivated = true
    expect(mockListWrapper).toHaveTextContent(JSON.stringify([mock]))
  })

  it("should deactivate a mock", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))
    await userEvent.click(screen.getByText("deactivateMock"))

    mock.isActivated = false
    expect(mockListWrapper).toHaveTextContent(JSON.stringify([mock]))
  })

  it("should clear all mocks", async () => {
    const mock: JsonMock = {
      url: "https://test-url",
      method: "get",
      status: "200",
      response: {
        type: "single",
        response: { name: "John" }
      },
      isActivated: true,
      responseDelay: 1000
    }
    const { userEvent, mockListWrapper } = setup({ mock })

    await userEvent.click(screen.getByText("pushMock"))
    await userEvent.click(screen.getByText("clearAllMocks"))

    expect(mockListWrapper).toHaveTextContent(JSON.stringify([]))
  })
})
