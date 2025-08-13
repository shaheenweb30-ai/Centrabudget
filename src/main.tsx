import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Inject Speed Insights using script tag method (more compatible with Vercel)
// Using a more CSP-compliant approach
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    const script = document.createElement('script')
    script.src = 'https://vitals.vercel-insights.com/v1/vitals.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      // @ts-ignore - Vercel Speed Insights global
      if (window.vitals) {
        // @ts-ignore
        window.vitals('CLS', (metric: any) => {
          // CLS metric logged
        })
        // @ts-ignore
        window.vitals('FID', (metric: any) => {
          // FID metric logged
        })
        // @ts-ignore
        window.vitals('FCP', (metric: any) => {
          // FCP metric logged
        })
        // @ts-ignore
        window.vitals('LCP', (metric: any) => {
          // LCP metric logged
        })
        // @ts-ignore
        window.vitals('TTFB', (metric: any) => {
          // TTFB metric logged
        })
      }
    }
    script.onerror = () => {
      console.warn('Failed to load Vercel Speed Insights')
    }
    document.head.appendChild(script)
  } catch (error) {
    console.warn('Error setting up Vercel Speed Insights:', error)
  }
}

createRoot(document.getElementById("root")!).render(<App />);
