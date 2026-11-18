import type { ReactNode } from "react";
import type { ContactId } from "@/content/types";

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  children: ReactNode;
}

function Svg({ size = 24, strokeWidth = 1.8, className, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <Svg size={18} strokeWidth={2.2} className="rtl:-scale-x-100">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function SunIcon() {
  return (
    <Svg size={19} strokeWidth={1.9}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  );
}

export function MoonIcon() {
  return (
    <Svg size={19} strokeWidth={1.9}>
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </Svg>
  );
}

export function ContactGlyph({ id }: { id: ContactId }) {
  return (
    <Svg size={22}>
      {id === "telegram" && (
        <>
          <path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" />
          <path d="M9 13l12-9" />
        </>
      )}
      {id === "email" && (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </>
      )}
      {id === "phone" && (
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
      )}
      {id === "whatsapp" && <path d="M21 12a8 8 0 01-11.8 7L4 20l1.1-4.9A8 8 0 1121 12z" />}
      {id === "github" && <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />}
    </Svg>
  );
}
