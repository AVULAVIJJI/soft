"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // Token validate cheyyi - expired aithe login ki pampu
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.clear();
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      localStorage.clear();
      router.replace("/login");
    }
  }, [router]);
  return null;
}