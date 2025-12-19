import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { MapShapePreviewProps } from '../_types'
import { rgbNumberToHex } from '@/lib/rgbNumberToHex'

export function MapShapePreview({
  geoJSON,
  width = 80,
  height = 50,
  className,
}: MapShapePreviewProps) {
  const { viewBox, path, color, fillOpacity } = useMemo(() => {
    if (!geoJSON.geometry || geoJSON.geometry.type !== 'Polygon') {
      return {
        viewBox: `0 0 ${width} ${height}`,
        path: '',
        color: '#3b82f6',
        fillOpacity: 0.25,
      }
    }

    const coords = geoJSON.geometry.coordinates[0] as Array<[number, number]>
    if (!coords || coords.length === 0) {
      return {
        viewBox: `0 0 ${width} ${height}`,
        path: '',
        color: '#3b82f6',
        fillOpacity: 0.25,
      }
    }

    let minLng = Infinity,
      maxLng = -Infinity
    let minLat = Infinity,
      maxLat = -Infinity

    coords.forEach(([lng, lat]) => {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    })

    const lngRange = maxLng - minLng || 0.001
    const latRange = maxLat - minLat || 0.001
    const padding = 2
    const viewWidth = width - 2 * padding
    const viewHeight = height - 2 * padding

    const aspectRatio = lngRange / latRange
    let scale: number,
      offsetX = 0,
      offsetY = 0

    if (aspectRatio > viewWidth / viewHeight) {
      scale = viewWidth / lngRange
      offsetY = (viewHeight - latRange * scale) / 2
    } else {
      scale = viewHeight / latRange
      offsetX = (viewWidth - lngRange * scale) / 2
    }

    const pathData = coords
      .map(([lng, lat], i) => {
        const x = (lng - minLng) * scale + padding + offsetX
        const y = viewHeight - (lat - minLat) * scale + padding - offsetY
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

    let pathColor = '#3b82f6'
    let opacity = 0.25

    if (geoJSON.properties?.drawColor) {
      pathColor = geoJSON.properties.drawColor.hex
      opacity = geoJSON.properties.drawColor.fillOpacity
    } else if (geoJSON.properties?.corbordatalhao !== undefined) {
      pathColor = rgbNumberToHex(geoJSON.properties.corbordatalhao)
    }

    return {
      viewBox: `0 0 ${width} ${height}`,
      path: `${pathData} Z`,
      color: pathColor,
      fillOpacity: opacity,
    }
  }, [geoJSON, width, height])

  if (!path) {
    return (
      <div
        className={cn('flex items-center justify-center rounded bg-muted/30', className)}
        style={{ width, height }}
      >
        <span className='text-[8px] text-muted-foreground'>-</span>
      </div>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className={cn('rounded select-none', className)}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth={1.5}
        fill={color}
        fillOpacity={fillOpacity}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
