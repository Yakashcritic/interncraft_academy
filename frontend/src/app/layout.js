import "./globals.css";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: "InternCraft Academy | Premium Student Internship Program",
  description:
    "InternCraft Academy is a premium internship platform for students with live classes, recorded sessions, projects, certificates, and support.",
  keywords: [
    "internship",
    "student internship",
    "internship program",
    "AI internship",
    "digital marketing internship",
    "editing internship",
    "business internship",
    "InternCraft Academy",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} ${plusJakarta.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}