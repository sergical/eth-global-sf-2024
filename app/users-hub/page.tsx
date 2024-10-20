"use client";

import { AppHeader } from "@/components/app-header";
import { useStory } from "@/lib/storyProviderWrapper";
import { IpMetadata } from "@story-protocol/core-sdk";
import { Address } from "viem";
import CryptoJS from "crypto-js";

export default function UsersHub() {
  const { client } = useStory();

  if (!client) {
    return;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formDataJson = Object.fromEntries(formData.entries());

    // 1. Mint license tokens
    const response = await client.license.mintLicenseTokens({
      licenseTermsId: 1,
      licensorIpId: formDataJson.ipId as Address,
      receiver: formDataJson.receiverAddress as Address,
      amount: 1,
      txOptions: { waitForTransaction: true },
    });

    console.log(
      `License minted at tx hash ${response.txHash}, License IDs: ${response.licenseTokenIds}`
    );

    // 2. Mint remixed NFT and register as derivative IPA
    // TODO: Ask user to input NFT metadata
    const derivedNftMetadata = {
      name: "Derived NFT representing ownership of a remixed IP Asset",
      description: "This NFT represents ownership of a remixed IP Asset",
      image: "https://i.imgur.com/gb59b2S.png",
    };
    const derivedNftHash = CryptoJS.SHA256(
      JSON.stringify(derivedNftMetadata)
    ).toString(CryptoJS.enc.Hex);
    const derivedNftIpfsHash = "QmerFk1rWHnBxRqBxftr5nntEjr9PomyaGC3FUxSScr9HP";

    // TODO: Ask user to input IP metadata
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title: "My derived IP Asset",
      description: "This is a test derived IP asset",
      attributes: [
        {
          key: "Rarity",
          value: "Even More Legendary",
        },
      ],
    });
    const ipIpfsHash = "QmeiUZUoLFABoaGWbUAVzHct3AetTbB6gS7rr4YnuwB99a";
    const ipHash = CryptoJS.SHA256(JSON.stringify(ipMetadata)).toString(
      CryptoJS.enc.Hex
    );

    const derivativeResponse =
      await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        derivData: {
          parentIpIds: [formDataJson.ipId as Address],
          licenseTermsIds: [1],
        },
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${derivedNftIpfsHash}`,
          nftMetadataHash: `0x${derivedNftHash}`,
        },
        txOptions: { waitForTransaction: true },
      });

    console.log(
      `Derivative IPA created at tx hash ${derivativeResponse.txHash}, Child IPA ID: ${derivativeResponse.childIpId}`
    );
  };

  return (
    <>
      <AppHeader />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Users Hub</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium" htmlFor="ipId">
            Licensor IP ID
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            id="ipId"
            name="ipId"
            placeholder="0x0000000000000000000000000000000000000000"
          />
          <label className="text-sm font-medium" htmlFor="receiverAddress">
            Receiver Address
          </label>
          <input
            className="border border-gray-300 rounded-md p-2"
            type="text"
            id="receiverAddress"
            name="receiverAddress"
            placeholder="0x0000000000000000000000000000000000000000"
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
