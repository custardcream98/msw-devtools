import testingJsonImport from "./data.json"
import testingImgImport from "./test-img.jpg"

import style from "./TestComponent.module.scss"

import { testUtil } from "@sample-next-react-package/utils/test"

export default function TestComponent() {
  return (
    <div className={style.test}>
      <h1 className='test'>Test Component</h1>
      <p>This is a test component. This is not bundled by rollup</p>
      {JSON.stringify(testingJsonImport, null, 2)}
      {testUtil()}
      <img src={testingImgImport.src} alt='test' />
    </div>
  )
}
