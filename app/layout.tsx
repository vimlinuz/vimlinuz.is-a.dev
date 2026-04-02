import type { Metadata } from "next";
import { inter, jetbrainsMono, playfair, dancingScript } from "./fonts";
import InteractiveBackground from "./components/InteractiveBackground";
import Oneko from "./components/Oneko";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://santoshxshrestha.tech"),
  title: "vimlinuz - Home",
  description: "vimlinuz's personal website. Explore more about Santosh.",
  keywords:
    "vimlinuz, personal website, projects, blog, NixOS, developer, portfolio",
  openGraph: {
    images: "/santosh.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${dancingScript.variable} antialiased`}
      >
        <InteractiveBackground />
        <Oneko />
        {children}
      </body>
    </html>
  );
}
