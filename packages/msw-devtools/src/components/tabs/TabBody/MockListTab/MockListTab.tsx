import { useMockList } from "~/components/contexts/mock-list"
import { FIELD_NAME } from "~/constants"

import { MockCard } from "./MockCard"
import { MockListFrame } from "./MockListFrame"

export const MockListTab = () => {
  const { mockList } = useMockList()

  return (
    <MockListFrame>
      <ul className='w-full [&>li+li]:mt-4'>
        {mockList.map((mock) => (
          <li key={mock[FIELD_NAME.URL]}>
            <MockCard {...mock} />
          </li>
        ))}
      </ul>
    </MockListFrame>
  )
}
