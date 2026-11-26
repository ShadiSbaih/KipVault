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

import { Loader2 } from "lucide-react";
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
            <svg
              aria-hidden="true"
              className="size-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.805 10.023H12.2v3.955h5.515c-.238 1.275-.96 2.356-2.045 3.081v2.56h3.307c1.935-1.782 3.051-4.407 3.051-7.523 0-.695-.062-1.385-.223-2.073Z" />
              <path d="M12.2 22c2.762 0 5.084-.915 6.779-2.381l-3.307-2.56c-.915.613-2.088.976-3.472.976-2.668 0-4.929-1.802-5.736-4.222H3.046v2.643C4.731 19.805 8.198 22 12.2 22Z" />
              <path d="M6.464 13.813A5.893 5.893 0 0 1 6.149 12c0-.629.108-1.24.315-1.813V7.544H3.046A9.978 9.978 0 0 0 2 12c0 1.613.386 3.14 1.046 4.456l3.418-2.643Z" />
              <path d="M12.2 5.965c1.503 0 2.852.517 3.913 1.531l2.936-2.936C17.279 2.91 14.957 2 12.2 2 8.198 2 4.731 4.195 3.046 7.544l3.418 2.643C7.271 7.767 9.532 5.965 12.2 5.965Z" />
            </svg>
          ) : (
            <Loader2 className="size-4 animate-spin" />
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
