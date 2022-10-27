import '@/assets/styles/client/index.css'
import 'react-toastify/dist/ReactToastify.css';
import { lazy } from "react"
import { ToastContainer } from 'react-toastify';
import AppContext from "@/contexts/AppContext";

const Audio = lazy( () => import('@/components/Audio'));
const Card = lazy( () => import("@/components/Card"));

export default function App() : JSX.Element {
  const res = [{
    parent: document.head,
    tag: 'link',
    attr: {
      href: 'https://fonts.googleapis.com/css2?family=Cedarville+Cursive&family=Kalam:wght@400;700&family=Sacramento&family=Roboto&display=swap',
      rel: 'stylesheet',
      type: 'text/css',
    }
  }];

  return (
    <AppContext resource={res}>
      <Card greet="" />
      <Audio />
      <ToastContainer />
    </AppContext>
  );
}
