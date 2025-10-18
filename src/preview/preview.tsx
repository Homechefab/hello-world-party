import React from 'react'
import ReactDOM from 'react-dom/client'
import PreviewLayout from './PreviewLayout'
import { BrowserRouter } from 'react-router-dom'
import PreviewProviders from './PreviewProviders'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PreviewProviders>
        <PreviewLayout />
      </PreviewProviders>
    </BrowserRouter>
  </React.StrictMode>,
)