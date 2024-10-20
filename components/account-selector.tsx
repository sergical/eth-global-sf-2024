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
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AccountSelector() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { setShowAuthFlow, handleLogOut } = useDynamicContext();
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
            <Avatar
              className="w-6 h-6 bg-primary"
              address={address as `0x${string}`}
            />
            <Name address={address as `0x${string}`}>
              <Badge />
            </Name>
            <Address address={address} />
          </Identity>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account">
            <span>Account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            handleLogOut();
            router.push("/");
          }}
        >
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
