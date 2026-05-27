# Ticket Validation Site - Agent Instructions

## Quick Start

**Tech Stack**: Next.js 16.2.6 + React 19 + TypeScript + Tailwind CSS v4

**Dev commands**:
```bash
npm run dev      # localhost:3000 (or next available port)
npm run build    # Production build
npm run lint     # ESLint check
```

## Project Overview

**Purpose**: QR-based payment receipt validator. Users scan a QR code to view ticket details with payment status and hash validation.

**Key pages**:
- `/` — Home: Logo + description + QR scanner entry point
- `/qr?n=…&c=…&f=…&t=…&i=…&h=…` — Receipt display page

**URL parameter schema** (passed from QR):
```
n  → nombre (company name)
c  → cuenta (account number)
f  → fecha (date in YYYYMMDD format)
t  → monto (amount in currency)
i  → folio (receipt ID)
h  → hash (validation hash)
```

## Architecture

### Component Structure
- **Server components** (App Router): `page.tsx` files parse query params, fetch data
- **Client components** ("use client"): QRScanner, TicketCard handle user interaction and modals
- **Type exports**: TicketData interface exported from TicketCard.tsx

### Data Flow
1. User scans QR → QRScanner captures URL string
2. Router navigates to `/qr?...` with encoded params
3. Server component (page.tsx) parses params, formats dates
4. TicketCard renders receipt with modal for "Generar Factura"

### Key Files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Home: logo + QR scanner |
| `src/components/QRScanner.tsx` | html5-qrcode wrapper, camera input |
| `src/components/TicketCard.tsx` | Receipt UI, modal, data display |
| `src/app/qr/page.tsx` | URL param parsing, TicketData preparation |

## Conventions & Patterns

### Language & Localization
- **UI text**: Spanish (es-MX) — buttons, labels, descriptions
- **Currency formatting**: `Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })`
- **Date format**: Input `YYYYMMDD` → Output `DD/MM/YYYY`

### Styling
- **Framework**: Tailwind CSS v4 (PostCSS-based, see `postcss.config.mjs`)
- **Color palette**: Gray tones (`gray-50` to `gray-900`), blue accents for buttons
- **Component styling**: `rounded-lg`, `shadow-md`, flex-based layouts
- **Responsive**: `max-w-sm`, `p-6`, mobile-first (existing)

### Component Patterns
1. **Server components** use `async` for data prep, pass static props to clients
2. **Client components** marked with `"use client"` at top, use `useState`, `useRouter`, `useRef`
3. **Modals**: Fixed overlay (transparent bg), centered content, dismiss button
4. **Helper functions**: `formatMonto()`, `formatFecha()` at component level; `getString()` for param extraction

### Naming
- **Components**: PascalCase (`TicketCard`, `QRScanner`)
- **Interfaces**: `TicketData` (exported from TicketCard)
- **Functions**: camelCase (`formatFecha`, `getString`)
- **Files**: kebab-case (`qr-scanner.tsx`) or PascalCase match export

### Imports & Paths
- Use path alias `@/components`, `@/app` (see `tsconfig.json`)
- Import Next.js components: `Image`, `Link`, `useRouter` from standard exports
- Avoid relative `../../../` paths

## Common Tasks

### Adding a new ticket field
1. Add to `TicketData` interface in `TicketCard.tsx`
2. Parse in `ticket/page.tsx` using `getString()` or `parseFloat()`
3. Add `<Row label="…" value={…} />` in TicketCard render

### Modifying QR scanner behavior
- Edit `src/components/QRScanner.tsx` (`showModal` state, `startScanning`, `stopScanning`)
- html5-qrcode docs: adjust `fps`, `qrbox` dimensions, aspect ratio in scanner config

### Styling updates
- Check `src/app/globals.css` for Tailwind theme overrides
- Tailwind utilities: `bg-*`, `text-*`, `rounded-*`, `shadow-*`, `flex`, `gap-*`
- Custom fonts: Consolas (currently set), configured in layout.tsx

## Known Patterns

- **Date input format**: YYYYMMDD (QR-safe, compact) → formatFecha converts to DD/MM/YYYY for display
- **Modal overlay**: `bg-black bg-opacity-20` (transparent) + fixed positioning
- **QR redirect**: Scanner captures full URL string, `router.push()` navigates directly
- **Type safety**: TypeScript strict mode; pass TicketData as spread props `{...ticketData}`

---

## Next.js 16 Breaking Changes ⚠️

This is NOT the Next.js you know. APIs, conventions, and file structure may differ from your training data. Before writing new code:
1. Read `node_modules/next/dist/docs/` for current patterns
2. Check deprecation notices in terminal output
3. Verify component lifecycle (Server vs Client) matches intent

**Common gaps from older Next.js**:
- App Router (not Pages Router) — use `app/` directory
- `async`/`await` in Server components (no getServerSideProps)
- "use client" required for browser APIs, hooks, event handlers
- Image optimization: use `next/image` with explicit width/height

---
