export default function Loading() {
  return (
    <div className="w-full bg-white pb-24">
      {/* Top Progress Bar indicator */}
      <div className="top-loading-bar" />

      {/* Breadcrumbs Placeholder */}
      <div className="w-[95%] xl:w-[85%] mx-auto px-4 pt-8 mb-4">
        <div className="w-48 h-4 bg-gray-100 rounded animate-shimmer" />
      </div>

      {/* --- Article Header Skeleton --- */}
      <header className="w-[95%] xl:w-[85%] mx-auto px-4 max-w-5xl text-center mb-12">
        <div className="inline-block w-24 h-6 bg-gray-100 mb-6 mx-auto animate-shimmer" />
        <div className="w-full max-w-3xl h-12 bg-gray-100 mb-6 mx-auto animate-shimmer" />
        <div className="flex items-center justify-center gap-4">
           <div className="w-32 h-4 bg-gray-100 animate-shimmer" />
           <div className="w-2 h-2 bg-gray-200 rounded-full" />
           <div className="w-24 h-4 bg-gray-100 animate-shimmer" />
        </div>
      </header>

      {/* --- Featured Image Skeleton --- */}
      <div className="w-full max-w-[1400px] mx-auto px-4 mb-16">
        <div className="aspect-[21/9] relative bg-gray-50 rounded-[2px] animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* --- Main Content Body Skeleton --- */}
      <div className="w-[95%] xl:w-[85%] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Article Content Skeleton */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="w-full h-4 bg-gray-100 rounded animate-shimmer" />
              ))}
              <div className="w-3/4 h-4 bg-gray-100 rounded animate-shimmer" />
            </div>

            <div className="mt-16 space-y-6">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="w-full h-4 bg-gray-100 rounded animate-shimmer" />
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <div className="w-1/2 h-4 bg-gray-100 border-l-4 border-brand-primary pl-4 animate-shimmer" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-50 animate-shimmer" />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-1/2 h-4 bg-gray-100 border-l-4 border-black pl-4 animate-shimmer" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 animate-shimmer shrink-0" />
                  <div className="flex-1 space-y-2 py-2">
                    <div className="w-full h-4 bg-gray-100 animate-shimmer" />
                    <div className="w-2/3 h-3 bg-gray-50 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
