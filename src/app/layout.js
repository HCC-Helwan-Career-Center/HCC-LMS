import "./globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export const metadata = {
  title: "HCC – Helwan Career Center | Launch Your Career",
  description:
    "HCC empowers Helwan University engineering students through structured AI, Cybersecurity, and Software Engineering tracks with project-based learning and open-source contributions.",
  keywords: [
    "HCC",
    "Helwan Career Center",
    "Helwan University",
    "AI",
    "Cybersecurity",
    "Software Engineering",
    "LMS",
    "Student Activity",
  ],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
