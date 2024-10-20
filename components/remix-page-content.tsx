"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "sonner";
import CryptoJS from "crypto-js";

import { PIL_TYPE } from "@story-protocol/core-sdk";
import { useEnsName, useAccount } from "wagmi";
import Link from "next/link";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/lib/database.types";
import getFileFromWalrusAction from "@/server/get-file-from-walrus-action";
import uploadTextToWalrusAction from "@/server/upload-text-to-walrus-action";
import uploadFileToWalrusAction from "@/server/upload-file-to-walrus-action";
import { useStory } from "@/lib/storyProviderWrapper";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  licenseType: z.number().min(0).max(2),
  file: z.instanceof(File),
});

export function RemixPageContent({
  originalObject,
}: {
  originalObject: Database["public"]["Tables"]["user_blobs"]["Row"];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const { data: ensName } = useEnsName({
    address: originalObject.user_id as `0x${string}`,
  });
  const { address } = useAccount();
  const { client } = useStory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      licenseType: PIL_TYPE.NON_COMMERCIAL_REMIX,
    },
  });

  useEffect(() => {
    getFileFromWalrusAction(originalObject.blob_id).then((response) => {
      setOriginalImageUrl(response.dataUrl);
    });
  }, [originalObject.blob_id]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!client || !address) {
      toast.error("Client or address not available");
      return;
    }

    setIsLoading(true);
    try {
      // Create and upload NFT metadata
      const nftMetadata = {
        name: values.title,
        description: values.description,
        image: `${process.env.NEXT_PUBLIC_APP_URL}/api/image/${originalObject.blob_id}`, // Use original image for now
      };
      const nftMetadataResponse = await uploadTextToWalrusAction(
        JSON.stringify(nftMetadata)
      );
      if (!nftMetadataResponse.success)
        throw new Error(nftMetadataResponse.error);
      const nftMetadataUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/json/${nftMetadataResponse.blob_id}`;

      // Create and upload IP metadata
      const ipMetadata = client.ipAsset.generateIpMetadata({
        title: values.title,
        description: values.description,
        attributes: [
          { key: "License Type", value: values.licenseType.toString() },
        ],
      });
      const ipMetadataResponse = await uploadTextToWalrusAction(
        JSON.stringify(ipMetadata)
      );
      if (!ipMetadataResponse.success)
        throw new Error(ipMetadataResponse.error);
      const ipMetadataUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/json/${ipMetadataResponse.blob_id}`;

      // Calculate hashes
      const nftHash = CryptoJS.SHA256(JSON.stringify(nftMetadata)).toString(
        CryptoJS.enc.Hex
      );
      const ipHash = CryptoJS.SHA256(JSON.stringify(ipMetadata)).toString(
        CryptoJS.enc.Hex
      );

      // Mint and register derivative IP asset
      const derivativeResponse =
        await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
          nftContract: process.env
            .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
          derivData: {
            parentIpIds: [originalObject.ip_id as `0x${string}`],
            licenseTermsIds: [Number(values.licenseType)],
          },
          ipMetadata: {
            ipMetadataURI: ipMetadataUrl,
            ipMetadataHash: `0x${ipHash}`,
            nftMetadataURI: nftMetadataUrl,
            nftMetadataHash: `0x${nftHash}`,
          },
          txOptions: { waitForTransaction: true },
        });

      // Upload file to Walrus
      const fileFormData = new FormData();
      fileFormData.append("file", values.file);
      fileFormData.append("address", address);
      fileFormData.append(
        "ipId",
        derivativeResponse.childIpId as `0x${string}`
      );
      fileFormData.append(
        "nftMetadataBlobId",
        nftMetadataResponse?.blob_id ?? ""
      );
      fileFormData.append(
        "ipMetadataBlobId",
        ipMetadataResponse?.blob_id ?? ""
      );
      fileFormData.append("licenseType", values.licenseType.toString());
      fileFormData.append("title", values.title);
      fileFormData.append("description", values.description);

      const fileUploadResponse = await uploadFileToWalrusAction(fileFormData);
      if (!fileUploadResponse.success)
        throw new Error(fileUploadResponse.error);

      toast.success("Remix created successfully!");
    } catch (error) {
      console.error("Error creating remix:", error);
      toast.error("Failed to create remix");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Remix Content</h1>
        <p className="text-gray-600">Original title: {originalObject.title}</p>
        <div className="flex justify-center">
          <Link href={`/user/${ensName ?? originalObject.user_id}`}>
            <Identity
              address={originalObject.user_id as `0x${string}`}
              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
              className="mt-4"
            >
              <Avatar
                className="w-10 h-10 bg-primary mx-auto"
                address={originalObject.user_id as `0x${string}`}
              />
              <Name address={originalObject.user_id as `0x${string}`}>
                <Badge />
              </Name>
              <Address address={originalObject.user_id as `0x${string}`} />
            </Identity>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Original Image
        </h2>
        {originalImageUrl ? (
          <div className="relative w-full h-fit mx-auto">
            <Image
              src={originalImageUrl}
              alt="Original image"
              width={500}
              height={500}
            />
          </div>
        ) : (
          <p>Loading original image...</p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Remixed File</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                      </div>
                      <Input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            field.onChange(file);
                          }
                        }}
                      />
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedFile && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Selected File Preview
              </h3>
              <p>File name: {selectedFile.name}</p>
              <p>
                File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>File type: {selectedFile.type}</p>
              {selectedFile.type.startsWith("image/") && (
                <div className="mt-2 relative w-full h-64">
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected file preview"
                    width={500}
                    height={500}
                  />
                </div>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter remix title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter remix description"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Type</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a license type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={PIL_TYPE.NON_COMMERCIAL_REMIX.toString()}
                    >
                      Non-Commercial Remix
                    </SelectItem>
                    <SelectItem value={PIL_TYPE.COMMERCIAL_USE.toString()}>
                      Commercial Use
                    </SelectItem>
                    <SelectItem value={PIL_TYPE.COMMERCIAL_REMIX.toString()}>
                      Commercial Remix
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Remix..." : "Create Remix"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
