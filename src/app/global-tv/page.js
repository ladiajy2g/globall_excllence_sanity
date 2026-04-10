import { getCategoryPosts } from "../../lib/wp-api";
import Sidebar from "../../components/Sidebar";
import PostCard from "../../components/PostCard";

export default async function GlobalTVPage() {
  const { name, posts } = await getCategoryPosts("global-tv", 12);

  return (
    <div className="w-full bg-white pb-24">
      <div className="bg-gray-50 border-b border-gray-100 mb-8">
        <div className="w-[95%] xl:w-[85%] mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
            {name}
          </h1>
        </div>
      </div>

      <div className="w-[95%] xl:w-[85%] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Posts Grid */}
          <div className="lg:col-span-8">
            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, idx) => (
                  <PostCard key={idx} post={post} variant="template-card" />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos found in this category.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}