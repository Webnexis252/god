import { siteConfig } from "@/lib/site";

export default function sitemap() {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date("2026-03-31"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
