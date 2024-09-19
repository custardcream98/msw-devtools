import { FIELD_NAME } from "~/components/TabBody/AddMockTab/AddMockForm/form"

import { useActivatedMockList } from "./context"

export const ActivatedMockListTab = () => {
  const { activatedMockList } = useActivatedMockList()

  return (
    <ul className='[&>li+li]:msw-d-mt-4'>
      {activatedMockList.map((mock) => (
        <li
          key={mock[FIELD_NAME.URL]}
          className='msw-d-flex msw-d-rounded-2xl msw-d-bg-white msw-d-p-4 msw-d-shadow-xl'
        >
          <div className='msw-d-w-full'>
            <p className='msw-d-uppercase'>{mock[FIELD_NAME.METHOD]}</p>
            <p>{mock[FIELD_NAME.URL]}</p>
          </div>
          <pre className='msw-d-w-full'>
            {JSON.stringify(JSON.parse(mock[FIELD_NAME.RESPONSE]), null, 2)}
          </pre>
        </li>
      ))}
    </ul>
  )
}
