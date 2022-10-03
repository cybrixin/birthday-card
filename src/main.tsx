import './index.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client';

const AppProvider = React.lazy( () => import('@/contexts/AppContext'));
const Spinner = React.lazy( () => import('@/components/Spinner'));
const App = React.lazy( () => import("./App"))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<Spinner/>}>
      <AppProvider>
        <App/>
      </AppProvider>
    </Suspense>
  </React.StrictMode>
);