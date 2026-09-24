import type { Metadata } from "next";
import { Shell } from "@/components/site/shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SITE app — run it",
  description: "The app view.",
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  return <Shell hasApiKey={Boolean(process.env.TYPESAFE_API_KEY)} model="jev-latest" pricePerMtok={0.042} />;
}
