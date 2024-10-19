"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Photo } from "./photo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { ImageIcon } from "lucide-react";

export function UserMediaGallery() {
  const { address } = useAccount();
  const [blobs, setBlobs] = useState<{ blob_id: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBlobIds = async () => {
      if (!address) {
        return;
      }
      const user_id = address;
      const { data, error } = await supabase
        .from("user_blobs") // Replace with your actual table name
        .select("blob_id")
        .eq("user_id", user_id);

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        console.log("Supabase data:", data); // Debugging step
        setBlobs(data || []);
      }
    };

    fetchBlobIds();
  }, [address]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {blobs.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {blobs.map((blob) => (
            <Photo key={blob.blob_id} blobId={blob.blob_id} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-center">No images found</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Get started by uploading your first image
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/dashboard/upload">Upload an image</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
