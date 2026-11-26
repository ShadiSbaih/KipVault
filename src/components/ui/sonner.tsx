"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-card group-[.toaster]:border-[1.5px] group-[.toaster]:border-ink group-[.toaster]:bg-paper group-[.toaster]:text-ink group-[.toaster]:shadow-card-lg",
          description: "group-[.toast]:text-mist",
          actionButton:
            "group-[.toast]:rounded-pill group-[.toast]:border group-[.toast]:border-ink group-[.toast]:bg-butter group-[.toast]:text-ink",
          cancelButton:
            "group-[.toast]:rounded-pill group-[.toast]:bg-fog group-[.toast]:text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
