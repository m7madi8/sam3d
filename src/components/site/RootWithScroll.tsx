"use client";

import { ReactNode } from "react";
import { useLenisScroll } from "@/hooks/useLenisScroll";

type RootWithScrollProps = {
  children: ReactNode;
};

export function RootWithScroll({ children }: RootWithScrollProps) {
  useLenisScroll();
  return <>{children}</>;
}
