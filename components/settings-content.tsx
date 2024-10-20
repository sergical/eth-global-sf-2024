"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useAccount, useEnsName } from "wagmi";
import { useEffect } from "react";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function SettingsContent() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ensName || "",
    },
  });

  useEffect(() => {
    form.setValue("username", ensName?.split(".")[0] || "");
  }, [ensName]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="max-w-md p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="flex items-center relative">
                    <Input
                      placeholder={ensName || ""}
                      {...field}
                      disabled={!!ensName}
                    />
                    <span className="absolute right-0 -z-10 inline-flex items-center rounded-r-lg border border-input bg-background px-3 text-sm text-muted-foreground h-9">
                      .eth
                    </span>
                  </div>
                </FormControl>
                <FormDescription className="flex items-center">
                  {ensName ? (
                    <>
                      This will be your portfolio URL:{" "}
                      <Link
                        href={`https://ourappurl.com/${form.getValues(
                          "username"
                        )}`}
                        className="text-blue-500 ml-1"
                        target="_blank"
                      >
                        https://ourappurl.com/{form.getValues("username")}
                      </Link>
                    </>
                  ) : null}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoCircledIcon className="h-4 w-4 ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This URL will be used to access your public portfolio.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Form>
    </div>
  );
}
