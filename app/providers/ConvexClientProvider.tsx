"use client";

import { ReactNode, useEffect } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { ConvexReactClient, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function SyncUser({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);

  useEffect(() => {
    if (isSignedIn) {
      getOrCreateUser().catch(console.error);
    }
  }, [isSignedIn, getOrCreateUser]);

  return <>{children}</>;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <SyncUser>{children}</SyncUser>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
