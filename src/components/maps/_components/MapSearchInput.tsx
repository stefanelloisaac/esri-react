'use client'

import { useState, useTransition } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MapSearchInputProps } from '../_types'

export function MapSearchInput({
  onSearch,
  onCycle,
  placeholder = 'Buscar...',
  className,
  value: externalValue,
}: MapSearchInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [, startTransition] = useTransition()

  const value = externalValue !== undefined ? externalValue : inputValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (externalValue === undefined) {
      setInputValue(newValue)
    }

    startTransition(() => {
      onSearch?.(newValue)
    })
  }

  const handleClear = () => {
    if (externalValue === undefined) {
      setInputValue('')
    }
    onSearch?.('')
  }

  return (
    <div className={cn('relative w-[400px]', className)}>
      <div className='relative flex h-9 items-center rounded-md border border-input bg-background/95 shadow-md backdrop-blur-sm transition-colors focus-within:border-primary'>
        <input
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (value.trim()) {
                onCycle?.()
              }
            }
          }}
          className='w-full flex-1 bg-transparent px-3 py-0 text-sm font-semibold placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
          style={{ paddingRight: '2.5rem' }}
        />
        <span className='absolute right-0 flex items-center pr-2 text-muted-foreground'>
          {value.length > 0 ? (
            <button
              onClick={handleClear}
              className='rounded-sm p-1 transition-colors hover:bg-accent'
            >
              <X className='h-4 w-4' />
            </button>
          ) : (
            <Search className='h-4 w-4' />
          )}
        </span>
      </div>
    </div>
  )
}
