"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

interface Photo {
  id: number;
  src: string;
  title: string;
  photographer: string;
  width: number;
  height: number;
}

export default function LandingPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // Generate random photos
    const generatePhotos = () => {
      return Array(20)
        .fill(0)
        .map((_, i) => ({
          id: i,
          src: `https://v0.dev/placeholder.svg?height=${
            200 + Math.floor(Math.random() * 300)
          }&width=${200 + Math.floor(Math.random() * 300)}`,
          title: `Beautiful Landscape ${i + 1}`,
          photographer: `Photographer ${i + 1}`,
          width: 200 + Math.floor(Math.random() * 300),
          height: 200 + Math.floor(Math.random() * 300),
        }));
    };

    setPhotos(generatePhotos());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Photo Marketplace
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover and purchase stunning photographs
          </p>
          <div className="mt-4 flex gap-4">
            <DynamicWidget />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-4 relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: photo.id * 0.05 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="w-full rounded-lg shadow-md transition-all duration-300 group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold text-white drop-shadow-md">
                  {photo.title}
                </h3>
                <p className="text-sm text-white drop-shadow-md">
                  By {photo.photographer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
