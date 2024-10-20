import { NextRequest, NextResponse } from "next/server";
import getJsonFromWalrusAction from "@/server/get-json-from-walrus-action";

export async function GET(
  request: NextRequest,
  { params }: { params: { blobId: string } }
) {
  const blobId = params.blobId;

  try {
    const { jsonData } = await getJsonFromWalrusAction(blobId);

    console.log("jsonData", jsonData);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(JSON.stringify(jsonData), {
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return NextResponse.json(
      { error: "Failed to fetch JSON" },
      { status: 500 }
    );
  }
}
