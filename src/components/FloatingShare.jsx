"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "../lib/site-config";

export default function FloatingShare({ post }) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!post || !mounted) return null;

  // Use current window location if available, otherwise fallback to siteConfig
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${siteConfig.seo.baseUrl}/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title || "");

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "bg-[#3b5998]",
    },
    {
      name: "X",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`,
      color: "bg-black",
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.124 1.588 5.915L0 24l6.342-1.657c1.397.866 3.003 1.373 4.608 1.378 6.557 0 11.391-5.385 11.395-11.892.005-6.478-5.124-11.893-11.393-11.893z" />
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`,
      color: "bg-[#25d366]",
    },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - FLOATING LEFT */}
      <div className="hidden lg:flex fixed left-6 xl:left-12 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 animate-in fade-in slide-in-from-left-6 duration-1000">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 [writing-mode:vertical-lr] rotate-180">
            Share Story
          </span>
        </div>
        
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 ${p.color} text-white rounded-full flex items-center justify-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 active:scale-95 hover:shadow-xl group`}
            title={`Share on ${p.name}`}
          >
            {p.icon}
          </a>
        ))}

        <button
          onClick={handleCopy}
          className={`w-12 h-12 relative ${copied ? "bg-brand-primary" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"} rounded-full flex items-center justify-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 group`}
          title="Copy Link"
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${copied ? "scale-0" : "scale-100"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          <svg className={`w-5 h-5 absolute transition-transform duration-300 ${copied ? "scale-100 text-white" : "scale-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          
          {copied && (
            <span className="absolute left-14 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-sm whitespace-nowrap animate-in fade-in zoom-in slide-in-from-left-2">
              Copied to Clipboard
            </span>
          )}
        </button>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-full duration-700">
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] mb-[env(safe-area-inset-bottom)]">
          <div className="flex-1 grid grid-cols-4 gap-2">
             {platforms.map((p) => (
               <a
                 key={p.name}
                 href={p.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`h-11 ${p.color} text-white rounded-md flex items-center justify-center shadow-sm transition-transform active:scale-95`}
               >
                 {p.icon}
               </a>
             ))}
             <button
               onClick={handleCopy}
               className={`h-11 ${copied ? "bg-brand-primary" : "bg-gray-100 text-gray-500"} rounded-md flex items-center justify-center transition-all`}
             >
                {copied ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1" />
                  </svg>
                )}
             </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white/95 backdrop-blur-md" />
      </div>
    </>
  );
}
