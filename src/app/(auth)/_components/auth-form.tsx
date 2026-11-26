"use client";

import { P } from "@/components/custom/p";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { RiGoogleFill, RiLoader3Fill } from "@remixicon/react";
import { authClient } from "@/lib/better-auth/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Props {
  action: "Sign In" | "Sign Up";
}

const AuthForm = ({ action }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full max-w-md border-[1.5px] border-ink bg-paper p-2 shadow-card-lg">
      <CardHeader className="space-y-2 pb-4">
        <span className="w-fit rounded-chip bg-fog px-3 py-1 font-display text-xs font-bold uppercase tracking-[-0.02em] text-ink">
          Vault Access
        </span>
        <CardTitle className="font-display text-[36px] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-ink">
          {action}
        </CardTitle>
        <CardDescription className="text-base text-mist">
          {action === "Sign In"
            ? "Sign in with Google to open your KipVault."
            : "Create your KipVault account in one click."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <Button
          variant="lift"
          size="lg"
          disabled={isLoading}
          onClick={async () => {
            await authClient.signIn.social(
              {
                provider: "google",
                callbackURL: "/dashboard",
              },
              {
                onSuccess: () => {
                  toast({
                    title: "Success",
                    description: "Redirecting to Google sign in page",
                  });
                },
                onError: (c) => {
                  toast({
                    title: "Error",
                    description: c.error.message,
                  });
                },
                onRequest: () => {
                  setIsLoading(true);
                },
                onResponse: () => {
                  setIsLoading(false);
                },
              }
            );
          }}
        >
          {!isLoading ? (
            <RiGoogleFill />
          ) : (
            <RiLoader3Fill className="animate-spin" />
          )}
          {action} with Google
        </Button>

        <div className="border-t border-fog pt-4 text-center">
          <P variant="muted" size="small" className="w-full text-center">
            {action === "Sign In" ? (
              <>
                Don&apos;t have a vault yet?{" "}
                <Link href="/sign-up" className="link">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have a vault?{" "}
                <Link href="/sign-in" className="link">
                  Sign In
                </Link>
              </>
            )}
          </P>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
