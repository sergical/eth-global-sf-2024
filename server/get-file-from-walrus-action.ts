export default async function getFileFromWalrusAction(blobId: string) {
  const response = await fetch(
    `${process.env.NEXT_PRIVATE_WALRUS_AGGREGATOR}/v1/${blobId}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64String = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const dataUrl = `data:${contentType};base64,${base64String}`;

  return {
    dataUrl,
    contentType,
    contentLength: response.headers.get("content-length"),
    etag: response.headers.get("etag"),
  };
}
