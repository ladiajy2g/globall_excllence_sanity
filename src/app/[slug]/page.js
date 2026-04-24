import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getCategoryPosts } from "../../lib/sanity-api";
import { client } from "../../lib/sanity";
import { notFound } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import AdvertSection from "../../components/AdvertSection";
import Breadcrumbs from "../../components/Breadcrumbs";
import PostNavigation from "../../components/PostNavigation";
import RelatedStories from "../../components/RelatedStories";
import FloatingShare from "../../components/FloatingShare";
import { siteConfig } from "../../lib/site-config";
import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative aspect-[16/10] my-8 overflow-hidden bg-gray-100">
        <Image src={value.asset.url} alt="Article image" fill className="object-cover" />
      </div>
    ),
    youtube: ({ value }) => {
      const { url } = value
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop()
      return (
        <div className="aspect-video my-8">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )
    }
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: {
      absolute: siteConfig.seo.titleTemplate.replace("%s", post.title),
    },
    description: post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160) || `Explore the latest stories from ${siteConfig.identity.name}.`,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160),
      images: [post.featuredImage?.node?.sourceUrl].filter(Boolean),
      publishedTime: post.date,
      authors: [post.author?.node?.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160),
      images: [post.featuredImage?.node?.sourceUrl].filter(Boolean),
    },
  };
}

export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) [0..50] { "slug": slug.current }`);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = post.categories?.nodes[0];
  const relatedData = category ? await getCategoryPosts(category.slug, 5) : { posts: [] };
  const relatedPosts = relatedData.posts.filter(p => p.slug !== slug);

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [post.featuredImage?.node?.sourceUrl].filter(Boolean),
    "datePublished": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author?.node?.name || siteConfig.identity.name + " Admin",
      "url": siteConfig.seo.baseUrl
    }],
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.identity.name,
      "logo": {
        "@type": "ImageObject",
        "url": siteConfig.seo.baseUrl + siteConfig.identity.logoUrl
      }
    },
    "description": post.excerpt?.replace(/<[^>]*>/g, "").slice(0, 160)
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch (e) { return dateStr; }
  };

  return (
    <article className="w-full bg-white pb-20 font-roboto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />

      <FloatingShare post={post} />

      {/* --- Article Header Area --- */}
      <div className="w-[95%] xl:w-[85%] mx-auto px-4 pt-12 pb-10">
        <div className="max-w-5xl">
          {category && (
            <Link 
              href={`/category/${category.slug}`}
              className="inline-block bg-brand-primary text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:bg-black transition-colors"
            >
              {category.name}
            </Link>
          )}
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-8 text-[#222222] italic">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden relative border border-gray-100">
                <Image 
                  src={post.author?.node?.avatar?.url || "/placeholder-author.jpg"} 
                  alt={post.author?.node?.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <span>By <span className="text-[#222222]">{post.author?.node?.name || "Global Excellence"}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Body --- */}
      <div className="w-[95%] xl:w-[85%] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Article CONTENT (Left 8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {post.featuredImage?.node?.sourceUrl && (
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )}

            {/* Main Video Embed */}
            {post.videoUrl && (
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${post.videoUrl.split('v=')[1]?.split('&')[0] || post.videoUrl.split('/').pop()}`}
                  title="Main YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="prose max-w-none prose-p:font-open-sans prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-gray-700 prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
               <PortableText value={post.body} components={portableTextComponents} />
            </div>

            {/* AUTHOR BOX */}
            <div className="bg-gray-50 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start border border-gray-100 mt-10">
               <div className="w-32 h-32 rounded-full overflow-hidden relative shrink-0 border-4 border-white shadow-sm">
                  <Image src={post.author?.node?.avatar?.url || "/placeholder-author.jpg"} alt={post.author?.node?.name} fill className="object-cover" />
               </div>
               <div className="flex flex-col gap-4 text-center md:text-left">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Written By</span>
                     <h4 className="text-2xl font-black text-[#222222] uppercase italic">{post.author?.node?.name || "Global Excellence"}</h4>
                  </div>
                  <p className="text-gray-500 font-open-sans text-[14px] leading-relaxed">
                     Global Excellence Magazine is Nigeria's foremost soft-sell magazine, delivering premium news, lifestyle, and society updates for over two decades.
                  </p>
               </div>
            </div>

            {/* Related Stories below content */}
            <div className="mt-12">
                <div className="relative border-b-2 border-gray-100 pb-2 flex items-center mb-8">
                  <h2 className="text-sm font-black tracking-wider text-[#222222]">Related Stories</h2>
                  <div className="absolute -bottom-[2px] left-0 w-12 h-[2px] bg-brand-primary"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPosts.slice(0, 4).map((rp, idx) => (
                        <Link key={idx} href={`/${rp.slug}`} className="group flex flex-col gap-4">
                            <div className="relative aspect-video overflow-hidden bg-gray-100">
                                <Image src={rp.featuredImage?.node?.sourceUrl || siteConfig.identity.logoUrl} alt={rp.title} fill className="object-cover transition-transform group-hover:scale-105" />
                            </div>
                            <h4 className="text-[15px] font-black text-[#222222] leading-tight group-hover:text-red-600 transition-colors italic line-clamp-2">
                              {rp.title}
                            </h4>
                        </Link>
                    ))}
                </div>
            </div>
          </div>

          {/* SIDEBAR (Right 4 Cols - Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <Sidebar showAdverts={true} />
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}