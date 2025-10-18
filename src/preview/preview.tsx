import React from 'react'
import ReactDOM from 'react-dom/client'
import PreviewLayout from './PreviewLayout'

import PreviewProviders from './PreviewProviders'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PreviewProviders>
      <PreviewLayout />
    </PreviewProviders>
  </React.StrictMode>
)