"use server";

export default async function getJsonFromWalrusAction(blobId: string) {
  const response = await fetch(
    `${process.env.NEXT_PRIVATE_WALRUS_AGGREGATOR}/v1/${blobId}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const jsonString = await response.text();
  const jsonData = JSON.parse(jsonString);

  return {
    jsonData,
    contentType: response.headers.get("content-type") || "application/json",
    contentLength: response.headers.get("content-length"),
    etag: response.headers.get("etag"),
  };
}
