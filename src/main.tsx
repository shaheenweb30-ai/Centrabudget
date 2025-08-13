import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inject Speed Insights using script tag method (more compatible with Vercel)
if (typeof window !== 'undefined') {
  const script = document.createElement('script')
  script.src = 'https://vitals.vercel-insights.com/v1/vitals.js'
  script.async = true
  script.onload = () => {
    // @ts-ignore - Vercel Speed Insights global
    if (window.vitals) {
      // @ts-ignore
      window.vitals('CLS', (metric: any) => {
        console.log('CLS:', metric)
      })
      // @ts-ignore
      window.vitals('FID', (metric: any) => {
        console.log('FID:', metric)
      })
      // @ts-ignore
      window.vitals('FCP', (metric: any) => {
        console.log('FCP:', metric)
      })
      // @ts-ignore
      window.vitals('LCP', (metric: any) => {
        console.log('LCP:', metric)
      })
      // @ts-ignore
      window.vitals('TTFB', (metric: any) => {
        console.log('TTFB:', metric)
      })
    }
  }
  document.head.appendChild(script)
}

createRoot(document.getElementById("root")!).render(<App />);
