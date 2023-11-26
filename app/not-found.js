"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToMainPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  });

  return null;
}
