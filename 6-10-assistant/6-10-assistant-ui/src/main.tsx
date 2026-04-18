import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx loaded')
const root = document.getElementById('app')
console.log('root element:', root)

if (!root) {
  document.body.innerHTML = '<p style="color: red; padding: 20px;">ERROR: No #app element found</p>'
} else {
  console.log('Mounting React App...')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('React mounted')
}
