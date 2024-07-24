import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "@/components/Head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spark Consultant Platform",
  description: "Search for consultants and hire them for your projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head title={""} />
      <head>
        <link rel="icon" href="/spark_logo.png"/>
        
      </head>
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
