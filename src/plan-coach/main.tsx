import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PlanCoachCase from './PlanCoachCase'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlanCoachCase />
  </StrictMode>,
)
