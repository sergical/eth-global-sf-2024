"use server";

export default async function uploadTextToWalrusAction(text: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PRIVATE_WALRUS_PUBLISHER}/v1/store?epochs=5`,
      {
        method: "PUT",
        body: text,
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

    return { success: true, blob_id: blob_id };
  } catch (error) {
    console.error("Error uploading text to Walrus:", error);
    return { success: false, error: "Failed to upload text to Walrus" };
  }
}
