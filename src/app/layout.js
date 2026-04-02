import "./globals.css";
import { siteConfig } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Web Development Agency`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Web Development Agency`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} | Web Development Agency`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d12",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      telephone: siteConfig.phone,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
    {
      "@type": "Service",
      serviceType: "Web development and website design",
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      areaServed: "Worldwide",
      description:
        "Conversion-focused website design, Next.js development, interactive storytelling, and Spline-ready launch systems.",
    },
    {
      "@type": "WebPage",
      name: `${siteConfig.name} Homepage`,
      url: siteConfig.url,
      description: siteConfig.description,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
