"use client";

import { ReactNode } from "react";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { ScrollProgress } from "@/components/site/ScrollProgress";

type RootWithScrollProps = {
  children: ReactNode;
};

export function RootWithScroll({ children }: RootWithScrollProps) {
  useLenisScroll();
  return (
    <>
      <ScrollProgress />
      {children}
    </>
  );
}
