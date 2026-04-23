---
name: sanity-migration-pro
description: Professional migration from WordPress to Sanity.io. Use when Gemini CLI needs to migrate blog posts, categories, and media from a WPGraphQL backend to a Sanity Studio, ensuring SEO preservation and image optimization.
---

# Sanity Migration Pro

This skill provides a high-performance workflow for migrating WordPress content to Sanity.io.

## Workflow

1. **Analyze WP Source**: Fetch categories and sample posts via WPGraphQL to map fields.
2. **Setup Sanity infrastructure**:
   - Create project/dataset via API.
   - Define schemas for `post`, `category`, `author`, and `advert`.
3. **Execute Migration**:
   - Batch migrate categories first.
   - Convert HTML to Portable Text using `jsdom` and `@sanity/block-tools`.
   - Re-host images directly on Sanity CDN.
   - Preserve WordPress Database IDs as Sanity `_ids` for idempotency and SEO integrity.
4. **Wire Frontend**: Update Next.js API layer to use GROQ with optimized single-batch queries.

## Best Practices

- **SEO Protection**: Always map the original WP slug to `slug.current`.
- **Image Optimization**: Upload only primary source images; let Sanity handle thumbnails.
- **Performance**: Use single GROQ queries with projection blocks instead of multiple fetches.
- **Resilience**: Implement batching and error handling for image uploads to handle large media folders.

## Code Patterns

### Portable Text Component
```javascript
import { PortableText } from '@portabletext/react'
const components = {
  types: {
    youtube: ({ value }) => <iframe src={`https://www.youtube.com/embed/${id}`} ... />,
    image: ({ value }) => <Image src={value.asset.url} ... />
  }
}
```

### Optimized GROQ
```groq
{
  "featured": *[_type == "post" && "news" in categories[]->slug.current] | order(date desc)[0],
  "ticker": *[_type == "post"] | order(date desc)[0..5] { title, "slug": slug.current }
}
```
