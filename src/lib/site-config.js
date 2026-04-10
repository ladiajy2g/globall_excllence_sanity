/**
 * Site Configuration for Headless Media Boilerplate
 * Centralizes all brand identity, layout preferences, and technical slugs.
 */

export const siteConfig = {
  // --- Brand Identity ---
  identity: {
    name: "Global Excellence",
    tagline: "The magazine of first choice for quality information, education and entertainment.",
    logoUrl: "/Global-Excellence-logo-300x89.jpg",
    logoAlt: "Global Excellence Logo",
    faviconUrl: "/icon.png",
  },

  // --- Theme ---
  theme: {
    primaryColor: "#4db2ec", 
    secondaryColor: "brand-secondary",
    fontSans: "var(--font-open-sans)",
    fontHeading: "var(--font-roboto)",
  },

  // --- SEO & Social ---
  seo: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://globalexcellenceonline.com",
    titleTemplate: "%s | Global Excellence",
    defaultDescription: "Global Excellence - The magazine of first choice for quality information, education and entertainment in Nigeria.",
    keywords: ["Global Excellence", "Nigerian News", "Politics", "Entertainment", "Lifestyle", "Journalism"],
    author: "Global Excellence Editorial Team",
    twitterHandle: "@globalexcellence",
    facebookUrl: "https://facebook.com/globalexcellence",
  },

  // --- Contact & API ---
  contact: {
    newsletterFrom: "Global Excellence <newsletter@globalexcellenceonline.com>",
    notificationEmail: "azuhamtus@yahoo.com",
  },

  // --- Home Layout Registry ---
  // Define hero type and homepage sections dynamically
  homeLayout: {
    heroType: "editorial-grid",
    heroConfig: {
      featured: "news",
      fresh: "politics",
      stacked: "crime",
      popular: "showbizplus",
    },
    sections: [
      {
        id: "section-1",
        title: "Latest News",
        categorySlug: "news",
        layoutType: "featured-grid",
        limit: 6,
        iconColor: "brand-primary",
      },
      {
        id: "section-2",
        title: "Politics",
        categorySlug: "politics",
        layoutType: "grid",
        limit: 8,
        iconColor: "brand-primary",
      },
      {
        id: "section-3",
        title: "Showbiz",
        categorySlug: "showbizplus",
        layoutType: "horizontal",
        limit: 6,
        iconColor: "brand-primary",
      },
    ],
  },

  // --- Technical Defaults ---
  defaults: {
    postsPerPage: 12,
    revalidateSeconds: 60,
  },
};
