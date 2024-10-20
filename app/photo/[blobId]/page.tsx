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
    .eq("blob_id", blobId)
    .single();
  return (
    <>
      <AppHeader />
      <PhotoPageContent
        blobId={blobId}
        walletAddress={data?.user_id ?? ""}
        title={data?.title ?? ""}
        description={data?.description ?? ""}
        ipId={data?.ip_id ?? ""}
        license={data?.license_type ?? ""}
      />
    </>
  );
}
