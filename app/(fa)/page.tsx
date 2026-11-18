import { Landing } from "@/components/Landing";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("fa");

export default function Page() {
  return <Landing locale="fa" />;
}
