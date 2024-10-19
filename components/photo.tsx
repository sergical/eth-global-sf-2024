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

export function Photo({
  blobId,
  walletAddress,
}: {
  blobId: string;
  walletAddress?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    getFileFromWalrusAction(blobId).then((response) => {
      setLoaded(true);
      setImgUrl(response.dataUrl);
    });
  }, [blobId]);

  if (!loaded || !imgUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="w-full rounded-lg shadow-md transition-all duration-300 group-hover:brightness-75"
        src="https://v0.dev/placeholder.svg?height=200&width=200"
        alt="placeholder"
      />
    );
  }

  return (
    <motion.div
      key={blobId}
      className="break-inside-avoid mb-4 relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt="Loaded image"
        className="w-full rounded-lg shadow-md transition-all duration-300 group-hover:brightness-75"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-semibold text-white drop-shadow-md">
          Image
        </h3>
        {walletAddress ? (
          <Identity
            address={walletAddress as `0x${string}`}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            className="w-full p-0 text-white"
          >
            <Avatar className="w-6 h-6" />
            <Name>
              <Badge />
            </Name>
            <Address />
          </Identity>
        ) : (
          <p className="text-sm text-white drop-shadow-md">
            Blob ID: {blobId.slice(0, 6)}...{blobId.slice(-4)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
