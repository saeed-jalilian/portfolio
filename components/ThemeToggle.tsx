"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./landing/Icons";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
const getServerSnapshot = (): Theme => "light";

export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme-swap", "");
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? toLight : toDark}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg border border-line2 text-text press"
    >
      <span className="show-in-dark">
        <SunIcon />
      </span>
      <span className="show-in-light">
        <MoonIcon />
      </span>
    </button>
  );
}
