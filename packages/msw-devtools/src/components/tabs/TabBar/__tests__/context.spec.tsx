import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { TabProvider, useTab } from "~/components/tabs/TabBar/context"
import { Tab } from "~/constants"

const TAB_TEST_ID = "tab-test-id"
const TAB_ADD_MOCK_BUTTON_TEST_ID = Tab.AddMock
const TAB_MOCK_LIST_BUTTON_TEST_ID = Tab.MockList
const TAB_SETTINGS_BUTTON_TEST_ID = Tab.Settings

const Test = () => {
  const { tab, setTab } = useTab()

  return (
    <>
      <button
        data-testid={TAB_ADD_MOCK_BUTTON_TEST_ID}
        onClick={() => setTab(Tab.AddMock)}
      >
        {Tab.AddMock}
      </button>
      <button
        data-testid={TAB_MOCK_LIST_BUTTON_TEST_ID}
        onClick={() => setTab(Tab.MockList)}
      >
        {Tab.MockList}
      </button>
      <button
        data-testid={TAB_SETTINGS_BUTTON_TEST_ID}
        onClick={() => setTab(Tab.Settings)}
      >
        {Tab.Settings}
      </button>
      <div data-testid={TAB_TEST_ID}>{tab}</div>
    </>
  )
}

describe("TabProvider", () => {
  it("should provide tab context", async () => {
    const user = userEvent.setup()
    render(
      <TabProvider>
        <Test />
      </TabProvider>
    )

    const tab = screen.getByTestId(TAB_TEST_ID)

    expect(tab).toHaveTextContent(Tab.AddMock)

    const addMockButton = screen.getByTestId(TAB_ADD_MOCK_BUTTON_TEST_ID)
    const mockListButton = screen.getByTestId(TAB_MOCK_LIST_BUTTON_TEST_ID)
    const settingsButton = screen.getByTestId(TAB_SETTINGS_BUTTON_TEST_ID)

    await user.click(mockListButton)

    expect(tab).toHaveTextContent(Tab.MockList)

    await user.click(settingsButton)

    expect(tab).toHaveTextContent(Tab.Settings)

    await user.click(addMockButton)

    expect(tab).toHaveTextContent(Tab.AddMock)
  })
})

describe("useTab", () => {
  it("should throw an error if used outside of TabProvider", () => {
    expect(() => render(<Test />)).toThrowError()
  })
})
