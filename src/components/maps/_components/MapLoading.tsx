export function MapLoading() {
  return (
    <div className='relative flex h-full w-full items-center justify-center bg-background/80 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <div className='h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/50' />
          <div className='absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-primary/30 border-l-primary/30 animation-duration-[1.5s] direction-[reverse]' />
          <div className='absolute inset-4 h-8 w-8 animate-pulse rounded-full bg-primary/20' />
        </div>

        <div className='space-y-2 text-center'>
          <p className='text-sm font-medium text-foreground'>Carregando mapa</p>
          <div className='flex justify-center gap-1'>
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary' />
          </div>
        </div>
      </div>
    </div>
  )
}
