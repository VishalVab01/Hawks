import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { PageTransitionProvider } from "./components/page-transition";

config.autoAddCss = false;

export const metadata: Metadata = { title: "Hawks Youth Club — Rise Together", description: "Sport, purpose and possibility for Bihar's youth." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PageTransitionProvider>{children}</PageTransitionProvider></body></html>;
}
