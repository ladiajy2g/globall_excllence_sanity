import { client } from './sanity'
import { cache } from 'react'

const postFields = `
  title,
  "slug": slug.current,
  "date": publishedAt,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..200], "") + "...",
  "featuredImage": {
    "node": {
      "sourceUrl": mainImage.asset->url
    }
  },
  "author": {
    "node": {
      "name": author->name,
      "avatar": { "url": author->image.asset->url }
    }
  },
  "categories": {
    "nodes": categories[]->{
      name,
      "slug": slug.current
    }
  }
`

export const getHeroData = cache(async function getHeroData(config = {}) {
  const { 
    featured = "news",
    fresh = "politics", 
    stacked = "crime", 
    popular = "showbiz" 
  } = config;

  const data = await client.fetch(`
    {
      "featured": *[_type == "post" && count(categories[@->slug.current == $featured]) > 0] | order(publishedAt desc) [0] { ${postFields} },
      "fresh": *[_type == "post" && count(categories[@->slug.current == $fresh]) > 0] | order(publishedAt desc) [0..5] { ${postFields} },
      "stacked": *[_type == "post" && count(categories[@->slug.current == $stacked]) > 0] | order(publishedAt desc) [0..1] { ${postFields} },
      "popular": *[_type == "post" && count(categories[@->slug.current == $popular]) > 0] | order(publishedAt desc) [0..4] { ${postFields} },
      "ticker": *[_type == "post"] | order(publishedAt desc) [0..4] { title, "slug": slug.current }
    }
  `, { featured, fresh, stacked, popular })

  const big = data.featured || data.fresh?.[0] || null

  return {
    big,
    fresh: (data.fresh || []).filter(p => p.slug !== big?.slug),
    stacked: data.stacked || [],
    popular: data.popular || [],
    ticker: data.ticker || [],
  }
})

export const getHomeSections = cache(async function getHomeSections(sections = []) {
  const result = {}
  // Fetch all sections in parallel
  const sectionQueries = sections.map(s => `
    "${s.id}": *[_type == "post" && count(categories[@->slug.current == "${s.categorySlug}"]) > 0] | order(publishedAt desc) [0..${(s.limit || 6) - 1}] {
      ${postFields}
    }
  `).join(',')

  const data = await client.fetch(`{ ${sectionQueries} }`)
  return data
})

export const getCategories = cache(async function getCategories() {
  return client.fetch(`*[_type == "category"]{ "name": title, "slug": slug.current }`)
})

export const getPostBySlug = cache(async function getPostBySlug(slug) {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      "date": publishedAt,
      body,
      videoUrl,
      "featuredImage": {
        "node": {
          "sourceUrl": mainImage.asset->url
        }
      },
      "author": {
        "node": {
          "name": author->name,
          "avatar": { "url": author->image.asset->url }
        }
      },
      "categories": {
        "nodes": categories[]->{
          name,
          "slug": slug.current
        }
      }
    }
  `, { slug })
})

export const getAdvertsByPlacement = cache(async function getAdvertsByPlacement(placementSlug, first = 5) {
  return client.fetch(`
    *[_type == "advert" && placement == $placement] | order(_createdAt desc) [0..${first - 1}]{
      title,
      adLink,
      adVideoUrl,
      "featuredImage": {
        "node": {
          "sourceUrl": featuredImage.asset->url,
          "altText": featuredImage.alt,
          "mediaDetails": {
            "width": featuredImage.asset->metadata.dimensions.width,
            "height": featuredImage.asset->metadata.dimensions.height
          }
        }
      }
    }
  `, { placement: placementSlug })
})

export const getCategoryPosts = cache(async function getCategoryPosts(slug, first = 12) {
  // --- Slug Mapping for Pretty URLs (Match WordPress Legacy) ---
  const slugMap = {
    "cover": "cover-stories",
    "society-and-fashion": "society"
  };
  const targetSlug = slugMap[slug] || slug;

  const posts = await client.fetch(`
    *[_type == "post" && count(categories[@->slug.current == $targetSlug]) > 0] | order(publishedAt desc) [0..${first - 1}] {
      ${postFields}
    }
  `, { targetSlug })
  
  const category = await client.fetch(`*[_type == "category" && slug.current == $targetSlug][0]`, { targetSlug })

  return {
    name: category?.title || slug,
    posts: posts || []
  }
})

export const getLatestPosts = cache(async function getLatestPosts(first = 5) {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) [0..${first - 1}] {
      ${postFields}
    }
  `)
})

export const getAllPostSlugs = cache(async function getAllPostSlugs() {
  return client.fetch(`*[_type == "post"]{ "slug": slug.current, "date": publishedAt }`)
})

