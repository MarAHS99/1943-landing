import { useState } from 'react'
import PlaneIntro from './PlaneIntro'
import Landing from './Landing'

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <>
      {!introComplete && <PlaneIntro onComplete={() => setIntroComplete(true)} />}
      {introComplete && <Landing />}
    </>
  )
}
