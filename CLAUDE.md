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
│   └── use-mobile.ts      # Mobile detection hook
└── lib/
    └── utils.ts           # Utility functions (cn helper)
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

- **Provider**: `ThemeProvider` wraps the app in `layout.tsx`
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

The project includes `esri-leaflet` (v3.1.0) for Esri/ArcGIS mapping capabilities. Map components are located in `src/components/maps/`.

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
