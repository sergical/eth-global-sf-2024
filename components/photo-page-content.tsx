"use client";
import getFileFromWalrusAction from "@/server/get-file-from-walrus-action";
import { motion } from "framer-motion";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useEnsName } from "wagmi";
import { Button } from "@/components/ui/button";

export function PhotoPageContent({
  blobId,
  walletAddress,
}: {
  blobId: string;
  walletAddress?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const { data: ensName } = useEnsName({
    address: walletAddress as `0x${string}`,
  });

  useEffect(() => {
    getFileFromWalrusAction(blobId).then((response) => {
      setLoaded(true);
      setImgUrl(response.dataUrl);
    });
  }, [blobId]);

  if (!loaded || !imgUrl) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt="Loaded image"
              className="w-full rounded-lg shadow-md"
            />
          </motion.div>
        </div>
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-4">Image Details</h1>
            {walletAddress ? (
              <Link href={`/user/${ensName ?? walletAddress}`}>
                <Identity
                  address={walletAddress as `0x${string}`}
                  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                  className="mb-4"
                >
                  <Avatar
                    className="w-10 h-10 bg-primary"
                    address={walletAddress as `0x${string}`}
                  />
                  <Name address={walletAddress as `0x${string}`}>
                    <Badge />
                  </Name>
                  <Address address={walletAddress as `0x${string}`} />
                </Identity>
              </Link>
            ) : (
              <p className="mb-4">
                Blob ID: {blobId.slice(0, 6)}...{blobId.slice(-4)}
              </p>
            )}
            <div className="flex space-x-4 mb-8">
              <Button>Download</Button>
              <Button>Tip</Button>
              <Button>Remix</Button>
            </div>
            <p className="text-gray-600">
              Additional image details or description can go here. You can add
              more content or components as needed.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
