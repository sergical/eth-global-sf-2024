"use client";

import { useDynamicContext } from "@/lib/dynamic";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import {
  Avatar,
  Identity,
  Name,
  Badge,
  Address,
} from "@coinbase/onchainkit/identity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function AccountSelector() {
  const { address, isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  if (!isConnected)
    return <Button onClick={() => setShowAuthFlow(true)}>Sign in</Button>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="h-fit">
          <Identity
            address={address}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
            className="w-full p-0"
          >
            <Avatar className="w-6 h-6" />
            <Name>
              <Badge />
            </Name>
            <Address />
          </Identity>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem>
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
