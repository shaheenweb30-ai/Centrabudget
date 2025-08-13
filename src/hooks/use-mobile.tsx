import * as React from "react"

// Enhanced breakpoints for better responsive design
const BREAKPOINTS = {
  xs: 480,    // Extra small mobile
  sm: 640,    // Small mobile
  md: 768,    // Medium tablet
  lg: 1024,   // Large tablet
  xl: 1280,   // Small desktop
  '2xl': 1536 // Large desktop
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.md)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Enhanced hook for responsive breakpoints
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof BREAKPOINTS>('md')
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      setDimensions({ width, height: window.innerHeight })
      
      if (width < BREAKPOINTS.xs) setBreakpoint('xs')
      else if (width < BREAKPOINTS.sm) setBreakpoint('sm')
      else if (width < BREAKPOINTS.md) setBreakpoint('md')
      else if (width < BREAKPOINTS.lg) setBreakpoint('lg')
      else if (width < BREAKPOINTS.xl) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return {
    breakpoint,
    dimensions,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md',
    isTablet: breakpoint === 'md' || breakpoint === 'lg',
    isDesktop: breakpoint === 'xl' || breakpoint === '2xl',
    isSmallMobile: breakpoint === 'xs',
    isLargeMobile: breakpoint === 'sm',
    isSmallTablet: breakpoint === 'md',
    isLargeTablet: breakpoint === 'lg',
    isSmallDesktop: breakpoint === 'xl',
    isLargeDesktop: breakpoint === '2xl'
  }
}

// Utility hook for touch device detection
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }
    
    checkTouchDevice()
  }, [])

  return isTouchDevice
}
