"use client";

import {
  CreateIpAssetWithPilTermsResponse,
  IpMetadata,
  PIL_TYPE,
} from "@story-protocol/core-sdk";
import { Address } from "viem";
import { useStory } from "@/lib/storyProviderWrapper";
import CryptoJS from "crypto-js";

export default function MintLicense() {
  const { client } = useStory();

  if (!client) {
    return "";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(formData);

    // TODO: Ask user to input NFT metadata
    const nftMetadata = {
      name: "NFT representing ownership of IP Asset",
      description: "This NFT represents ownership of an IP Asset",
      image: "https://i.imgur.com/gb59b2S.png",
    };
    const nftHash = CryptoJS.SHA256(JSON.stringify(nftMetadata)).toString(
      CryptoJS.enc.Hex
    );
    const nftIpfsHash = "QmerFk1rWHnBxRqBxftr5nntEjr9PomyaGC3FUxSScr9HP";

    // TODO: Ask user to input IP metadata
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title: "My IP Asset",
      description: "This is a test IP asset",
      attributes: [
        {
          key: "Rarity",
          value: "Legendary",
        },
      ],
    });
    const ipIpfsHash = "QmeiUZUoLFABoaGWbUAVzHct3AetTbB6gS7rr4YnuwB99a";
    const ipHash = CryptoJS.SHA256(JSON.stringify(ipMetadata)).toString(
      CryptoJS.enc.Hex
    );

    console.log("address", process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS);

    const response: CreateIpAssetWithPilTermsResponse =
      await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      });

    console.log(
      `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
    );
    console.log(
      `View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Mint NFT and License Your IP</h1>
      <form onSubmit={handleSubmit}>
        <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">
          Run
        </button>
      </form>
    </>
  );
}
