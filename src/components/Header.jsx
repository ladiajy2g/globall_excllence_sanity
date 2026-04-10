"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../lib/site-config";
import Logo from "./Logo";

const utilityLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Advert Rates", href: "/advert-rates" },
  { name: "Contact Us", href: "/contact-us" },
];

const displayNames = {
  "society-and-fashion": "Society",
  "sport": "Sports",
  "showbizplus": "Showbizplus",
  "global-tv": "Global TV",
  "world": "World",
  "crime": "Crime",
  "interview": "Interview",
  "news": "News",
  "opinion": "Opinion",
  "politics": "Politics",
};

function getCategoryHref(slug) {
  if (!slug) return null;
  if (slug === "global-tv") return "/global-tv";
  if (slug === "uncategorized") return null;
  return `/category/${slug}`;
}

export default function Header({ categories = [] }) {
  const navCategories = (categories || [])
    .filter(cat => getCategoryHref(cat.slug))
    .map(cat => ({
      name: displayNames[cat.slug] || cat.name,
      slug: cat.slug,
      href: getCategoryHref(cat.slug),
    }));
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full relative z-50 bg-white shadow-sm">
      {/* 1. TOP BAR (Newspaper Style) */}
      <div className="bg-[#222222] text-white py-1.5 hidden lg:block border-b border-white/5">
        <div className="w-[95%] xl:w-[85%] mx-auto px-4 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest font-roboto">
          <div className="flex items-center gap-4 text-white/70">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href={siteConfig.seo.facebookUrl} className="hover:text-brand-primary transition-colors">Facebook</Link>
            <Link href={"https://twitter.com/" + siteConfig.seo.twitterHandle.replace("@", "")} className="hover:text-brand-primary transition-colors">Twitter</Link>
          </div>
        </div>
      </div>

      {/* 2. LOGO AREA (Centered Premium) */}
      <div className="py-8 bg-white hidden lg:block">
        <div className="w-[95%] xl:w-[85%] mx-auto flex flex-col items-center">
          <Link href="/" className="mb-2">
            <Logo className="h-24" />
          </Link>
          <div className="h-[1px] w-[5%] bg-gray-100 mt-2"></div>
        </div>
      </div>

      {/* 3. MAIN NAVIGATION (Sticky Black Bar) */}
      <nav className="w-full bg-[#000000] sticky top-0 z-50 hidden lg:block shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
        <div className="w-[95%] xl:w-[85%] mx-auto flex justify-between items-center h-14">
          <div className="flex items-center h-full">
            <Link href="/" className="px-5 h-full flex items-center bg-brand-primary text-white hover:bg-black transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <div className="flex items-center h-full">
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="px-5 h-full flex items-center text-[12px] font-black uppercase tracking-wider text-white hover:text-brand-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="px-6 h-full flex items-center text-white hover:text-brand-primary transition-colors border-l border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE HEADER (Minimalist) */}
      <div className="lg:hidden h-16 flex items-center justify-between px-4 bg-white border-b border-gray-100 shadow-sm">
        <button onClick={() => setIsMenuOpen(true)} className="p-2 text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/">
          <Logo className="h-10" />
        </Link>

        <button onClick={() => setIsSearchOpen(true)} className="p-2 text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#000000]/98 z-[100] flex flex-col font-roboto animate-in fade-in duration-300">
           <div className="flex justify-between items-center p-6 border-b border-white/10">
              <Logo className="h-8 invert grayscale" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-brand-primary"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
           </div>
           <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-black uppercase text-white hover:text-brand-primary transition-colors border-l-4 border-transparent hover:border-brand-primary pl-4"
                >
                  {cat.name}
                </Link>
              ))}
           </div>
        </div>
      )}

      {/* SEARCH OVERLAY (Full Screen Overlay from plan) */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-[#000000]/98 z-[200] flex flex-col p-8 font-roboto animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="self-end p-2 text-white hover:text-brand-primary transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">Search Global Excellence</span>
            <input
              autoFocus
              type="text"
              placeholder="SEARCH NOW..."
              className="w-full text-5xl md:text-8xl font-black text-center text-white bg-transparent border-b-8 border-white/5 focus:border-brand-primary outline-none pb-8 transition-colors uppercase italic"
            />
            <p className="mt-8 text-white/30 text-xs font-bold uppercase tracking-widest">Type your keywords and press enter</p>
          </div>
        </div>
      )}
    </header>
  );
}