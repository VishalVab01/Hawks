import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Hawks Youth Club — Rise Together", description: "Sport, purpose and possibility for Bihar's youth." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
