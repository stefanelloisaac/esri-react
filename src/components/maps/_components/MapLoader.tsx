'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { MapLoaderProps } from '../_types'
import { MapLoading } from './MapLoading'

export function MapLoader({ isLoading, hideDelay = 2000, className }: MapLoaderProps) {
  const [showDelayed, setShowDelayed] = useState(true)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }

    if (isLoading) {
      showTimeoutRef.current = setTimeout(() => {
        setShowDelayed(true)
      }, 0)
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        setShowDelayed(false)
      }, hideDelay)
    }

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    }
  }, [isLoading, hideDelay])

  const isActive = isLoading || showDelayed

  return (
    <div
      className={cn(
        'absolute inset-0 z-1',
        'transition-opacity duration-300 ease-out',
        isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
        className,
      )}
      aria-hidden={!isActive}
    >
      <MapLoading />
    </div>
  )
}
