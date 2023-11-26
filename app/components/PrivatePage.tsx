import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuthState, useRedirect } from "react-admin";

const PrivatePage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isLoading: authLoading, authenticated } = useAuthState();

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.replace("/login");
    }
  }, [authLoading, authenticated, router]);

  if (authLoading) {
    return <p>Loading</p>;
  }

  return <div>{children}</div>;
};

export default PrivatePage;
