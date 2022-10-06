import React from "react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Audio = React.lazy( () => import('@/components/Audio'));
const Card = React.lazy( () => import("@/components/Card"));

export default function App() : JSX.Element {
  return (
      <>
        <Card greet="" />
        <Audio />
        <ToastContainer />
      </>
  )
}
