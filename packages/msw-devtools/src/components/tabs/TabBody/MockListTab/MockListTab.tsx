import type { JsonMock } from "core"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import { isSameJsonMock } from "~/utils/isSameJsonMock"

import { MockCard } from "./MockCard"
import { MockListFrame } from "./MockListFrame"

export const MockListTab = () => {
  const { mockList } = useMockList()

  const [searchString, setSearchString] = useState("")
  const searchedMockList = useMemo(() => {
    if (!searchString) {
      return mockList
    }

    return mockList.filter((mock) => {
      return (
        mock.url.toLowerCase().includes(searchString.toLowerCase()) ||
        mock.method.toLowerCase().includes(searchString.toLowerCase()) ||
        mock.status.toLowerCase().includes(searchString.toLowerCase()) ||
        JSON.stringify(mock.response.response)
          .toLowerCase()
          .includes(searchString.toLowerCase())
      )
    })
  }, [mockList, searchString])

  const { t } = useTranslation()

  return (
    <MockListFrame>
      <div className='sticky -top-3 left-0 right-0 z-10 -mx-3 -mt-3 bg-background-light px-2 pb-3 pt-2'>
        <input
          className='w-full p-2 !font-mono text-xs msw-round-border'
          placeholder={t("tabs.mockList.search.placeholder")}
          type='text'
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
        />
      </div>
      <ul className='w-full [&>li+li]:mt-4'>
        {searchedMockList.map((mock) => (
          <MockListItem key={mock.url} mock={mock} />
        ))}
      </ul>
    </MockListFrame>
  )
}

const MockListItem = ({ mock }: { mock: JsonMock }) => {
  const { tabState } = useTab()

  const isEdited =
    tabState?.prevEdited && isSameJsonMock(tabState.prevEdited, mock)

  const item = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (isEdited) {
      const timeout = window.setTimeout(() => {
        item.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)

      return () => {
        window.clearTimeout(timeout)
      }
    }
  }, [isEdited])

  return (
    <li ref={item}>
      <MockCard isInitialOpen={isEdited} {...mock} />
    </li>
  )
}
