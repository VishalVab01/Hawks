import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { PageTransitionProvider } from "./components/page-transition";

config.autoAddCss = false;

export const metadata: Metadata = { title: "Hawks Youth Club — Rise Together", description: "A Bhagalpur youth club helping children grow through sports, creative expression, life skills, mentorship, and community." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><PageTransitionProvider>{children}</PageTransitionProvider></body></html>;
}
