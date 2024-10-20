import { AppHeader } from "@/components/app-header";
import { RemixPageContent } from "@/components/remix-page-content";
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";

export default async function RemixPage({
  params,
}: {
  params: { ipId: string };
}) {
  const { ipId } = params;
  const { data } = await supabase
    .from("user_blobs")
    .select("*")
    .eq("ip_id", ipId)
    .single();

  if (!data) {
    notFound();
  }
  return (
    <>
      <AppHeader />
      <RemixPageContent originalObject={data} />
    </>
  );
}
