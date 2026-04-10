"use client";

import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
      <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-3">
          <span className="text-[10px]">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-primary transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-black">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
