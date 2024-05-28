import { TestComponent as TestComponentUnbundled } from "sample-next-react-package"
import { TestComponent } from "sample-react-package"

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <TestComponent />
      <TestComponentUnbundled />
    </main>
  )
}
