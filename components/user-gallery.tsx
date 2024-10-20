"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Photo } from "./photo";
import {
  Address,
  Avatar,
  Badge,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";

export default function UserGallery({ address }: { address: string }) {
  const [userBlobs, setUserBlobs] = useState<
    { blobId: string; walletAddress: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_blobs")
        .select("*")
        .eq("user_id", address);

      if (error) {
        console.error("Error fetching user images:", error);
      } else {
        setUserBlobs(
          data?.map((image) => ({
            blobId: image.blob_id,
            walletAddress: image.user_id,
          })) || []
        );
      }
      setLoading(false);
    };

    fetchUserImages();
  }, [address]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Identity
            address={address as `0x${string}`}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            className="w-full p-0"
          >
            <Avatar
              className="w-12 h-12 bg-primary"
              address={address as `0x${string}`}
            />
            <Name address={address as `0x${string}`}>
              <Badge />
            </Name>
            <Address address={address as `0x${string}`} />
          </Identity>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Loading Gallery
            </h2>
            <p className="text-muted-foreground">
              Please wait while we fetch the user&apos;s images...
            </p>
          </div>
        ) : userBlobs.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No Images Found
            </h2>
            <p className="text-muted-foreground">
              This user hasn&apos;t uploaded any images yet.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {userBlobs.map((userBlob) => (
              <Photo
                key={userBlob.blobId}
                blobId={userBlob.blobId}
                walletAddress={userBlob.walletAddress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
