import React, { useEffect } from "react";
import { useAuthState, useRedirect } from "react-admin";

const PrivatePage = ({ children }: { children: React.ReactNode }) => {
  const redirect = useRedirect();
  const { isLoading: authLoading, authenticated } = useAuthState();

  useEffect(() => {
    if (!authLoading && !authenticated) {
      //redirect("/login");
    }
  }, [authLoading, authenticated, redirect]);

  if (authLoading) {
    return <p>Loading</p>;
  }

  return <div>{children}</div>;
};

export default PrivatePage;
