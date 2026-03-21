"use client";

import { motion } from "framer-motion";

type PortfolioHeroProps = {
  subtitle?: string;
};

export function PortfolioHero({ subtitle }: PortfolioHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-transparent to-neutral-100/50 dark:from-neutral-900/50 dark:to-neutral-950/50" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400/90"
        >
          {subtitle ?? "Selected Work"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl md:text-7xl"
        >
          Portfolio
        </motion.h1>
      </div>
    </section>
  );
}
