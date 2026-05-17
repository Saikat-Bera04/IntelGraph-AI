"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";

const envUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim() || "";

// Validate Convex URL is properly configured
if (!envUrl && typeof window !== 'undefined') {
  console.warn(
    "⚠️  NEXT_PUBLIC_CONVEX_URL environment variable is not set. " +
    "Convex integration will use demo fallback. For production, set the environment variable."
  );
}

// Use configured URL or demo fallback (safe for dev/build, should fail gracefully in production)
const convexUrl = envUrl || "https://insightful-magpie-137.convex.cloud";

const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
