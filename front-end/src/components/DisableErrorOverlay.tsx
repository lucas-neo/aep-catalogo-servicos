'use client'

import { useEffect } from 'react'

export function DisableErrorOverlay() {
  useEffect(() => {
    // Desabilitar overlay de erro do Next.js
    if (typeof window !== 'undefined') {
      // Remove overlays de erro existentes
      const errorOverlays = document.querySelectorAll('[data-nextjs-dialog-overlay], [data-nextjs-toast]')
      errorOverlays.forEach(overlay => overlay.remove())
      
      // Interceptar novos overlays
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (
                node.hasAttribute('data-nextjs-dialog-overlay') ||
                node.hasAttribute('data-nextjs-toast') ||
                node.querySelector('[data-nextjs-dialog-overlay]') ||
                node.querySelector('[data-nextjs-toast]')
              ) {
                node.remove()
              }
            }
          })
        })
      })
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      // Override console errors em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        const originalError = console.error
        console.error = (...args) => {
          // Filtrar erros específicos do Next.js que não queremos ver
          const message = args[0]?.toString?.() || ''
          
          const shouldSuppress = [
            'Warning: ReactDOM.render is no longer supported',
            'Warning: componentWillReceiveProps has been renamed',
            'Warning: componentWillMount has been renamed',
            'Failed to load resource',
            'Hydration failed',
          ].some(suppressMessage => message.includes(suppressMessage))
          
          if (!shouldSuppress) {
            originalError.apply(console, args)
          }
        }
      }
      
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return null
}
