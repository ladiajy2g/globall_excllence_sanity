"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../lib/site-config";

/**
 * Logo Component
 * Renders the brand logo image with layout stability.
 */
export default function Logo({ className = "h-12", variant = "header" }) {
  const isFooter = variant === "footer";
  
  return (
    <div className={`flex items-center select-none ${className}`}>
      <div className="relative">
        <img 
          src={siteConfig.identity.logoUrl}
          alt={siteConfig.identity.name}
          className="h-full w-auto object-contain max-h-[100px]"
          loading="eager"
        />
      </div>
    </div>
  );
}
