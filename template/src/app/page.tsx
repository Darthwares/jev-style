import type { Metadata } from "next";
import { FAQ, Landing } from "@/components/site/landing";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  title: "SITE — what it does in six words",
  description: "One sentence with the measured number.",
  alternates: { canonical: "/" },
  openGraph: { title: "SITE — what it does", description: "One sentence.", url: BASE, type: "website" },
  twitter: { card: "summary_large_image", title: "SITE — what it does", description: "One sentence." },
};

export default function Page() {
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "SITE", url: BASE, applicationCategory: "DeveloperApplication", operatingSystem: "Web", description: "What it does.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  return (
    <>
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />)}
      <Landing />
    </>
  );
}
