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

  console.log(response);

  const json = await response.json();

  console.log(json);

  let blob_id = "";

  if (json.alreadyCertified) {
    blob_id = json.alreadyCertified.blobId;
  } else {
    blob_id = json.newlyCreated.blobObject.blobId;
  }

  console.log(`Blob ID: ${blob_id}`);

  console.log(
    `inserting into supabase blob_id: ${blob_id} address: ${address}`
  );

  const { error } = await supabase.from("user_blobs").insert({
    user_id: address,
    blob_id: blob_id,
  });

  if (error) {
    console.error(error);
    return { success: false, error: error.message };
  }

  return { success: true, blob_id: blob_id };
}
