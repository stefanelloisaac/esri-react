import { Loader2 } from 'lucide-react'

export function MapLoading() {
  return (
    <div className='relative h-full w-full'>
      <Loader2 className='animate-spin' />
    </div>
  )
}
