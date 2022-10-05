import './index.css';
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client';
import AppProvider from '@/contexts/AppContext';
import Spinner from '@/components/Spinner';

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