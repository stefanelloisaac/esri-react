'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MapErrorProps } from '../_types'

export function MapError({ onRetry, className }: MapErrorProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-999 flex items-center justify-center',
        'bg-neutral-900/80',
        className,
      )}
    >
      <Alert variant='destructive' className='max-w-md'>
        <AlertTitle>Erro ao carregar mapa</AlertTitle>
        <AlertDescription className='mt-2 space-y-4'>
          <p>Não foi possível carregar o mapa. Verifique sua conexão e tente novamente.</p>
          <Button onClick={onRetry} variant='outline' size='sm' className='w-full'>
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
