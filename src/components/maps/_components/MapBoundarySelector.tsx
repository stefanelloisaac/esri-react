'use client'

import { useEffect, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getBoundaryNames } from '../_lib/_boundaries'
import { cn } from '@/lib/utils'
import { MapBoundarySelectorProps } from '../_types'

export function MapBoundarySelector({
  value,
  onValueChange,
  allowedBoundaries,
  className,
}: MapBoundarySelectorProps) {
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const allBoundaries = getBoundaryNames()
  const availableBoundaries = allowedBoundaries
    ? allBoundaries.filter((b) => allowedBoundaries.includes(b.id))
    : allBoundaries

  return (
    <div className={cn(className)}>
      <Select value={value} onValueChange={onValueChange} key={value}>
        <SelectTrigger className='h-9 w-[200px] border border-input bg-background/95 text-foreground shadow-md backdrop-blur-sm'>
          <SelectValue placeholder='Selecione um estado' />
        </SelectTrigger>
        <SelectContent position='popper' sideOffset={5} className='z-1001'>
          {availableBoundaries.map((boundary) => (
            <SelectItem key={boundary.id} value={boundary.id}>
              {boundary.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
