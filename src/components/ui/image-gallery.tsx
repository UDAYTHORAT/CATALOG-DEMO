"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ImageGalleryProps {
  title?: string;
  subtitle?: string;
  images: {
    src: string;
    alt?: string;
  }[];
}

export default function ImageGallery({
  title = "Our Latest Creations",
  subtitle = "A visual collection of our most recent works – each piece crafted with intention, emotion, and style.",
  images,
}: ImageGalleryProps) {
  return (
    <section className="w-full flex flex-col items-center justify-start py-12">
      <div className="max-w-3xl text-center px-4">
        <h2 className="text-3xl font-semibold font-chubbo tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
      </div>

      {/* Gallery Container */}
      <div className="w-full max-w-5xl mt-10 px-4">
        {/* Mobile Grid / Desktop Expanding Flex */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:h-[400px] w-full">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "relative group overflow-hidden rounded-lg transition-all duration-500",
                "h-[200px] md:h-[400px]", // Taller on desktop
                "w-full md:w-32 md:hover:w-full md:flex-grow" // Expanding logic on desktop
              )}
            >
              <img
                className="h-full w-full object-cover object-center"
                src={img.src}
                alt={img.alt || `gallery-${idx}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
