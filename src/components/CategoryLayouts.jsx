"use client";

import PostCard from "./PostCard";
import Link from "next/link";

/**
 * LAYOUT 1: Must Read (Complex Grid)
 * 1 Large Left, 1 Wide Middle, 2 Small Right + 5 Bottom Row
 */
export function MustReadLayout({ posts }) {
  if (!posts || posts.length < 4) return null; // Need at least some content
  
  const topLarge = posts[0];
  const topWide = posts[1] || null;
  const topSmall = posts.slice(2, Math.min(posts.length, 4));
  const bottomRow = posts.length > 4 ? posts.slice(4, Math.min(posts.length, 7)) : [];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Level */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <PostCard post={topLarge} variant="overlay" aspectRatio="aspect-[4/5]" />
        </div>
        <div className="lg:col-span-6">
           <PostCard post={topWide} variant="horizontal" showExcerpt={true} />
        </div>
        <div className="lg:col-span-3 flex flex-col">
          {topSmall.map((post, idx) => (
            <PostCard key={idx} post={post} variant="compact" />
          ))}
        </div>
      </div>
      
      {/* Bottom Level - Refined to 3 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bottomRow.map((post, idx) => (
          <PostCard key={idx} post={post} variant="standard" />
        ))}
      </div>
    </div>
  );
}

/**
 * NEW: Unified Three Column Layout
 * Column 1: Featured | Column 2: List | Column 3: List
 */
export function UnifiedThreeColumnLayout({ posts }) {
  if (!posts || posts.length === 0) return null;
  
  const featured = posts[0];
  const col2Rows = posts.slice(1, 4);
  const col3Rows = posts.slice(4, 7);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
      {/* Column 1: High-Impact Feature */}
      <div className="lg:col-span-5 h-full">
        <PostCard post={featured} variant="overlay" aspectRatio="md:aspect-[3/4]" showExcerpt={true} />
      </div>

      {/* Column 2: News Stack */}
      <div className="lg:col-span-3.5 flex flex-col gap-6 lg:border-l border-gray-100 lg:pl-8">
        {col2Rows.map((post, idx) => (
          <PostCard key={idx} post={post} variant="compact" />
        ))}
      </div>

      {/* Column 3: News Stack */}
      <div className="lg:col-span-3.5 flex flex-col gap-6 lg:border-l border-gray-100 lg:pl-8">
        {col3Rows.map((post, idx) => (
          <PostCard key={idx} post={post} variant="compact" />
        ))}
      </div>
    </div>
  );
}

/**
 * LAYOUT 2: Business (3x2 Horizontal Grid)
 */
export function BusinessListLayout({ posts }) {
  if (!posts) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} variant="horizontal" />
      ))}
    </div>
  );
}

/**
 * LAYOUT 3: Technology (4 Columns Standard Grid)
 */
export function TechnologyGridLayout({ posts }) {
  if (!posts) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} variant="standard" showExcerpt={true} />
      ))}
    </div>
  );
}

/**
 * LAYOUT 4: World News (Featured + Sidebar Stack)
 */
export function SidebarStackLayout({ posts }) {
  if (!posts || posts.length === 0) return null;
  const featured = posts[0];
  const stack = posts.slice(1, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <PostCard post={featured} variant="standard" showExcerpt={true} aspectRatio="aspect-video" />
      </div>
      <div className="lg:col-span-4 flex flex-col bg-gray-50/30 p-4 rounded-sm border border-gray-100/50">
        {stack.map((post, idx) => (
          <PostCard key={idx} post={post} variant="compact" />
        ))}
      </div>
    </div>
  );
}

/**
 * LAYOUT 5: Four Column Overlay (Crime, News, Showbizplus)
 * 4+ cards in rows, each with overlay style
 */
export function FourColumnOverlayLayout({ posts, limit = 4, aspectRatio = "aspect-[3/4]" }) {
  if (!posts || posts.length === 0) return null;
  
  const displayPosts = posts.slice(0, limit);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayPosts.map((post, idx) => (
        <PostCard 
          key={idx} 
          post={post} 
          variant="overlay" 
          aspectRatio={aspectRatio} 
        />
      ))}
    </div>
  );
}

/**
 * LAYOUT 6: Template Style Grid (4 Columns)
 * Matches the byteflows template: 4 cols XL, 2 cols LG/MD
 * Each card: image → category badge → title → date
 */
export function TemplateGridLayout({ posts, limit = 8 }) {
  if (!posts || posts.length === 0) return null;
  
  const displayPosts = posts.slice(0, limit);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayPosts.map((post, idx) => (
        <PostCard 
          key={idx} 
          post={post} 
          variant="template-card" 
        />
      ))}
    </div>
  );
}
