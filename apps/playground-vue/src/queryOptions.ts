import { ENDPOINT } from './constants'

export class ApiError extends Error {
  constructor(
    public status: number,
    public response: unknown
  ) {
    super()
  }
}

export const fetchCustardStatus = async () => {
  const res = await fetch(ENDPOINT)
  const response = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, response)
  }

  return {
    response,
    status: res.status
  }
}
