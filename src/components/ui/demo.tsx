"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface DemoGalleryImage {
  src: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface DemoGalleryProps {
  title?: string;
  subtitle?: string;
  images: DemoGalleryImage[];
}

export default function DemoGallery({
  title = "Our Latest Creations",
  subtitle = "A visual collection of our most recent works – each piece crafted with intention, emotion, and style.",
  images,
}: DemoGalleryProps) {
  return (
    <section className="w-full flex flex-col items-center py-12">
      {/* Title block */}
      <div className="max-w-3xl text-center px-4">
        <h2 className="text-3xl font-semibold font-chubbo tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto px-4 mt-12">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative group rounded-lg overflow-hidden aspect-square"
          >
            <img
              src={img.src}
              alt={img.alt || `image-${idx}`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-6 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-sm md:text-xl font-medium font-chubbo">
                {img.title || "Image Title"}
              </h3>
              {img.href ? (
                <Link
                  href={img.href}
                  className="flex items-center gap-1 text-[10px] md:text-sm text-white/70 hover:text-white transition-colors"
                >
                  Show More
                  <ArrowUpRight size={14} />
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-[10px] md:text-sm text-white/70">
                  Show More
                  <ArrowUpRight size={14} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
