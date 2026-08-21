import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Recipe Planner",
  description:
    "Crea y ajusta tu receta de café perfecta: método, proporción, temperatura y preparación paso a paso.",
  openGraph: {
    title: "Coffee Recipe Planner",
    description: "Diseña. Prepara. Disfruta.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee Recipe Planner",
    description: "Diseña. Prepara. Disfruta.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
