"use client";

import { motion } from "framer-motion";
import type { PortfolioCategoryId } from "@/content/portfolio";

type FilterBarProps = {
  categories: { id: PortfolioCategoryId; label: string }[];
  activeFilter: PortfolioCategoryId | "all";
  onFilter: (id: PortfolioCategoryId | "all") => void;
};

export function FilterBar({ categories, activeFilter, onFilter }: FilterBarProps) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="Filter by category">
      <motion.button
        type="button"
        onClick={() => onFilter("all")}
        className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${
          activeFilter === "all"
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        All
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          type="button"
          onClick={() => onFilter(cat.id)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${
            activeFilter === cat.id
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {cat.label}
        </motion.button>
      ))}
    </nav>
  );
}
