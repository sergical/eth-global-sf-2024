"use client";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabaseClient";
import { Photo } from "./photo";

interface Photo {
  id: number;
  src: string;
  title: string;
  photographer: string;
  width: number;
  height: number;
}

export default function LandingPage() {
  const [featuredUserBlobs, setFeaturedUserBlobs] = useState<
    { blobId: string; walletAddress: string }[]
  >([]);

  useEffect(() => {
    const fetchImagesFromSupabase = async () => {
      const images = await supabase.from("user_blobs").select("*").limit(10);

      setFeaturedUserBlobs(
        images.data?.map((image) => ({
          blobId: image.blob_id,
          walletAddress: image.user_id,
        })) || []
      );
    };
    fetchImagesFromSupabase();
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
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {featuredUserBlobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Loading Gallery
            </h2>
            <p className="text-muted-foreground">
              Please wait while we fetch the latest images...
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {featuredUserBlobs.map((userBlob) => (
              <Photo
                key={userBlob.blobId}
                blobId={userBlob.blobId}
                walletAddress={userBlob.walletAddress}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
