import { MutableRefObject, useEffect, useRef } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 * @param {MutableRefObject<T>} node - Mutable ref object whose click outside to listen for
 * @param {(() => void) | undefined} handler - Function to execute on outside click
 * @template T - Type of the HTML element that the ref is attached to
 */
export function useOnClickOutside<T extends HTMLElement | null>(
  node: MutableRefObject<T>,
  handler: (() => void) | undefined
) {
  const handlerRef = useRef<(() => void) | undefined>(handler)

  useEffect(() => {
    /**
     * Update the handler ref on each render, so if it changes the latest callback will be invoked
     */
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (e: MouseEvent) => {
      if (node.current && node.current.contains(e.target as Node)) {
        return
      }
      handlerRef.current?.()
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [node])
}
