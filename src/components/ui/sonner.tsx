 "use client";

import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

export function Toaster({ ...props }: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      theme="system"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-border bg-card/90 backdrop-blur-xl shadow-xl text-foreground",
          description: "text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/70 border border-border"
        }
      }}
      {...props}
    />
  );
}

