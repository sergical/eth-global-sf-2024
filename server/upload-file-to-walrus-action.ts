"use server";

import { FileObject } from "@/lib/types";

export default async function uploadFileToWalrusAction(file: FileObject) {
  // curl -X PUT "$PUBLISHER/v1/store?epochs=5" --upload-file "some/file" # store file `some/file` for 5 storage epochs

  // Convert FileObject back to File
  const fileContent = atob(file.content || "");
  const uint8Array = new Uint8Array(fileContent.length);
  for (let i = 0; i < fileContent.length; i++) {
    uint8Array[i] = fileContent.charCodeAt(i);
  }
  const blob = new Blob([uint8Array], { type: file.type });
  const reconstructedFile = new File([blob], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });

  const response = await fetch(
    `${process.env.NEXT_PRIVATE_WALRUS_PUBLISHER}/v1/store?epochs=5`,
    {
      method: "PUT",
      body: reconstructedFile,
    }
  );

  console.log("Response:", response);

  return response.json();
}
