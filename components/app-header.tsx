"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDynamicContext } from "@/lib/dynamic";
import { useAccount } from "wagmi";

const navItems = [
  { title: "Featured", href: "#" },
  { title: "Free", href: "#" },
  { title: "Categories", href: "#" },
];

export function AppHeader() {
  const { isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl">PhotoStock</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="hidden md:inline-flex"
              onClick={() => setShowAuthFlow(true)}
            >
              Login
            </Button>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle>
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <span className="font-bold">PhotoStock</span>
          </MobileLink>
        </SheetTitle>
        <SheetDescription>Somethign here</SheetDescription>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                onOpenChange={setOpen}
              >
                {item.title}
              </MobileLink>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-3 pt-6">
              {isConnected ? (
                <MobileLink
                  href="/dashboard"
                  onOpenChange={setOpen}
                  className="text-muted-foreground"
                >
                  Dashboard
                </MobileLink>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-[100px]"
                  onClick={() => setShowAuthFlow(true)}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href);
        onOpenChange?.(false);
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
