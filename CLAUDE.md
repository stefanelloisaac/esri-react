# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application integrating Esri Leaflet for mapping functionality, built with React 19, TypeScript, and Tailwind CSS v4. The project uses the shadcn/ui component library with the "new-york" style variant.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Tech Stack

- **Framework**: Next.js 16.0.6 with App Router
- **React**: 19.2.0 (latest)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Mapping**: esri-leaflet library
- **Forms**: react-hook-form with zod validation and @hookform/resolvers
- **Theming**: next-themes for dark/light mode support

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with ThemeProvider
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles with Tailwind v4 theme
├── components/
│   ├── ui/                # shadcn/ui components (50+ components)
│   ├── maps/              # Map-related components
│   ├── layout/            # Layout components (navigation-bar, etc.)
│   └── themes/            # Theme-related components (theme-toggle)
├── providers/             # React context providers
│   └── theme-provider.tsx # next-themes wrapper
├── hooks/                 # Custom React hooks
│   ├── use-mobile.ts      # Mobile detection hook
│   ├── use-leaflet-map.ts # Core Leaflet map initialization
│   ├── use-map-view.ts    # Map view updates
│   ├── use-map-draw.ts    # Drawing tools integration
│   └── use-stable-callback.ts # Stable callback refs
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
└── types/                 # TypeScript type definitions
```

### Import Aliases

TypeScript path aliases are configured in `tsconfig.json`:

- `@/*` → `./src/*`

shadcn/ui specific aliases in `components.json`:

- `@/components` → components
- `@/ui` → components/ui
- `@/lib` → lib
- `@/hooks` → hooks
- `@/utils` → lib/utils

### Styling System

**Tailwind CSS v4** with the following key features:

- Uses `@import "tailwindcss"` instead of config file
- Theme defined via CSS variables in `globals.css`
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Extended color system with semantic tokens (primary, secondary, muted, accent, destructive, etc.)
- Built-in chart colors (chart-1 through chart-5)
- Sidebar-specific color tokens
- Border radius system with sm/md/lg/xl variants

**Component Styling Pattern**:

- All UI components use `class-variance-authority` (cva) for variant management
- The `cn()` utility (from `lib/utils.ts`) merges Tailwind classes using `clsx` and `tailwind-merge`
- Components use Radix UI's `Slot` component for polymorphic rendering via `asChild` prop

### Theme System

- **Provider**: `ThemeProvider` wraps the app in [src/app/layout.tsx](src/app/layout.tsx)
- **Configuration**: Supports "light", "dark", and "system" modes
- **Implementation**: Uses `next-themes` with class-based theme switching
- **Component**: `ThemeToggle` dropdown provides theme selection UI

### shadcn/ui Components

This project has the full shadcn/ui component library installed. Components follow these patterns:

- Client components use `"use client"` directive
- Variants managed through cva with comprehensive variant props
- Accessible by default (built on Radix UI)
- Consistent API with forwarded refs
- Support `asChild` prop for composition

When adding new shadcn/ui components, use:

```bash
npx shadcn@latest add <component-name>
```

### Mapping Integration

The project includes comprehensive mapping functionality using Esri Leaflet with drawing capabilities, boundary management, and localStorage persistence.

#### Required Packages

Map-related dependencies (already installed):

```json
{
  "esri-leaflet": "^3.1.0",
  "esri-leaflet-vector": "^4.3.2",
  "leaflet-draw": "^1.0.4"
}
```

Type definitions:

```json
{
  "@types/leaflet": "^1.9.21",
  "@types/leaflet-draw": "^1.0.13"
}
```

#### Resources

- **ArcGIS Developers**: https://developers.arcgis.com/
- **API Key**: Required in `.env.local` as `NEXT_PUBLIC_ARCGIS_API_KEY`
- **Leaflet Documentation**: https://leafletjs.com/
- **Esri Leaflet**: https://esri.github.io/esri-leaflet/
- **Leaflet Draw**: https://leaflet.github.io/Leaflet.draw/

#### File Structure

The map component follows a modular architecture in `src/components/maps/`:

```
maps/
├── Map.tsx                          # Main orchestrator component
├── _configs/
│   ├── config.ts                    # Constants (center, zoom, bounds)
│   └── options.ts                   # Leaflet & basemap configuration
├── _types/
│   └── index.ts                     # TypeScript interfaces
├── _hooks/
│   ├── index.ts                     # Hook exports
│   ├── use-leaflet-map.ts          # Core map initialization
│   ├── use-leaflet-callback.ts     # Stable callback refs
│   └── use-leaflet-drawings.ts     # localStorage persistence
├── _lib/
│   ├── _draw/
│   │   ├── index.ts                # Drawing exports
│   │   ├── hook.ts                 # useMapDraw hook
│   │   ├── manager.ts              # MapDrawManager class
│   │   ├── templates.ts            # Popup templates
│   │   └── colors.ts               # Drawing color system
│   └── _boundaries/
│       ├── index.ts                # Boundary exports
│       ├── hook.ts                 # useBoundaryManager hook
│       ├── manager.ts              # BoundaryManager class
│       └── data.ts                 # Brazilian state definitions
└── _components/
    ├── MapLoader.tsx               # Loading spinner overlay
    ├── MapBoundarySelector.tsx     # State boundary dropdown
    ├── MapSearchInput.tsx          # Search input component
    ├── MapDrawingControls.tsx      # Drawing controls toolbar
    └── MapColorPicker.tsx          # Color picker for shapes
```

#### Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_ARCGIS_API_KEY=your_api_key_here
```

#### Map Component Architecture

**Composition Pattern**:
The Map component uses a hooks-based architecture where each hook manages a specific concern:

1. **useLeafletMap** - Core map initialization
   - Creates Leaflet map instance
   - Adds Esri vector basemap layer
   - Handles map cleanup on unmount
   - Enforces boundary restrictions (if configured)

2. **useLeafletCallback** - Callback stability
   - Maintains stable references to callbacks across re-renders
   - Prevents unnecessary effect re-runs
   - Uses `useLayoutEffect` for synchronous updates

3. **useLeafletDrawings** - localStorage persistence
   - Auto-saves drawings to localStorage
   - Loads saved drawings on mount
   - Provides clear/export functionality

4. **useMapDraw** - Drawing functionality
   - Initializes `MapDrawManager`
   - Connects drawing events to callbacks
   - Manages draw control lifecycle

5. **useBoundaryManager** - Boundary management
   - Initializes `BoundaryManager`
   - Handles state boundary changes
   - Manages tile loading states

**Manager Classes**:

1. **MapDrawManager** (`_lib/_draw/manager.ts`)
   - Encapsulates Leaflet Draw plugin
   - Manages drawn shapes lifecycle
   - Handles GeoJSON export/import
   - Generates popups with measurements
   - Supports custom drawing colors
   - Localized to Portuguese (pt-BR)

2. **BoundaryManager** (`_lib/_boundaries/manager.ts`)
   - Manages Brazilian state boundaries
   - Handles map panning/zooming to boundaries
   - Tracks tile loading for loading states

#### Map Component Behaviors

**Initialization Flow**:

1. Map container ref is created
2. `useLeafletMap` initializes map with Esri basemap
3. Drawing manager waits for map to be ready (polling with timeout)
4. Boundary manager initializes and applies initial boundary (if provided)
5. Auto-load saved drawings from localStorage
6. Map is marked as ready

**Auto-save Flow**:

1. User creates/edits/deletes a shape
2. Original callback is triggered (if provided)
3. Auto-save handler exports GeoJSON
4. GeoJSON is saved to localStorage
5. Process repeats on every change

**Drawing Flow**:

1. User selects drawing tool (polygon, rectangle, circle, marker)
2. Shape is drawn on map
3. `L.Draw.Event.CREATED` is fired
4. Drawing name is auto-generated (e.g., "0001 - TALHÃO")
5. Color is applied from selected color state
6. Popup is bound with measurements
7. GeoJSON is exported and callback is fired
8. Drawing is auto-saved to localStorage

**Boundary Change Flow**:

1. User selects state from boundary selector
2. `useBoundaryManager` detects change
3. Boundary definition is retrieved from `data.ts`
4. Map pans/zooms to new boundary (with animation if not initial)
5. Loading state is shown during tile load
6. Loading state is cleared when tiles are loaded

#### Code Patterns

**Dynamic Import** (required for SSR compatibility):

```tsx
// In page.tsx
const Map = dynamic(() => import('@/components/maps/Map'), { ssr: false })
```

**Basic Usage**:

```tsx
<Map
  height='100%'
  allowedBoundaries={['sp', 'rj', 'mg']}
  onShapeCreated={(layerType, layer, geoJSON) => {
    console.log('Shape created:', geoJSON)
  }}
  onShapeEdited={(layers) => {
    console.log('Shapes edited')
  }}
  onShapeDeleted={(layers) => {
    console.log('Shapes deleted')
  }}
  onDrawingsExport={(geoJSON) => {
    // Send to database
  }}
/>
```

**Props Interface**:

```tsx
interface MapProps {
  height?: string // Default: "500px"
  center?: [number, number] // Override default center
  zoom?: number // Override default zoom
  className?: string // Additional CSS classes
  onShapeCreated?: (layerType, layer, geoJSON) => void
  onShapeEdited?: (layers) => void
  onShapeDeleted?: (layers) => void
  onDrawingsExport?: (geoJSON) => void
  allowedBoundaries?: string[] // Array of state IDs
}
```

**Measurement Formatting**:

- Areas: hectares (ha) for ≥10,000 m², otherwise m²
- Distances: kilometers (km) for ≥1,000 m, otherwise m
- Coordinates: 4-6 decimal places
- Numbers: Brazilian locale (e.g., "1.234,56")

**Drawing Colors**:
Predefined color system in `_lib/_draw/colors.ts`:

- Each color has: color (border), fillColor, fillOpacity, weight
- Default color is applied on new shapes
- Color picker allows changing active drawing color
- Color is stored in GeoJSON properties for persistence

**Popup Templates**:
Located in `_lib/_draw/templates.ts`:

- Polygon/Rectangle: Shows area, vertex count, coordinate table
- Circle: Shows radius, area, center coordinates
- Marker: Shows position coordinates
- All templates support custom naming

**Localization**:

- Drawing controls: Portuguese tooltips and labels
- Measurements: Brazilian number formatting
- Auto-generated names: Portuguese (e.g., "TALHÃO")

#### Common Tasks

**Adding a new drawing shape**:

1. Update `createDrawControl()` in `MapDrawManager`
2. Add shape type to draw configuration
3. Create popup template in `templates.ts`
4. Add type guard in `getLayerType()`
5. Handle in `bindPopupToLayer()`

**Adding a new boundary**:

1. Add boundary definition to `BOUNDARIES` in `_lib/_boundaries/data.ts`
2. Include center coordinates, bounds, and default zoom
3. Boundary ID is automatically available in dropdown

**Customizing map appearance**:

1. Light/dark mode styles: `src/app/globals.css` (Leaflet-specific styles)
2. Basemap style: Change `BASEMAP_STYLE` in `_configs/config.ts`
3. Drawing colors: Modify `DRAW_COLORS` in `_lib/_draw/colors.ts`

**Extending map functionality**:

1. Create new hook in `_hooks/`
2. Export from `_hooks/index.ts`
3. Integrate in `Map.tsx`
4. Add corresponding manager class in `_lib/` if needed

### Forms Pattern

Forms use the following stack:

- `react-hook-form` for form state management
- `zod` (v4.1.13) for schema validation
- `@hookform/resolvers` for zod integration
- shadcn/ui `form` component for consistent form UI

### ESLint Configuration

Uses Next.js ESLint config with TypeScript support:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Global ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- JSX: react-jsx
- Module resolution: bundler
- Path mapping: `@/*` → `./src/*`

## Key Patterns

### Creating New Components

1. Use TypeScript with proper typing
2. Follow shadcn/ui patterns for consistency
3. Use `cn()` utility for className merging
4. Apply variants with `class-variance-authority`
5. Mark client components with `"use client"` directive

### Adding New Pages

1. Create in `src/app/` directory following App Router conventions
2. Use Server Components by default
3. Add Client Components only when needed (interactivity, hooks, context)

### Styling Guidelines

- Use Tailwind CSS classes
- Reference theme colors via CSS variables (e.g., `bg-primary`, `text-foreground`)
- Follow the established design system tokens
- Use the `cn()` utility for conditional classes

### Working with Maps

1. **Map Component**: Use the `Map` component from `@/components/maps/Map`
2. **Drawing Callbacks**: Pass `onShapeCreated`, `onShapeEdited`, `onShapeDeleted` props for shape events
3. **Customization**: Modify map constants in `Map.config.ts` for bounds/defaults
4. **Bounds Restriction**: Map is currently configured for Brazil bounds, panning is restricted
5. **Leaflet Styles**: Always import `leaflet/dist/leaflet.css` when using Leaflet components
