import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '~/c/App.jsx'
import { ColorSchemeProvider } from '~/c/ColorScheme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorSchemeProvider>
      <App />
    </ColorSchemeProvider>
  </React.StrictMode>
)
