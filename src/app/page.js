import HeroSection from "../components/HeroSection";
import SectionLayout from "../components/SectionLayout";
import AdvertSection from "../components/AdvertSection";
import TrendingTicker from "../components/TrendingTicker";
import NewsBlock from "../components/NewsBlock";
import { getHeroData, getHomeSections, getCategories } from "../lib/wp-api";
import { siteConfig } from "../lib/site-config";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const { homeLayout } = siteConfig;

  // 1. Fetch Data
  const [heroData, allCategories] = await Promise.all([
    getHeroData(homeLayout.heroConfig || {}),
    getCategories()
  ]);

  const activeCategories = (allCategories || []).filter(cat => 
    cat?.slug && cat.slug !== "uncategorized" && cat.slug !== "featured"
  );

  const prioritizedSlugs = ["news", "politics", "interview", "showbizplus", "crime", "society-and-fashion", "sport", "world"];
  
  const allSections = prioritizedSlugs
    .map((slug) => {
      const cat = activeCategories.find(c => c.slug === slug);
      if (!cat) return null;
      return {
        id: cat.slug,
        title: cat.name,
        slug: cat.slug,
      };
    })
    .filter(Boolean);

  const sectionPosts = await getHomeSections(allSections.map(s => ({
    categorySlug: s.slug,
    limit: 6
  })));

  // Combine fresh and stacked for the ticker
  const tickerPosts = heroData ? [...(heroData.fresh || []), ...(heroData.stacked || [])] : [];

  return (
    <div className="flex flex-col min-h-screen bg-white font-roboto overflow-hidden">
      <main className="flex-1 w-full flex flex-col">
        
        {/* 1. TRENDING TICKER */}
        {tickerPosts && tickerPosts.length > 0 && <TrendingTicker posts={tickerPosts} />}

        {/* 2. HERO SECTION (BIG GRID) */}
        {heroData?.big && <HeroSection data={heroData} />}

        {/* 3. MAIN CONTENT GRID (Sidebar and Main Area) */}
        <div className="w-[95%] xl:w-[85%] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          
          {/* LEFT CONTENT (70%) */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* FIRST BLOCK: NEWS */}
            <NewsBlock 
              title="Latest News" 
              posts={sectionPosts["news"]} 
              color="#4db2ec" 
              href="/category/news"
            />

            {/* ADVERT: BETWEEN SECTIONS */}
            <AdvertSection placement="between-sections" layout="stack" className="mb-16" />

            {/* SECOND BLOCK: POLITICS */}
            <NewsBlock 
              title="Politics" 
              posts={sectionPosts["politics"]} 
              color="#222222" 
              href="/category/politics"
            />

            {/* GRID SECTIONS (SHOWBIZ, INTERVIEW) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
               <NewsBlockSmall 
                  title="Showbiz" 
                  posts={sectionPosts["showbizplus"]} 
                  color="#4db2ec"
               />
               <NewsBlockSmall 
                  title="Interview" 
                  posts={sectionPosts["interview"]} 
                  color="#222222"
               />
            </div>

            {/* REMAINING SECTIONS */}
            {allSections.slice(4).map((section) => {
              const posts = sectionPosts[section.slug];
              if (!posts || posts.length < 1) return null;
              return (
                <NewsBlock 
                  key={section.id}
                  title={section.title} 
                  posts={posts} 
                  color="#222222"
                  href={`/category/${section.slug}`}
                />
              );
            })}
          </div>

          {/* RIGHT SIDEBAR (30%) */}
          <aside className="lg:col-span-4 flex flex-col gap-12">
             
             {/* SIDEBAR WIDGET: STAY CONNECTED */}
             <div className="flex flex-col gap-6">
                <div className="relative border-b-2 border-gray-100 pb-2 flex items-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#222222]">Stay Connected</h3>
                  <div className="absolute -bottom-[2px] left-0 w-12 h-[2px] bg-brand-primary"></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <Link href={siteConfig.seo.facebookUrl} className="flex items-center justify-between p-4 bg-[#3b5998] text-white hover:opacity-90 transition-opacity">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Facebook</span>
                      </div>
                   </Link>
                   <Link href={"https://twitter.com/" + siteConfig.seo.twitterHandle.replace("@", "")} className="flex items-center justify-between p-4 bg-[#1da1f2] text-white hover:opacity-90 transition-opacity">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                        <span className="text-[11px] font-black uppercase tracking-widest">Twitter</span>
                      </div>
                   </Link>
                </div>
             </div>

             {/* SIDEBAR WIDGET: ADVERT */}
             <div className="sticky top-24">
                <AdvertSection placement="article-sidebar" layout="sidebar" />
             </div>

             {/* SIDEBAR WIDGET: POPULAR POSTS */}
             <div className="flex flex-col gap-8">
                <div className="relative border-b-2 border-gray-100 pb-2 flex items-center">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#222222]">Popular Posts</h3>
                  <div className="absolute -bottom-[2px] left-0 w-12 h-[2px] bg-brand-primary"></div>
                </div>
                <div className="flex flex-col gap-6">
                   {tickerPosts.slice(0, 5).map((post, idx) => (
                      <Link key={idx} href={`/${post.slug}`} className="group flex gap-4 items-start">
                         <div className="relative w-20 h-16 shrink-0 overflow-hidden bg-gray-100">
                            <Image 
                              src={post.featuredImage?.node?.sourceUrl || siteConfig.identity.logoUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                         </div>
                         <div className="flex flex-col gap-1 flex-1">
                            <h4 className="text-[12px] font-bold text-[#222222] leading-snug group-hover:text-brand-primary transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>

          </aside>
        </div>
      </main>
    </div>
  );
}

function NewsBlockSmall({ title, posts = [], color = "#222222" }) {
  if (!posts || posts.length === 0) return null;
  const main = posts[0];
  const list = posts.slice(1, 4);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative border-b-2 border-gray-100 pb-2 flex items-center">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-[#222222]">{title}</h3>
        <div className="absolute -bottom-[2px] left-0 w-12 h-[2px]" style={{ backgroundColor: color }}></div>
      </div>
      <div className="flex flex-col gap-6">
        <Link href={`/${main.slug}`} className="group flex flex-col gap-4">
           <div className="relative aspect-video overflow-hidden bg-gray-100">
              <Image src={main.featuredImage?.node?.sourceUrl || siteConfig.identity.logoUrl} alt={main.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
           </div>
           <h4 className="text-[16px] font-black text-[#222222] leading-tight group-hover:text-brand-primary transition-colors uppercase italic line-clamp-2" dangerouslySetInnerHTML={{ __html: main.title }} />
        </Link>
        <div className="flex flex-col gap-4">
           {list.map((post, idx) => (
              <Link key={idx} href={`/${post.slug}`} className="group border-t border-gray-100 pt-4 flex flex-col gap-1">
                 <h5 className="text-[13px] font-bold text-[#222222] leading-snug group-hover:text-brand-primary transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </Link>
           ))}
        </div>
      </div>
    </div>
  );
}
