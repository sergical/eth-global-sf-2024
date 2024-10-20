"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

import { PIL_TYPE } from "@story-protocol/core-sdk";
import { useEnsName } from "wagmi";
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
    console.log("handle submit");
    console.log(values);
    // Implement your submit logic here
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
          <div className="relative w-full h-64">
            <Image
              src={originalImageUrl}
              alt="Original image"
              layout="fill"
              objectFit="contain"
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
                    layout="fill"
                    objectFit="contain"
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
