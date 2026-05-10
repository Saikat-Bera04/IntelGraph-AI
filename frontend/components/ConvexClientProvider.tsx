"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";

// Fallback to avoid crashing before the user runs `npx convex dev`
const envUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const isAbsolute = envUrl.startsWith("http://") || envUrl.startsWith("https://");
const convexUrl = isAbsolute ? envUrl : "https://dummy-url.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
