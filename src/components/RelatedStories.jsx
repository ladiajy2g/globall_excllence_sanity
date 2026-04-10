import PostCard from "./PostCard";

export default function RelatedStories({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header with Ghost Text */}
        <div className="relative flex flex-col items-center justify-center mb-16 h-24">
          <span 
            className="absolute inset-0 flex items-center justify-center text-[70px] md:text-[140px] font-black text-gray-100 uppercase select-none z-0 pointer-events-none tracking-tighter leading-none opacity-60"
          >
            RELATED
          </span>
          <h2 className="relative z-10 text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
            More like this
          </h2>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {posts.map((post) => (
            <PostCard 
              key={post.slug} 
              post={post} 
              showAuthor={true}
              aspectRatio="aspect-[3/2]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
