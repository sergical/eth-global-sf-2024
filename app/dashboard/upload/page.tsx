/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import {
  CreateIpAssetWithPilTermsResponse,
  IpMetadata,
  PIL_TYPE,
} from "@story-protocol/core-sdk";
import { Address } from "viem";
import CryptoJS from "crypto-js";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// Custom hooks and utilities
import { useStory } from "@/lib/storyProviderWrapper";
import { supabase } from "@/lib/supabaseClient";
import uploadFileToWalrusAction from "@/server/upload-file-to-walrus-action";
import uploadTextToWalrusAction from "@/server/upload-text-to-walrus-action";

// Form schema definition
const formSchema = z.object({
  file: z.instanceof(File).optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  licenseType: z.nativeEnum(PIL_TYPE),
});

export default function UploadPage() {
  const { client } = useStory();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      licenseType: PIL_TYPE.NON_COMMERCIAL_REMIX,
    },
  });

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue("file", e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0]);
    }
  };

  // Main form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    console.log("values", values);
    console.log(client);
    console.log(address);

    try {
      // Validate prerequisites
      if (!client || !values.file || !address) {
        throw new Error("Missing required data");
      }

      // Step 1: Upload file to Supabase
      const publicUrl = await uploadFileToSupabase(address, values.file);

      // Step 2: Create and upload NFT metadata
      const nftMetadata = createNFTMetadata(values, publicUrl);
      const nftMetadataUrl = await uploadMetadataToWalrus(nftMetadata);

      // Step 3: Create and upload IP metadata
      const ipMetadata = createIPMetadata(client, values);
      const ipMetadataUrl = await uploadMetadataToWalrus(ipMetadata);

      // Step 4: Mint and register IP asset
      const ipId = await mintAndRegisterIPAsset(
        client,
        values,
        nftMetadataUrl,
        ipMetadataUrl
      );

      // Step 5: Upload file to Walrus
      await uploadFileToWalrus(
        values,
        address as `0x${string}`,
        ipId as string,
        nftMetadataUrl.split("/").pop() as string,
        ipMetadataUrl.split("/").pop() as string
      );

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during upload");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const uploadFileToSupabase = async (address: string, file: File) => {
    // Upload file to the 'nfts' bucket in a folder named after the user's address
    const { data, error } = await supabase.storage
      .from("nfts")
      .upload(`${address}/${file.name}-${Date.now()}`, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("nfts").getPublicUrl(data.path);
    if (!publicUrl) throw new Error("Failed to get public URL");

    return publicUrl;
  };

  const createNFTMetadata = (
    values: z.infer<typeof formSchema>,
    publicUrl: string
  ) => ({
    name: values.title,
    description: values.description,
    image: publicUrl,
  });

  const createIPMetadata = (
    client: any,
    values: z.infer<typeof formSchema>
  ): IpMetadata =>
    client.ipAsset.generateIpMetadata({
      title: values.title,
      description: values.description,
      attributes: [{ key: "Sample", value: "Attribute" }],
    });

  const uploadMetadataToWalrus = async (metadata: any) => {
    const response = await uploadTextToWalrusAction(JSON.stringify(metadata));
    if (!response.success) throw new Error(response.error);
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/json/${response.blob_id}`;
  };

  const mintAndRegisterIPAsset = async (
    client: any,
    values: z.infer<typeof formSchema>,
    nftMetadataUrl: string,
    ipMetadataUrl: string
  ) => {
    const nftHash = CryptoJS.SHA256(
      JSON.stringify(createNFTMetadata(values, ""))
    ).toString(CryptoJS.enc.Hex);
    const ipHash = CryptoJS.SHA256(
      JSON.stringify(createIPMetadata(client, values))
    ).toString(CryptoJS.enc.Hex);

    const response: CreateIpAssetWithPilTermsResponse =
      await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address,
        pilType: values.licenseType,
        ipMetadata: {
          ipMetadataURI: ipMetadataUrl,
          ipMetadataHash: `0x${ipHash}`,
          nftMetadataURI: nftMetadataUrl,
          nftMetadataHash: `0x${nftHash}`,
        },
        txOptions: { waitForTransaction: true },
      });

    return response.ipId;
  };

  const uploadFileToWalrus = async (
    values: z.infer<typeof formSchema>,
    address: string,
    ipId: string,
    nftMetadataBlobId: string,
    ipMetadataBlobId: string
  ) => {
    const formData = new FormData();
    if (values.file) {
      formData.append("file", values.file);
    }
    formData.append("address", address);
    formData.append("ipId", ipId);
    formData.append("nftMetadataBlobId", nftMetadataBlobId);
    formData.append("ipMetadataBlobId", ipMetadataBlobId);
    formData.append("licenseType", values.licenseType.toString());
    formData.append("title", values.title);
    formData.append("description", values.description || "");

    const response = await uploadFileToWalrusAction(formData);
    if (!response.success) throw new Error(response.error);
  };

  const formFile = form.watch("file");

  // Render UI
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload New Content</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File upload area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-primary" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {formFile ? (
                <div>
                  <p className="text-lg font-semibold">{formFile?.name}</p>
                  <p className="text-sm text-gray-500">
                    {(formFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Drag and drop your file here, or click to select a file
                  </p>
                </div>
              )}
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="mt-4 inline-block">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Select File
                </Button>
              </Label>
            </div>

            {/* Title input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter content description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* License type selection */}
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

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Content"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
