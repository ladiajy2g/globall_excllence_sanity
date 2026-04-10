"use client";
import Link from "next/link";

export default function SectionHeader({ title, slug, iconColor = "brand-primary", centered = false, dark = false }) {
  const colorMap = {
    "brand-primary": "border-brand-primary",
  };

  const borderColor = colorMap[iconColor] || "border-brand-primary";
  const viewAllHref = slug ? (slug === 'global-tv' ? '/global-tv' : `/category/${slug}`) : '#';

  if (centered) {
    return (
      <div className="flex flex-col items-center mb-8 font-inter">
        <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tighter ${dark ? 'text-white' : 'text-black'}`}>
          {title}
        </h2>
        <div className={`h-1.5 w-32 bg-brand-primary mt-4`}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-6 font-inter border-b border-gray-100 pb-3">
      <div className="flex items-center gap-4">
        {/* Red Triangle Icon */}
        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-brand-primary border-b-[10px] border-b-transparent"></div>
        <h2 className={`text-xl lg:text-2xl font-bold uppercase tracking-tight ${dark ? 'text-white' : 'text-black'}`}>
          {title}
        </h2>
      </div>
      
      <Link href={viewAllHref} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors">
        <span>View All</span>
        <svg className="w-4 h-4 bg-gray-100 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
