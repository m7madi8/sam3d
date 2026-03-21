"use client";

import { useEffect, useState } from "react";
import styles from "../site/site.module.css";

type CursorState = {
  x: number;
  y: number;
  label: string;
  visible: boolean;
};

export function CustomCursor({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState<CursorState>({
    x: 0,
    y: 0,
    label: "",
    visible: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (event: MouseEvent) => {
      setState((current) => ({
        ...current,
        x: event.clientX,
        y: event.clientY,
        visible: true,
      }));
    };

    const handleMouseOver = (event: Event) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest<HTMLElement>("[data-cursor-label]");
      setState((current) => ({
        ...current,
        label: interactive?.dataset.cursorLabel ?? "",
      }));
    };

    const handleLeave = () =>
      setState((current) => ({ ...current, visible: false, label: "" }));

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={styles.customCursor}
      aria-hidden="true"
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
        opacity: state.visible ? 1 : 0,
      }}
    >
      <span>{state.label || "Explore"}</span>
    </div>
  );
}
