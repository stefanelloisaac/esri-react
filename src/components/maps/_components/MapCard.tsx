'use client'

import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MapCardProps {
  children: ReactNode
  height: string
  className?: string
}

export function MapCard({ children, height, className }: MapCardProps) {
  return (
    <Card className={cn('w-full overflow-hidden', className)} style={{ height }}>
      <div className='h-full w-full rounded-lg p-1.5'>{children}</div>
    </Card>
  )
}
