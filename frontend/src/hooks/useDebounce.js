import { useState, useEffect } from "react"

/**
 * useDebounce — delays updating the returned value until after `delay` ms
 * have elapsed since the last time the value changed.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 300)
 *   useEffect(() => { fetch(debouncedSearch) }, [debouncedSearch])
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel the timeout if value changes before delay elapses
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
