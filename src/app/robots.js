import { siteConfig } from "../lib/site-config";

export default function robots() {
  return {
    rules: [
      { userAgent: 'GoogleOther', disallow: '/' },
      { userAgent: 'GoogleOther-Image', disallow: '/' },
      { userAgent: 'GoogleOther-Video', disallow: '/' },
      { userAgent: '*', allow: '/', disallow: '/api/' },
    ],
    sitemap: `${siteConfig.seo.baseUrl}/sitemap.xml`,
  }
}
