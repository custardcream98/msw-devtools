import { useEffect, useRef } from "react"

import { useMockList } from "~/components/contexts/mock-list"
import { useTab } from "~/components/tabs/TabBar"
import { FIELD_NAME } from "~/constants"
import type { JsonMock } from "~/types"
import { isSameMockJson } from "~/utils/isSameMockJson"

import { MockCard } from "./MockCard"
import { MockListFrame } from "./MockListFrame"

export const MockListTab = () => {
  const { mockList } = useMockList()

  return (
    <MockListFrame>
      <ul className='w-full [&>li+li]:mt-4'>
        {mockList.map((mock) => (
          <MockListItem key={mock[FIELD_NAME.URL]} mock={mock} />
        ))}
      </ul>
    </MockListFrame>
  )
}

const MockListItem = ({ mock }: { mock: JsonMock }) => {
  const { tabState } = useTab()

  const isEdited =
    tabState?.prevEdited && isSameMockJson(tabState.prevEdited, mock)

  const item = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (isEdited) {
      item.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [isEdited])

  return (
    <li ref={item}>
      <MockCard isInitialOpen={isEdited} {...mock} />
    </li>
  )
}
