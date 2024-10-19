"use server";

import { supabase } from "@/lib/supabaseClient";

export default async function uploadFileToWalrusAction(formData: FormData) {
  const file = formData.get("file") as File;

  const address = formData.get("address") as string;

  if (!address) {
    return { success: false, error: "No address provided" };
  }

  const response = await fetch(
    `${process.env.NEXT_PRIVATE_WALRUS_PUBLISHER}/v1/store?epochs=5`,
    {
      method: "PUT",
      body: file,
    }
  );

  const {
    newlyCreated: {
      blobObject: { blobId: blob_id },
    },
  } = await response.json();

  await supabase.from("user_blobs").insert({
    user_id: address,
    blob_id: blob_id,
  });

  return { success: true, blob_id: blob_id };
}
