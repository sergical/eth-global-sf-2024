"use client";

import { useDynamicContext } from "@/lib/dynamic";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";

export function AccountSelector() {
  const { address, isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  if (!isConnected)
    return <Button onClick={() => setShowAuthFlow(true)}>Sign in</Button>;
  return <div>{address}</div>;
}
