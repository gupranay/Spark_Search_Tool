import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spark Consultant Data",
  description: "Pull Consultant Data from Salesforce",
  robots: "noindex",
  openGraph: {
    title: "Spark Consultant Data",
    description: "Pull Consultant Data from Salesforce",
    type: "website",
    url: "https://spark-search-tool.vercel.app/",
    siteName: "Spark Consultant Platform",
    images: [
      {
        url: "https://annarborusa.org/wp-content/uploads/2022/08/SPARK-Stacked-Logo-Official-1024x320.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/spark_logo.png" />
      </head>
      <Analytics/>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
