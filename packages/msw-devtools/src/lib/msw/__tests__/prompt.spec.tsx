import { type JsonMock } from "core"
import ReactDOMClient from "react-dom/client"

const MOCKED_JSON_MOCK = {} as unknown as JsonMock
const DIV_MOCK = {
  style: {},
  appendChild: vi.fn()
} as unknown as HTMLDivElement
const MOCKED_RENDER_PROMPT = vi.fn(({ onSubmit }) => {
  setTimeout(() => onSubmit("test-response"), 0)
  return <div>Test Prompt</div>
})

const setup = async () => {
  const createElementSpy = vi
    .spyOn(document, "createElement")
    .mockReturnValue(DIV_MOCK)
  const getElementByIdSpy = vi
    .spyOn(document, "getElementById")
    .mockReturnValue(DIV_MOCK)

  const { createPrompt } = await import("~/lib/msw/prompt")

  return {
    createElementSpy,
    getElementByIdSpy,
    createPrompt
  }
}

beforeEach(() => {
  vi.mock("react-dom/client", () => ({
    default: {
      createRoot: vi.fn(() => ({
        render: vi.fn(),
        unmount: vi.fn()
      }))
    }
  }))
})

afterEach(() => {
  vi.resetModules()
})

describe("createPrompt", () => {
  it("should create a root div element if one doesn't exist", async () => {
    const { createPrompt, createElementSpy, getElementByIdSpy } = await setup()
    getElementByIdSpy.mockImplementation((id) => {
      if (id === "msw-devtools") {
        return DIV_MOCK
      }
      return null
    })

    await createPrompt(MOCKED_JSON_MOCK, MOCKED_RENDER_PROMPT)

    expect(createElementSpy).toHaveBeenCalledWith("div")
    expect(DIV_MOCK.id).toBe("msw-devtools-prompt")
    expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(DIV_MOCK)
  })

  it("should render the prompt with jsonMock and onSubmit props", async () => {
    const { createPrompt } = await setup()

    await createPrompt(MOCKED_JSON_MOCK, MOCKED_RENDER_PROMPT)

    expect(MOCKED_RENDER_PROMPT).toHaveBeenCalledWith({
      jsonMock: MOCKED_JSON_MOCK,
      onSubmit: expect.any(Function)
    })
  })

  it("should resolve the promise with the value passed to onSubmit", async () => {
    const expectedResponse = "user-input-response"

    const renderPromptWithResponse = vi.fn(({ onSubmit }) => {
      setTimeout(() => onSubmit(expectedResponse), 0)
      return <div>Test Prompt</div>
    })

    const { createPrompt } = await setup()

    const response = await createPrompt(
      MOCKED_JSON_MOCK,
      renderPromptWithResponse
    )

    expect(response).toBe(expectedResponse)
  })

  it("should reuse the existing root element if already created", async () => {
    const { createPrompt, createElementSpy, getElementByIdSpy } = await setup()
    getElementByIdSpy.mockImplementation((id) => {
      if (id === "msw-devtools") {
        return DIV_MOCK
      }
      return null
    })

    await createPrompt(MOCKED_JSON_MOCK, MOCKED_RENDER_PROMPT)

    expect(createElementSpy).toHaveBeenCalledOnce()
    expect(ReactDOMClient.createRoot).toHaveBeenCalledOnce()

    createElementSpy.mockClear()
    vi.mocked(ReactDOMClient.createRoot).mockClear()
    getElementByIdSpy.mockResolvedValue(DIV_MOCK)

    // Second call should reuse the root element
    await createPrompt(MOCKED_JSON_MOCK, MOCKED_RENDER_PROMPT)

    expect(createElementSpy).not.toHaveBeenCalled()
    expect(ReactDOMClient.createRoot).toHaveBeenCalledOnce()
  })
})
