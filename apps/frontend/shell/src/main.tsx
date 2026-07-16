import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProviders } from './app/providers/AppProviders'
import { createRootStore } from './store/rootStore'

async function bootstrap() {
  const store = await createRootStore()

  console.log('jshjdgsjhd');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProviders>
    </StrictMode>,
  )
}

void bootstrap()
