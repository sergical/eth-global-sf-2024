import { AppHeader } from "@/components/app-header";
import { PhotoPageContent } from "@/components/photo-page-content";
import { supabase } from "@/lib/supabaseClient";

export default async function PhotoPage({
  params,
}: {
  params: { blobId: string };
}) {
  const { blobId } = params;
  const { data } = await supabase
    .from("user_blobs")
    .select("*")
    .eq("blob_id", blobId);
  return (
    <>
      <AppHeader />
      <PhotoPageContent blobId={blobId} walletAddress={data?.[0].user_id} />
    </>
  );
}
