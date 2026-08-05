import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ExploreHealthPlus from './ExploreHealthPlus'
import './health-plus.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExploreHealthPlus />
  </StrictMode>,
)
