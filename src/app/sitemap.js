import { getAllPostSlugs, getCategories } from "../lib/sanity-api";
import { siteConfig } from "../lib/site-config";

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap() {
  const [posts, categories] = await Promise.all([
    getAllPostSlugs(),
    getCategories(),
  ]);

  const postUrls = posts.map((post) => ({
    url: `${siteConfig.seo.baseUrl}/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${siteConfig.seo.baseUrl}/category/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: siteConfig.seo.baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
    ...categoryUrls,
  ];
}
