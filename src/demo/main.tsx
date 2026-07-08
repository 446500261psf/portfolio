import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './material3-bottom-sheet.css'
import Material3BottomSheetDemo from './Material3BottomSheetDemo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Material3BottomSheetDemo />
  </StrictMode>,
)
