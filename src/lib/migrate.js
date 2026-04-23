import { createClient } from '@sanity/client'
import fetch from 'node-fetch'
import { htmlToBlocks } from '@sanity/block-tools'
import { Schema } from '@sanity/schema'
import { JSDOM } from 'jsdom'
import postSchema from '../../sanity/schemas/post.js'
import categorySchema from '../../sanity/schemas/category.js'
import authorSchema from '../../sanity/schemas/author.js'
import advertSchema from '../../sanity/schemas/advert.js'

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: 'eak1a0g6',
  dataset: 'production',
  token: 'skH32UcLmsZ4UzpjIskGx3SUUyxi8QAnMbMoFzoMF6X9X0tN3rcMA5rs972t75n9AiYkFZs7IGGtraSv0',
  useCdn: false,
  apiVersion: '2023-05-03',
})

// Setup Schema for block-tools
const defaultSchema = Schema.compile({
  name: 'mySchema',
  types: [postSchema, categorySchema, authorSchema, advertSchema],
})
const blockContentType = defaultSchema.get('post').fields.find((field) => field.name === 'body').type

const WP_URL = 'https://backend.globalexcellenceonline.com/graphql'

const TARGET_CATEGORIES = [
  'opinion', 'breaking', 'brands', 'lifestyle'
]

async function fetchFromWP(query, variables = {}) {
  const res = await fetch(WP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  return json.data
}

async function uploadImage(url) {
  if (!url) return null
  try {
    const res = await fetch(url)
    const buffer = await res.buffer()
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: url.split('/').pop()
    })
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id }
    }
  } catch (err) {
    console.error(`   ❌ Image upload failed: ${url}`)
    return null
  }
}

async function migrate() {
  console.log('🚀 Starting Surgical Migration to Sanity...')

  // 1. Migrate Categories
  console.log('--- Migrating Categories ---')
  const catData = await fetchFromWP(`{ categories(first: 100) { nodes { name slug databaseId } } }`)
  const filteredCats = catData.categories.nodes.filter(c => TARGET_CATEGORIES.includes(c.slug))
  
  for (const cat of filteredCats) {
    await sanityClient.createOrReplace({
      _type: 'category',
      _id: `category-${cat.databaseId}`,
      title: cat.name,
      slug: { _type: 'slug', current: cat.slug }
    })
    console.log(`   ✅ Category: ${cat.name}`)
  }

  // 2. Migrate Posts
  console.log('\n--- Migrating Essential Posts ---')
  for (const slug of TARGET_CATEGORIES) {
    console.log(`\n📂 Processing: ${slug}`)
    const postData = await fetchFromWP(`
      query GetPosts($slug: String!) {
        posts(first: 20, where: { categoryName: $slug }) {
          nodes {
            databaseId
            title
            slug
            date
            content
            featuredImage { node { sourceUrl } }
            author { node { name databaseId } }
            categories { nodes { databaseId } }
          }
        }
      }
    `, { slug })

    if (!postData?.posts?.nodes) continue

    for (const wpPost of postData.posts.nodes) {
      // 2a. Convert HTML to Blocks
      const blocks = htmlToBlocks(wpPost.content, blockContentType, {
        parseHtml: (html) => new JSDOM(html).window.document,
      })

      // 2b. Upload Main Image
      const mainImage = await uploadImage(wpPost.featuredImage?.node?.sourceUrl)

      // 2c. Create Document
      const doc = {
        _type: 'post',
        _id: `post-${wpPost.databaseId}`,
        title: wpPost.title,
        slug: { _type: 'slug', current: wpPost.slug },
        publishedAt: wpPost.date,
        mainImage,
        categories: wpPost.categories.nodes
          .filter(c => filteredCats.some(fc => fc.databaseId === c.databaseId))
          .map(c => ({ _type: 'reference', _ref: `category-${c.databaseId}`, _key: `cat-${c.databaseId}` })),
        body: blocks
      }

      await sanityClient.createOrReplace(doc)
      console.log(`   📄 Migrated: ${wpPost.title}`)
    }
  }

  console.log('\n✨ Migration finished successfully!')
}

async function migrateAdverts() {
  console.log('\n🚀 Starting Advert Migration...')
  const data = await fetchFromWP(`
    {
      adverts(first: 50) {
        nodes {
          databaseId
          title
          adLink
          adVideoUrl
          adPlacements { nodes { slug } }
          featuredImage { node { sourceUrl } }
        }
      }
    }
  `)

  for (const ad of data.adverts.nodes) {
    const mainImage = await uploadImage(ad.featuredImage?.node?.sourceUrl)
    const doc = {
      _type: 'advert',
      _id: `advert-${ad.databaseId}`,
      title: ad.title,
      adLink: ad.adLink,
      adVideoUrl: ad.adVideoUrl,
      placement: ad.adPlacements?.nodes?.[0]?.slug || 'top-banner',
      featuredImage: mainImage
    }
    await sanityClient.createOrReplace(doc)
    console.log(`   📺 Advert migrated: ${ad.title}`)
  }
  console.log('✅ Adverts migrated successfully!')
}

async function run() {
  await migrate()
  await migrateAdverts()
}

run().catch(console.error)
