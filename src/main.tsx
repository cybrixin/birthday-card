import Spinner from '@/components/Spinner'
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client';

const App = lazy( () => import("./App") )

const root = document.querySelector('#root') as HTMLElement
const rootContext = createRoot(root);

rootContext.render(
  <StrictMode>
    <Suspense fallback={<Spinner/>}>
      <App/>
    </Suspense>
  </StrictMode>
);