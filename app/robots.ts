import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const isPreview = process.env.NEXT_PUBLIC_ENV === "preview";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: isPreview? ["/"] : [] }],
    sitemap: isPreview ? undefined : (base ? `${base}/sitemap.xml` : undefined),
  };
}


