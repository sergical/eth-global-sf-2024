import { NextRequest, NextResponse } from "next/server";
import getFileFromWalrusAction from "@/server/get-file-from-walrus-action";

export async function GET(
  request: NextRequest,
  { params }: { params: { blobId: string } }
) {
  const blobId = params.blobId;

  try {
    const { dataUrl, contentType, contentLength, etag } =
      await getFileFromWalrusAction(blobId);

    const base64Data = dataUrl.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    if (contentLength) headers.set("Content-Length", contentLength);
    if (etag) headers.set("ETag", etag);

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
