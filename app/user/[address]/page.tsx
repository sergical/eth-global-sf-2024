import { AppHeader } from "@/components/app-header";
import UserGallery from "@/components/user-gallery";
import { client } from "@/lib/viem";
import { normalize } from "viem/ens";

export default async function Page({
  params,
}: {
  params: { address: string };
}) {
  const ensAddress = await client.getEnsAddress({
    name: normalize(params.address),
  });

  return (
    <>
      <AppHeader />
      <UserGallery address={ensAddress ?? params.address} />
    </>
  );
}
