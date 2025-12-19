# Map Component Documentation

Comprehensive documentation for the Esri Leaflet map component with drawing capabilities, boundary management, and localStorage persistence.

## Table of Contents

1. [Overview](#overview)
2. [Required Packages](#required-packages)
3. [Resources](#resources)
4. [File Structure](#file-structure)
5. [Environment Setup](#environment-setup)
6. [Architecture](#architecture)
7. [Behaviors](#behaviors)
8. [Code Patterns](#code-patterns)
9. [Common Tasks](#common-tasks)
10. [API Reference](#api-reference)

---

## Overview

The Map component is a feature-rich mapping solution built on:

- **Leaflet** - Open-source interactive map library
- **Esri Leaflet** - Integration with ArcGIS services
- **Leaflet Draw** - Drawing and editing tools
- **React Hooks** - Modular, composable architecture
- **localStorage** - Persistent drawing storage

**Key Features**:

- Interactive drawing tools (polygon, rectangle, circle, marker)
- Brazilian state boundary management
- Automatic drawing persistence
- Real-time measurements (area, distance, coordinates)
- Color-coded drawings
- Localized to Portuguese (pt-BR)
- Dark mode support
- GeoJSON export/import

---

## Required Packages

### Core Dependencies

```bash
npm install leaflet esri-leaflet esri-leaflet-vector leaflet-draw
```

Versions currently installed:

```json
{
  "esri-leaflet": "^3.1.0",
  "esri-leaflet-vector": "^4.3.2",
  "leaflet-draw": "^1.0.4"
}
```

### Type Definitions

```bash
npm install -D @types/leaflet @types/leaflet-draw
```

Versions currently installed:

```json
{
  "@types/leaflet": "^1.9.21",
  "@types/leaflet-draw": "^1.0.13"
}
```

### CSS Imports

Required in `src/app/globals.css`:

```css
@import 'leaflet/dist/leaflet.css';
@import 'leaflet-draw/dist/leaflet.draw.css';
```

---

## Resources

- **ArcGIS Developers Portal**: https://developers.arcgis.com/
  - Sign up for free account
  - Generate API key (required)
  - Access to basemaps and services

- **Documentation**:
  - Leaflet: https://leafletjs.com/reference.html
  - Esri Leaflet: https://esri.github.io/esri-leaflet/
  - Leaflet Draw: https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html

- **Basemap Styles**: https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/services/basemap-layer-service/

---

## File Structure

```
src/components/maps/
│
├── Map.tsx                          # Main orchestrator component
│   └─ Integrates all hooks and managers
│   └─ Handles UI controls and loading states
│
├── _configs/
│   ├── config.ts                    # Map constants and defaults
│   │   └─ DEFAULT_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM
│   │   └─ BRAZIL_BOUNDS, BASEMAP_STYLE
│   │
│   └── options.ts                   # Leaflet & basemap options
│       └─ getMapOptions() - Leaflet map configuration
│       └─ getBasemapOptions() - Esri basemap configuration
│
├── _types/
│   └── index.ts                     # TypeScript interfaces
│       └─ MapProps, UseLeafletMapOptions
│       └─ MapDrawControlOptions, BoundaryDefinition
│
├── _hooks/
│   ├── index.ts                     # Centralized hook exports
│   │
│   ├── use-leaflet-map.ts          # Core map initialization
│   │   └─ Creates Leaflet map instance
│   │   └─ Adds Esri vector basemap
│   │   └─ Manages map lifecycle
│   │
│   ├── use-leaflet-callback.ts     # Stable callback references
│   │   └─ Prevents stale closures
│   │   └─ Uses useLayoutEffect for sync
│   │
│   └── use-leaflet-drawings.ts     # localStorage operations
│       └─ saveToLocalStorage()
│       └─ loadFromLocalStorage()
│       └─ clearLocalStorage()
│
├── _lib/
│   ├── _draw/
│   │   ├── index.ts                # Drawing exports
│   │   │
│   │   ├── hook.ts                 # useMapDraw hook
│   │   │   └─ Initializes MapDrawManager
│   │   │   └─ Handles cleanup
│   │   │
│   │   ├── manager.ts              # MapDrawManager class
│   │   │   └─ Encapsulates Leaflet Draw plugin
│   │   │   └─ Event handling (created, edited, deleted)
│   │   │   └─ GeoJSON export/import
│   │   │   └─ Popup generation with measurements
│   │   │   └─ Drawing color management
│   │   │   └─ Auto-naming system
│   │   │
│   │   ├── templates.ts            # HTML popup templates
│   │   │   └─ createPolygonPopup()
│   │   │   └─ createCirclePopup()
│   │   │   └─ createMarkerPopup()
│   │   │   └─ createPointRow()
│   │   │
│   │   └── colors.ts               # Drawing color system
│   │       └─ DRAW_COLORS constant
│   │       └─ getShapeOptions()
│   │       └─ DrawColor type
│   │
│   └── _boundaries/
│       ├── index.ts                # Boundary exports
│       │
│       ├── hook.ts                 # useBoundaryManager hook
│       │   └─ Initializes BoundaryManager
│       │   └─ Handles boundary changes
│       │
│       ├── manager.ts              # BoundaryManager class
│       │   └─ Manages map view transitions
│       │   └─ Tile loading state tracking
│       │
│       └── data.ts                 # Brazilian state definitions
│           └─ BOUNDARIES constant (all 27 states)
│           └─ getBoundaryById()
│           └─ getAllBoundaryIds()
│           └─ getBoundaryNames()
│
└── _components/
    ├── MapLoader.tsx               # Loading spinner overlay
    │   └─ Shows during tile loading
    │
    ├── MapBoundarySelector.tsx     # State boundary dropdown
    │   └─ Select component for choosing state
    │
    ├── MapSearchInput.tsx          # Search input (UI only)
    │   └─ Placeholder for future search functionality
    │
    ├── MapDrawingControls.tsx      # Drawing controls toolbar
    │   └─ Save/Load/Clear buttons
    │   └─ Color picker integration
    │
    └── MapColorPicker.tsx          # Color picker popover
        └─ Grid of predefined colors
        └─ Visual feedback for selection
```

---

## Environment Setup

### Step 1: Create `.env.local`

```bash
NEXT_PUBLIC_ARCGIS_API_KEY=your_api_key_here
```

**Where to get API key**:

1. Visit https://developers.arcgis.com/
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Create new API key
5. Copy key to `.env.local`

### Step 2: Verify Imports

Ensure `src/app/globals.css` includes:

```css
@import 'leaflet/dist/leaflet.css';
```

And in `Map.tsx`:

```tsx
import 'leaflet-draw/dist/leaflet.draw.css'
```

### Step 3: Configure Next.js

In `src/app/page.tsx`, import Map dynamically:

```tsx
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('@/components/maps/Map'), { ssr: false })
```

**Why dynamic import?**

- Leaflet requires `window` object
- SSR would fail without browser APIs
- `ssr: false` ensures client-side only rendering

---

## Architecture

### Composition Pattern

The Map component follows a **hooks-based composition pattern** where each hook manages a specific concern:

```
Map.tsx (Orchestrator)
├── useLeafletMap          → Core map instance
├── useLeafletCallback     → Stable callback refs
├── useLeafletDrawings     → localStorage persistence
├── useMapDraw             → Drawing functionality
└── useBoundaryManager     → Boundary management
```

### Hook Responsibilities

#### 1. useLeafletMap

**Location**: `_hooks/use-leaflet-map.ts`

**Responsibilities**:

- Creates Leaflet map instance using `L.map()`
- Adds Esri vector basemap layer
- Enforces boundary restrictions (pan limiting)
- Handles map cleanup on unmount

**Returns**:

```tsx
{
  mapRef: React.RefObject<L.Map | null>
  basemapLayerRef: React.RefObject<L.Layer | null>
  isInitializedRef: React.RefObject<boolean>
}
```

**Usage**:

```tsx
const { mapRef, isInitializedRef } = useLeafletMap(mapContainerRef, {
  mapOptions: {
    /* ... */
  },
  basemapStyle: 'arcgis/imagery',
  basemapOptions: {
    /* ... */
  },
  initialCenter: [-14.235, -51.925],
  initialZoom: 5,
})
```

#### 2. useLeafletCallback

**Location**: `_hooks/use-leaflet-callback.ts`

**Responsibilities**:

- Maintains stable references to callbacks
- Prevents stale closures in effects
- Uses `useLayoutEffect` for synchronous updates

**Returns**:

```tsx
React.RefObject<T> // where T is callback object type
```

**Usage**:

```tsx
const callbacksRef = useLeafletCallback({
  onShapeCreated: (layerType, layer, geoJSON) => {
    /* ... */
  },
  onShapeEdited: (layers) => {
    /* ... */
  },
  onShapeDeleted: (layers) => {
    /* ... */
  },
})
```

#### 3. useLeafletDrawings

**Location**: `_hooks/use-leaflet-drawings.ts`

**Responsibilities**:

- Save drawings to localStorage
- Load drawings from localStorage
- Clear localStorage drawings

**Returns**:

```tsx
{
  saveToLocalStorage: (geoJSON: GeoJSON.FeatureCollection) => boolean;
  loadFromLocalStorage: () => GeoJSON.FeatureCollection | null;
  clearLocalStorage: () => void;
}
```

**localStorage Key**: `leaflet-drawings`

#### 4. useMapDraw

**Location**: `_lib/_draw/hook.ts`

**Responsibilities**:

- Initializes `MapDrawManager` class
- Waits for map to be ready (polling mechanism)
- Connects drawing events to callbacks
- Manages draw control lifecycle
- Cleanup on unmount

**Returns**:

```tsx
{
  drawManagerRef: React.RefObject<MapDrawManager | null>
}
```

**Usage**:

```tsx
const { drawManagerRef } = useMapDraw(mapRef, isInitializedRef, callbacksRef)
```

#### 5. useBoundaryManager

**Location**: `_lib/_boundaries/hook.ts`

**Responsibilities**:

- Initializes `BoundaryManager` class
- Handles state boundary changes
- Manages tile loading states
- Applies initial boundary on mount

**Returns**:

```tsx
React.RefObject<BoundaryManager | null>
```

**Usage**:

```tsx
useBoundaryManager(mapRef, isInitializedRef, {
  selectedBoundary: 'sp',
  onLoadingStart: () => setIsLoading(true),
  onTilesLoaded: () => setIsLoading(false),
})
```

### Manager Classes

#### MapDrawManager

**Location**: `_lib/_draw/manager.ts`

**Responsibilities**:

- Encapsulates Leaflet Draw plugin
- Manages drawn shapes (FeatureGroup)
- Handles draw events (created, edited, deleted)
- Generates popups with measurements
- GeoJSON export/import
- Drawing color management
- Auto-naming system (0001 - TALHÃO, 0002 - TALHÃO, etc.)
- Portuguese localization

**Key Methods**:

```tsx
class MapDrawManager {
  constructor(map: L.Map, options: MapDrawControlOptions)

  setDrawColor(color: DrawColor): void
  getCurrentColor(): DrawColor
  getDrawnItems(): L.FeatureGroup
  clearAll(): void
  destroy(): void

  exportGeoJSON(): GeoJSON.FeatureCollection
  importGeoJSON(geoJSON: GeoJSON.FeatureCollection): void

  private createDrawControl(): L.Control.Draw
  private generateDrawingName(): string
  private bindPopupToLayer(layer: L.Layer, layerType: string): void
  private applyColorToLayer(layer: L.Layer, color: DrawColor): void
  private calculatePolygonArea(layer: L.Polygon): number
  private formatArea(areaInMeters: number): string
  private formatDistance(distanceInMeters: number): string
}
```

**Localization**:
The manager sets `L.drawLocal` to Portuguese:

- "Desenhar um polígono" (Draw a polygon)
- "Clique para começar a desenhar" (Click to start drawing)
- "Salvar alterações" (Save changes)
- etc.

#### BoundaryManager

**Location**: `_lib/_boundaries/manager.ts`

**Responsibilities**:

- Manages Brazilian state boundaries
- Handles map panning/zooming to boundaries
- Tracks tile loading for loading states
- Smooth transitions with animations

**Key Methods**:

```tsx
class BoundaryManager {
  constructor(map: L.Map, options: BoundaryManagerOptions)

  changeBoundary(boundary: BoundaryDefinition, animate: boolean): void
  getCurrentBoundary(): BoundaryDefinition | null
  destroy(): void

  private setupTileLoadListeners(): void
  private cleanupTileLoadListeners(): void
}
```

---

## Behaviors

### Initialization Flow

```
1. Component mounts
   └─ Map container ref created

2. useLeafletMap runs
   └─ Creates L.Map instance
   └─ Adds Esri vector basemap
   └─ Sets initial view (center, zoom)
   └─ Applies boundary restrictions (if any)
   └─ Sets isInitializedRef to true

3. useMapDraw runs
   └─ Polls for map readiness (checks mapRef.current and isInitializedRef)
   └─ Creates MapDrawManager instance
   └─ Attaches draw event listeners
   └─ Adds draw control to map

4. useBoundaryManager runs
   └─ Polls for map readiness
   └─ Creates BoundaryManager instance
   └─ Applies initial boundary (if provided)
   └─ Sets up tile load listeners

5. Auto-load effect runs
   └─ Polls for drawManagerRef.current readiness
   └─ Loads saved GeoJSON from localStorage
   └─ Imports drawings to map
   └─ Sets isMapReady to true

6. Map ready
   └─ Drawing controls enabled
   └─ User can interact with map
```

### Drawing Flow

```
1. User clicks drawing tool (polygon, rectangle, circle, marker)
   └─ Leaflet Draw activates drawing mode

2. User draws shape on map
   └─ Drawing tool guides user through process
   └─ Tooltips show instructions (in Portuguese)

3. User completes shape
   └─ L.Draw.Event.CREATED fires

4. MapDrawManager handles event
   └─ Generates unique name (e.g., "0001 - TALHÃO")
   └─ Stores current color in GeoJSON properties
   └─ Applies color to shape
   └─ Calculates measurements
   └─ Binds popup with measurements
   └─ Adds layer to drawnItems FeatureGroup

5. Callback fires
   └─ onShapeCreated(layerType, layer, geoJSON) called

6. Auto-save runs
   └─ Exports all drawings as GeoJSON
   └─ Saves to localStorage

7. Shape visible on map
   └─ Click shape to see popup with details
```

### Auto-save Flow

```
1. Drawing event occurs (create, edit, delete)
   └─ Original callback fires (if provided by parent)

2. Auto-save handler wraps callback
   └─ Original callback executes
   └─ Auto-save logic runs after

3. Export GeoJSON
   └─ drawManagerRef.current.exportGeoJSON()
   └─ Includes all properties (color, name, etc.)

4. Save to localStorage
   └─ Key: "leaflet-drawings"
   └─ Value: JSON stringified FeatureCollection

5. Process repeats on every change
   └─ Ensures persistence across page refreshes
```

### Boundary Change Flow

```
1. User selects state from boundary selector dropdown
   └─ onChange fires with new state ID (e.g., "sp")

2. useBoundaryManager effect detects change
   └─ Compares current boundary to selected boundary

3. Retrieve boundary definition
   └─ getBoundaryById(selectedBoundary)
   └─ Returns { id, name, center, bounds, defaultZoom }

4. BoundaryManager.changeBoundary() called
   └─ Determines if animation should be used
   └─ Sets loading state via onLoadingStart callback

5. Map transitions to new boundary
   └─ flyToBounds() with animation (if not initial)
   └─ setView() without animation (if initial)

6. Tile loading begins
   └─ "loading" event tracked on basemap layer

7. Tiles finish loading
   └─ "load" event fires
   └─ onTilesLoaded callback clears loading state

8. Boundary change complete
   └─ Map focused on new state
   └─ Loading spinner hidden
```

### Edit Flow

```
1. User clicks edit tool from Leaflet Draw control
   └─ All drawn shapes become editable

2. User drags vertices/markers to modify shape
   └─ Real-time visual feedback

3. User clicks "Salvar" (Save) button
   └─ L.Draw.Event.EDITED fires

4. MapDrawManager handles event
   └─ Iterates through edited layers
   └─ Recalculates measurements
   └─ Updates popups with new data

5. Callback fires
   └─ onShapeEdited(layers) called

6. Auto-save runs
   └─ Updated GeoJSON saved to localStorage

7. Changes persisted
```

### Delete Flow

```
1. User clicks delete tool from Leaflet Draw control
   └─ All drawn shapes selectable for deletion

2. User clicks shapes to mark for deletion
   └─ Visual feedback (usually red highlight)

3. User clicks "Salvar" (Save) button to confirm
   └─ L.Draw.Event.DELETED fires

4. MapDrawManager handles event
   └─ Removes layers from drawnItems FeatureGroup

5. Callback fires
   └─ onShapeDeleted(layers) called

6. Auto-save runs
   └─ Updated GeoJSON saved to localStorage
   └─ Deleted shapes no longer in storage

7. Shapes removed from map
```

---

## Code Patterns

### Basic Usage

```tsx
'use client'

import dynamic from 'next/dynamic'

// Dynamic import required for SSR compatibility
const Map = dynamic(() => import('@/components/maps/Map'), { ssr: false })

export default function Page() {
  return (
    <div className='h-screen w-screen'>
      <Map
        height='100%'
        allowedBoundaries={['sp', 'rj', 'mg']}
        onShapeCreated={(layerType, layer, geoJSON) => {
          console.log('Shape created:', geoJSON)
        }}
      />
    </div>
  )
}
```

### With All Callbacks

```tsx
<Map
  height='100%'
  center={[-23.55, -46.63]} // São Paulo
  zoom={10}
  className='rounded-lg border'
  allowedBoundaries={['sp', 'rj', 'mg', 'pr', 'sc', 'rs']}
  onShapeCreated={(layerType, layer, geoJSON) => {
    console.log('Created:', layerType, geoJSON)
    // Send to API
  }}
  onShapeEdited={(layers) => {
    console.log('Edited:', layers)
    layers.eachLayer((layer) => {
      // Update in database
    })
  }}
  onShapeDeleted={(layers) => {
    console.log('Deleted:', layers)
    layers.eachLayer((layer) => {
      // Remove from database
    })
  }}
  onDrawingsExport={(geoJSON) => {
    console.log('Export:', geoJSON)
    // Send complete drawing set to database
  }}
/>
```

### Props Interface

```tsx
interface MapProps {
  // Dimensions
  height?: string // Default: "500px"
  className?: string // Additional CSS classes

  // Map Configuration
  center?: [number, number] // Override default center
  zoom?: number // Override default zoom

  // Boundary System
  allowedBoundaries?: string[] // Array of state IDs (e.g., ["sp", "rj"])

  // Drawing Callbacks
  onShapeCreated?: (layerType: string, layer: L.Layer, geoJSON: GeoJSON.Feature) => void

  onShapeEdited?: (layers: L.LayerGroup) => void

  onShapeDeleted?: (layers: L.LayerGroup) => void

  // Export Callback
  onDrawingsExport?: (geoJSON: GeoJSON.FeatureCollection) => void
}
```

### GeoJSON Structure

**Polygon Example**:

```json
{
  "type": "Feature",
  "properties": {
    "drawColor": "blue",
    "name": "0001 - TALHÃO"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-46.63, -23.55],
        [-46.64, -23.55],
        [-46.64, -23.56],
        [-46.63, -23.56],
        [-46.63, -23.55]
      ]
    ]
  }
}
```

**Circle Example** (special handling):

```json
{
  "type": "Feature",
  "properties": {
    "drawColor": "red",
    "name": "0002 - TALHÃO",
    "radius": 1000,
    "center": [-23.55, -46.63],
    "layerType": "circle"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-46.63, -23.55]
  }
}
```

**FeatureCollection** (exported):

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      /* polygon */
    },
    {
      /* circle */
    },
    {
      /* marker */
    }
  ]
}
```

### Measurement Formatting

**Areas**:

```tsx
// < 10,000 m² → square meters
'125,50 m²'

// ≥ 10,000 m² → hectares
'1,25 ha' // 12,500 m²
```

**Distances**:

```tsx
// < 1,000 m → meters
'523,45 m'

// ≥ 1,000 m → kilometers
'1,52 km' // 1,523 m
```

**Coordinates**:

```tsx
// Markers: 6 decimal places
'Lat: -23.550520, Lng: -46.633308'

// Circle centers: 4 decimal places
'Centro: Lat -23.5505, Lng -46.6333'
```

**Number Formatting**:

```tsx
// Brazilian locale (pt-BR)
formatNumber(1234.56) // "1.234,56"
formatNumber(1234567) // "1.234.567,00"
```

### Drawing Colors

**Available Colors** (from `_lib/_draw/colors.ts`):

```tsx
export const DRAW_COLORS = {
  blue: {
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    weight: 3,
  },
  red: {
    color: '#ff4444',
    fillColor: '#ff4444',
    fillOpacity: 0.2,
    weight: 3,
  },
  green: {
    color: '#00cc00',
    fillColor: '#00cc00',
    fillOpacity: 0.2,
    weight: 3,
  },
  // ... more colors
}

export type DrawColor = keyof typeof DRAW_COLORS
export const DEFAULT_DRAW_COLOR: DrawColor = 'blue'
```

**Using Colors**:

```tsx
// In MapDrawManager
const shapeOptions = getShapeOptions(this.currentColor)

// Creating draw control
new L.Control.Draw({
  draw: {
    polygon: { shapeOptions },
    rectangle: { shapeOptions },
    circle: { shapeOptions },
  },
})

// Applying to existing layers
layer.setStyle({
  color: shapeOptions.color,
  fillColor: shapeOptions.fillColor,
  fillOpacity: shapeOptions.fillOpacity,
  weight: shapeOptions.weight,
})
```

### Popup Templates

**Polygon/Rectangle Popup**:

```html
<div style="min-width: 200px;">
  <div style="font-weight: bold; margin-bottom: 8px;">0001 - TALHÃO</div>
  <div style="margin-bottom: 4px;"><strong>Tipo:</strong> Polígono</div>
  <div style="margin-bottom: 4px;"><strong>Área:</strong> 1,25 ha</div>
  <div style="margin-bottom: 4px;"><strong>Vértices:</strong> 4</div>
  <details style="margin-top: 8px;">
    <summary style="cursor: pointer;">Ver coordenadas</summary>
    <table style="width: 100%; margin-top: 8px; font-size: 11px;">
      <thead>
        <tr>
          <th style="text-align: left;">#</th>
          <th style="text-align: right;">Latitude</th>
          <th style="text-align: right;">Longitude</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td style="text-align: right;">-23.550000</td>
          <td style="text-align: right;">-46.630000</td>
        </tr>
        <!-- more rows -->
      </tbody>
    </table>
  </details>
</div>
```

**Circle Popup**:

```html
<div style="min-width: 200px;">
  <div style="font-weight: bold; margin-bottom: 8px;">0002 - TALHÃO</div>
  <div style="margin-bottom: 4px;"><strong>Raio:</strong> 1,00 km</div>
  <div style="margin-bottom: 4px;"><strong>Área:</strong> 3,14 ha</div>
  <div style="margin-top: 8px; font-size: 11px;">
    <strong>Centro:</strong><br />
    Lat -23.5500<br />
    Lng -46.6300
  </div>
</div>
```

**Marker Popup**:

```html
<div style="min-width: 180px;">
  <div style="font-weight: bold; margin-bottom: 8px;">0003 - TALHÃO</div>
  <div style="font-size: 11px;">
    <strong>Posição:</strong><br />
    Lat: -23.550000<br />
    Lng: -46.630000
  </div>
</div>
```

---

## Common Tasks

### Adding a New Drawing Shape

**Example**: Add polyline support

1. **Update draw control** in `MapDrawManager`:

```tsx
// In createDrawControl()
draw: {
  polygon: { shapeOptions },
  polyline: { shapeOptions },  // Add this
  rectangle: { shapeOptions },
  // ...
}
```

2. **Create popup template** in `templates.ts`:

```tsx
export function createPolylinePopup(data: {
  name?: string;
  distance: string;
  pointCount: number;
  pointsTable: string;
}): string {
  return `
    <div style="min-width: 200px;">
      ${data.name ? `<div style="font-weight: bold; margin-bottom: 8px;">${data.name}</div>` : ''}
      <div style="margin-bottom: 4px;">
        <strong>Tipo:</strong> Polilinha
      </div>
      <div style="margin-bottom: 4px;">
        <strong>Distância:</strong> ${data.distance}
      </div>
      ${/* ... */}
    </div>
  `;
}
```

3. **Add type guard** in `getLayerType()`:

```tsx
private getLayerType(layer: L.Layer): string {
  if (layer instanceof L.Circle) return "circle";
  if (layer instanceof L.Marker) return "marker";
  if (layer instanceof L.Rectangle) return "rectangle";
  if (layer instanceof L.Polygon) return "polygon";
  if (layer instanceof L.Polyline) return "polyline";  // Add this
  return "unknown";
}
```

4. **Handle in popup binding** in `bindPopupToLayer()`:

```tsx
private bindPopupToLayer(layer: L.Layer, layerType: string): void {
  // ...existing code...

  else if (layerType === "polyline") {
    const polylineLayer = layer as L.Polyline;
    const latlngs = polylineLayer.getLatLngs() as L.LatLng[];
    const distance = this.calculatePolylineDistance(latlngs);

    popupContent = createPolylinePopup({
      name,
      distance: this.formatDistance(distance),
      pointCount: latlngs.length,
      pointsTable: this.formatPointsTable(latlngs),
    });
  }

  // ...existing code...
}
```

5. **Add calculation method**:

```tsx
private calculatePolylineDistance(latlngs: L.LatLng[]): number {
  let distance = 0;
  for (let i = 0; i < latlngs.length - 1; i++) {
    distance += latlngs[i].distanceTo(latlngs[i + 1]);
  }
  return distance;
}
```

### Adding a New Boundary

**Example**: Add a custom region

1. **Edit boundary data** in `_lib/_boundaries/data.ts`:

```tsx
export const BOUNDARIES: Record<string, BoundaryDefinition> = {
  // ...existing states...

  'custom-region': {
    id: 'custom-region',
    name: 'Custom Region',
    center: [-23.55, -46.63],
    bounds: [
      [-24.0, -47.0], // Southwest corner
      [-23.0, -46.0], // Northeast corner
    ],
    defaultZoom: 9,
  },
}
```

2. **Use in component**:

```tsx
<Map allowedBoundaries={['sp', 'rj', 'custom-region']} />
```

3. **Boundary automatically appears in dropdown** (handled by MapBoundarySelector)

### Customizing Map Appearance

#### Change Basemap Style

**Edit** `_configs/config.ts`:

```tsx
// Available styles:
// - "arcgis/imagery"
// - "arcgis/imagery/standard"
// - "arcgis/streets"
// - "arcgis/navigation"
// - "arcgis/topographic"
// - "arcgis/light-gray"
// - "arcgis/dark-gray"
// - "arcgis/oceans"
// - "osm/standard"

export const BASEMAP_STYLE = 'arcgis/streets' as const
```

#### Customize Dark Mode Styles

**Edit** `src/app/globals.css`:

```css
/* Zoom control */
.dark .leaflet-control-zoom {
  background-color: color-mix(in oklch, var(--background) 60%, transparent);
}

/* Draw toolbar */
.dark .leaflet-draw-section {
  background-color: color-mix(in oklch, var(--background) 60%, transparent);
}

/* Popups */
.dark .leaflet-popup-content-wrapper {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid color-mix(in oklch, var(--foreground) 10%, transparent);
}
```

#### Add New Drawing Colors

**Edit** `_lib/_draw/colors.ts`:

```tsx
export const DRAW_COLORS = {
  // ...existing colors...

  purple: {
    color: '#9c27b0',
    fillColor: '#9c27b0',
    fillOpacity: 0.2,
    weight: 3,
  },

  orange: {
    color: '#ff9800',
    fillColor: '#ff9800',
    fillOpacity: 0.2,
    weight: 3,
  },
}
```

**Update color picker** in `MapColorPicker.tsx`:

```tsx
const colors: DrawColor[] = [
  'blue',
  'red',
  'green',
  'yellow',
  'purple',
  'orange', // Add new colors
]
```

### Extending Map Functionality

#### Add Search Functionality

1. **Install geocoding library**:

```bash
npm install esri-leaflet-geocoder
```

2. **Create search hook** in `_hooks/use-map-search.ts`:

```tsx
import { useRef, useEffect } from 'react'
import L from 'leaflet'
import * as ELG from 'esri-leaflet-geocoder'

export function useMapSearch(
  mapRef: React.RefObject<L.Map | null>,
  isInitializedRef: React.RefObject<boolean>,
) {
  const searchControlRef = useRef<L.Control | null>(null)

  useEffect(() => {
    if (!mapRef.current || !isInitializedRef.current) return

    const searchControl = ELG.geosearch({
      position: 'topright',
      placeholder: 'Buscar endereço',
      useMapBounds: false,
    }).addTo(mapRef.current)

    searchControlRef.current = searchControl

    return () => {
      if (searchControlRef.current && mapRef.current) {
        mapRef.current.removeControl(searchControlRef.current)
      }
    }
  }, [mapRef, isInitializedRef])

  return { searchControlRef }
}
```

3. **Integrate in Map.tsx**:

```tsx
import { useMapSearch } from './_hooks/use-map-search'

// In Map component
const { searchControlRef } = useMapSearch(mapRef, isInitializedRef)
```

#### Add Measurement Tool

1. **Install measurement plugin**:

```bash
npm install leaflet-measure
```

2. **Create measurement hook** similar to search example

3. **Integrate in Map.tsx**

### Persisting to Database

**Example**: Save drawings to backend API

```tsx
function MyPage() {
  const handleShapeCreated = async (
    layerType: string,
    layer: L.Layer,
    geoJSON: GeoJSON.Feature,
  ) => {
    try {
      const response = await fetch('/api/drawings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: layerType,
          geoJSON,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      const data = await response.json()
      console.log('Saved with ID:', data.id)
    } catch (error) {
      console.error('Error saving drawing:', error)
    }
  }

  return (
    <Map
      onShapeCreated={handleShapeCreated}
      onDrawingsExport={async (geoJSON) => {
        // Bulk export to database
        await fetch('/api/drawings/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geoJSON),
        })
      }}
    />
  )
}
```

### Loading Drawings from Database

```tsx
function MyPage() {
  const [initialDrawings, setInitialDrawings] = useState<GeoJSON.FeatureCollection | null>(null)

  useEffect(() => {
    // Fetch drawings from API
    fetch('/api/drawings')
      .then((res) => res.json())
      .then((data) => setInitialDrawings(data))
  }, [])

  // Use Map imperative handle or prop to load drawings
  // (would need to expose importGeoJSON via ref)
}
```

---

## API Reference

### Map Component Props

| Prop                | Type                                  | Default              | Description                                      |
| ------------------- | ------------------------------------- | -------------------- | ------------------------------------------------ |
| `height`            | `string`                              | `"500px"`            | Map container height                             |
| `center`            | `[number, number]`                    | `[-14.235, -51.925]` | Initial map center [lat, lng]                    |
| `zoom`              | `number`                              | `5`                  | Initial zoom level                               |
| `className`         | `string`                              | `""`                 | Additional CSS classes                           |
| `onShapeCreated`    | `(layerType, layer, geoJSON) => void` | -                    | Callback when shape is created                   |
| `onShapeEdited`     | `(layers) => void`                    | -                    | Callback when shapes are edited                  |
| `onShapeDeleted`    | `(layers) => void`                    | -                    | Callback when shapes are deleted                 |
| `onDrawingsExport`  | `(geoJSON) => void`                   | -                    | Callback for exporting drawings                  |
| `allowedBoundaries` | `string[]`                            | -                    | Array of allowed state IDs for boundary selector |

### MapDrawManager API

```tsx
class MapDrawManager {
  // Constructor
  constructor(map: L.Map, options?: MapDrawControlOptions)

  // Color Management
  setDrawColor(color: DrawColor): void
  getCurrentColor(): DrawColor

  // Layer Management
  getDrawnItems(): L.FeatureGroup
  clearAll(): void

  // GeoJSON Operations
  exportGeoJSON(): GeoJSON.FeatureCollection
  importGeoJSON(geoJSON: GeoJSON.FeatureCollection): void

  // Lifecycle
  destroy(): void
}
```

### BoundaryManager API

```tsx
class BoundaryManager {
  // Constructor
  constructor(map: L.Map, options?: BoundaryManagerOptions)

  // Boundary Management
  changeBoundary(boundary: BoundaryDefinition, animate: boolean): void
  getCurrentBoundary(): BoundaryDefinition | null

  // Lifecycle
  destroy(): void
}
```

### useLeafletDrawings Hook

```tsx
function useLeafletDrawings(): {
  saveToLocalStorage: (geoJSON: GeoJSON.FeatureCollection) => boolean
  loadFromLocalStorage: () => GeoJSON.FeatureCollection | null
  clearLocalStorage: () => void
}
```

### Boundary Data Functions

```tsx
// Get boundary by ID
function getBoundaryById(id: string): BoundaryDefinition | undefined

// Get all boundary IDs
function getAllBoundaryIds(): string[]

// Get boundary names map
function getBoundaryNames(): Record<string, string>
```

### Drawing Color Functions

```tsx
// Get shape styling options
function getShapeOptions(color: DrawColor): {
  color: string
  fillColor: string
  fillOpacity: number
  weight: number
}
```

### Popup Template Functions

```tsx
function createPolygonPopup(data: {
  name?: string
  type: string
  area: string
  pointCount: number
  pointsTable: string
}): string

function createCirclePopup(data: {
  name?: string
  radius: string
  area: string
  centerLat: string
  centerLng: string
}): string

function createMarkerPopup(data: { name?: string; lat: string; lng: string }): string

function createPointRow(index: number, lat: string, lng: string): string
```

---

## Troubleshooting

### Map not rendering

**Issue**: White screen or "Uncaught TypeError: Cannot read property 'addTo' of undefined"

**Solution**: Ensure dynamic import with `ssr: false`:

```tsx
const Map = dynamic(() => import('@/components/maps/Map'), { ssr: false })
```

### Tiles not loading

**Issue**: Gray tiles or "403 Forbidden" errors

**Solution**:

1. Check `.env.local` has valid `NEXT_PUBLIC_ARCGIS_API_KEY`
2. Verify API key has proper permissions in ArcGIS dashboard
3. Check browser console for specific error messages

### Drawing tools not appearing

**Issue**: Drawing toolbar missing from map

**Solution**:

1. Verify `leaflet-draw` CSS is imported
2. Check browser console for initialization errors
3. Ensure map is fully initialized before drawing manager

### localStorage not persisting

**Issue**: Drawings disappear on page refresh

**Solution**:

1. Check browser localStorage is enabled
2. Verify `useLeafletDrawings` hook is being used
3. Check for errors in auto-save handler
4. Inspect localStorage in browser DevTools (key: "leaflet-drawings")

### Dark mode styling broken

**Issue**: Leaflet controls look wrong in dark mode

**Solution**: Verify `src/app/globals.css` includes dark mode Leaflet styles

---

## Performance Considerations

1. **Dynamic Import**: Always use `ssr: false` to avoid SSR overhead
2. **localStorage**: Auto-save on every change may impact performance with many drawings
3. **Tile Loading**: Use loading states to improve perceived performance
4. **GeoJSON Size**: Large feature collections may slow down import/export
5. **Popups**: Complex popup templates may affect rendering performance

---

## Future Enhancements

Potential features to add:

- [ ] Search/geocoding integration
- [ ] Measurement tools (distance, area)
- [ ] Drawing templates/presets
- [ ] Layer groups/categories
- [ ] Drawing permissions/sharing
- [ ] Offline support
- [ ] KML/KMZ import/export
- [ ] Print/PDF export
- [ ] Drawing versioning/history
- [ ] Collaborative editing

---

## License

This map component is part of the esri-leaflet project and uses:

- Leaflet (BSD 2-Clause License)
- Esri Leaflet (Apache License 2.0)
- Leaflet Draw (MIT License)
