import type { Metadata } from "next";
import "./globals.css";
import { readData } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await readData<{ metaTitle: string; metaDescription: string }>("settings.json");
  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
