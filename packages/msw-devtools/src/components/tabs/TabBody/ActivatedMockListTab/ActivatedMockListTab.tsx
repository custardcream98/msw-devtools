import { useActivatedMockList } from "~/components/contexts/activated-mock-list"
import { FIELD_NAME } from "~/constants"

import { ActivatedMockCard } from "./ActivatedMockCard"
import { ActivatedMockListFrame } from "./ActivatedMockListFrame"

export const ActivatedMockListTab = () => {
  const { activatedMockList } = useActivatedMockList()

  return (
    <ActivatedMockListFrame>
      <ul className='w-full [&>li+li]:mt-4'>
        {activatedMockList.map((mock) => (
          <li key={mock[FIELD_NAME.URL]}>
            <ActivatedMockCard {...mock} />
          </li>
        ))}
      </ul>
    </ActivatedMockListFrame>
  )
}
