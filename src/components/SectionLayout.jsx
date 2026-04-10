"use client";

import PostCard from "./PostCard";
import SectionHeader from "./SectionHeader";
import { 
  MustReadLayout, 
  BusinessListLayout, 
  TechnologyGridLayout, 
  SidebarStackLayout,
  UnifiedThreeColumnLayout,
  FourColumnOverlayLayout,
  TemplateGridLayout
} from "./CategoryLayouts";

/**
 * MODULAR SECTION LAYOUT
 * A high-level wrapper that delegates rendering to specialized layout sub-components.
 */
export default function SectionLayout({ 
  title, 
  slug,
  posts, 
  layoutType = "grid", 
  iconColor = "brand-primary",
  limit = 4,
  aspectRatio = "aspect-[16/9]",
  isCircle = false
}) {
  const displayPosts = posts || [];

  if (!displayPosts.length) return null;

  const isDark = layoutType === 'dark-carousel';

  return (
    <section className={`w-full py-6 ${isDark ? 'bg-[#111] text-white' : 'bg-white'}`}>
      <div className="w-[95%] xl:w-[85%] mx-auto px-4">
        <SectionHeader 
          title={title} 
          slug={slug}
          iconColor={iconColor} 
          centered={isDark} 
          dark={isDark}
        />

        <LayoutSwitch 
          type={layoutType} 
          posts={displayPosts} 
          aspectRatio={aspectRatio} 
          isCircle={isCircle} 
          limit={limit}
        />
      </div>
    </section>
  );
}

function LayoutSwitch({ type, posts, aspectRatio, isCircle, limit }) {
  switch (type) {
    case "unified-3-col":
      return <UnifiedThreeColumnLayout posts={posts} />;
    case "four-column-overlay":
      return <FourColumnOverlayLayout posts={posts} limit={limit} aspectRatio={aspectRatio} />;
    case "template-grid":
      return <TemplateGridLayout posts={posts} limit={limit} />;
    case "must-read":
      return <MustReadLayout posts={posts} />;
    case "horizontal-grid":
      return <BusinessListLayout posts={posts} />;
    case "standard-row":
      return <TechnologyGridLayout posts={posts} />;
    case "sidebar-stack":
      return <SidebarStackLayout posts={posts} />;
    case "grid":
      return <GridLayout posts={posts} />;
    case "featured-grid":
      return <FeaturedGridLayout posts={posts} aspectRatio={aspectRatio} />;
    case "hybrid":
      return <HybridLayout posts={posts} aspectRatio={aspectRatio} />;
    case "horizontal":
      return <HorizontalLayout posts={posts} />;
    case "compact-grid":
      return <CompactGridLayout posts={posts} isCircle={isCircle} />;
    case "dark-carousel":
      return <CarouselLayout posts={posts} aspectRatio={aspectRatio} />;
    default:
      return <GridLayout posts={posts} />;
  }
}

/* --- Layout Components --- */

function GridLayout({ posts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} variant="standard" />
      ))}
    </div>
  );
}

function FeaturedGridLayout({ posts, aspectRatio }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.slice(0, 2).map((post, idx) => (
          <PostCard key={`large-${idx}`} post={post} variant="overlay" aspectRatio={aspectRatio} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.slice(2, 6).map((post, idx) => (
          <PostCard key={`small-${idx}`} post={post} variant="standard" />
        ))}
      </div>
    </div>
  );
}

function HybridLayout({ posts, aspectRatio }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <PostCard post={posts[0]} variant="overlay" showExcerpt={true} aspectRatio={aspectRatio} />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-6">
        {posts.slice(1, 4).map((post, idx) => (
          <PostCard key={idx} post={post} variant="standard" />
        ))}
      </div>
    </div>
  );
}

function HorizontalLayout({ posts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} variant="horizontal" showExcerpt={true} />
      ))}
    </div>
  );
}

function CompactGridLayout({ posts, isCircle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} variant="compact" isCircle={isCircle} />
      ))}
    </div>
  );
}

function CarouselLayout({ posts, aspectRatio }) {
  return (
    <div className="flex flex-nowrap overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth">
      {posts.map((post, idx) => (
        <div key={idx} className="min-w-[300px] lg:min-w-[400px]">
          <PostCard post={post} variant="overlay" showAuthor={true} aspectRatio={aspectRatio} />
        </div>
      ))}
    </div>
  );
}
