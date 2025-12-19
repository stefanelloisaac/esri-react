'use client'

import { Button } from '@/components/ui/button'
import { Save, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MapColorPicker } from './MapColorPicker'
import { MapDrawingControlsProps } from '../_types'

export function MapDrawingControls({
  onSave,
  onClear,
  selectedColor,
  onColorChange,
  className,
  disabled = false,
  hasUnsavedChanges = false,
}: MapDrawingControlsProps) {
  return (
    <div
      className={cn(
        'flex h-9 items-center gap-1 rounded-md border border-input bg-background/95 px-1 shadow-md backdrop-blur-sm',
        className,
      )}
    >
      {selectedColor && onColorChange && (
        <MapColorPicker
          selectedColor={selectedColor}
          onColorChange={onColorChange}
          disabled={disabled}
        />
      )}
      <Button
        variant='ghost'
        size='sm'
        onClick={onSave}
        disabled={disabled}
        title='Salvar desenhos localmente'
        className={cn(
          'relative h-7 flex-1 hover:bg-emerald-600/10 hover:text-emerald-600',
          hasUnsavedChanges &&
            'animate-pulse text-amber-600 hover:bg-amber-600/10 hover:text-amber-700',
        )}
      >
        <Save className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={onClear}
        disabled={disabled}
        title='Limpar todos os desenhos'
        className='h-7 flex-1 hover:bg-destructive/10 hover:text-destructive'
      >
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}
