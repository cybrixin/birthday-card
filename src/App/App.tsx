import React from "react"

const Audio = React.lazy( () => import('@/components/Audio'));

export default function App() : JSX.Element {
  return (
      <Audio />
  )
}
