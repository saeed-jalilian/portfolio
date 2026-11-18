import { Landing } from "@/components/Landing";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en");

export default function Page() {
  return <Landing locale="en" />;
}
