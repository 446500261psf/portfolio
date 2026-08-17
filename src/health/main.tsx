import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ExploreHealth from './ExploreHealth'
import './explore-health.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExploreHealth />
  </StrictMode>,
)
