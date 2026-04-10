# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Knowledge Base: Daylight NG

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Backend**: WordPress with WPGraphQL plugin
- **Data Fetching**: GraphQL queries via `src/lib/wp-api.js` (ISR with revalidation)
- **Styling**: Tailwind CSS v4

## Project Structure

```
src/
├── app/
│   ├── layout.js          # Global layout with top-banner & footer-banner adverts
│   ├── page.js            # Homepage with hero-bottom, between-sections, home-grid adverts
│   ├── [slug]/page.js     # Single post page with article-sidebar adverts
│   └── category/[slug]/page.js  # Category pages using Sidebar component
├── components/
│   ├── AdvertSection.jsx # Core advert component with multiple layout types
│   ├── Sidebar.jsx        # Reusable sidebar (used in posts & categories)
│   ├── Footer.jsx         # Footer component
│   └── ...
└── lib/
    └── wp-api.js          # WordPress API functions including getAdvertsByPlacement
```

## Advert System

### How It Works

Adverts are stored in WordPress as a custom post type, with a taxonomy called `ad_placements` that defines where ads appear (e.g., "top-banner", "article-sidebar").

The `getAdvertsByPlacement(placementSlug, limit)` function in `wp-api.js` queries WordPress via GraphQL to fetch adverts assigned to a specific placement.

### Available Ad Placements

| Placement Slug | Used In | Layout |
|---------------|---------|--------|
| `top-banner` | layout.js (global) | grid (6 max) |
| `footer-banner` | layout.js (global) | stack |
| `hero-bottom` | page.js (homepage) | stack |
| `between-sections` | page.js (homepage) | stack |
| `home-grid` | page.js (homepage) | grid |
| `article-sidebar` | Sidebar.jsx (all pages with sidebar) | sidebar |

### Layout Types (in AdvertSection.jsx)

- **grid**: 3 columns × 2 rows (6 slots), hides empty rows
- **stack**: Vertical stacking of wide banners
- **sidebar**: Vertical stacking of portrait banners
- **wide**: Single wide banner
- **footer**: Single centered banner (any size)

### Ad Fields (WordPress)

- `title`: Ad name
- `featuredImage`: Banner image (required for display)
- `adLink`: Click-through URL
- `adVideoUrl`: YouTube URL (supports youtube.com/watch?v=, youtu.be/, embed URLs)
- `adPlacements`: Taxonomy assignment (which placement(s) the ad belongs to)

### Key Implementation Details

1. **AdvertSection Component** (`src/components/AdvertSection.jsx`):
   - Async server component
   - Fetches adverts via `getAdvertsByPlacement`
   - Renders AdSlot sub-component that handles image or YouTube video
   - YouTube extraction supports multiple URL formats
   - Returns null silently if no adverts or no featured image

2. **Placement in Sidebar** (`src/components/Sidebar.jsx`):
   - Added `<AdvertSection placement="article-sidebar" layout="sidebar" />`
   - Reusable across single posts and category pages
   - Placed at top of sidebar for maximum visibility

3. **Moving Ad from Footer** (`src/app/layout.js`):
   - Originally advert was inside Footer component
   - Moved to before Footer (outside the footer background) for proper separation
   - Both top-banner (grid) and footer-banner (stack) added to layout

## WordPress Setup Required

For the advert system to work, WordPress needs:

1. **Plugins**:
   - WPGraphQL (for GraphQL API)
   - Custom post type registered for adverts
   - `ad_placements` taxonomy for placement slugs

2. **Custom code in functions.php**:
   - Register `advert` post type
   - Register `ad_placements` taxonomy
   - Add meta box for `adLink`, `adVideoUrl` fields

3. **Adverts in WordPress**:
   - Create adverts with featured images
   - Assign correct placement slug (e.g., "article-sidebar")
   - Without both featured image AND placement, advert won't show