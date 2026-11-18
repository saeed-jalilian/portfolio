import type { ReactNode } from "react";
import { RootDocument } from "@/components/RootDocument";
export { viewport } from "@/lib/metadata";

export default function Layout({ children }: { children: ReactNode }) {
  return <RootDocument locale="fa">{children}</RootDocument>;
}
