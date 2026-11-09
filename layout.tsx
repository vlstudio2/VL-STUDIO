import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "VL STUDIO — Create Your World",
  description: "Roblox maps, clothing, digital products, and creative services by VL STUDIO."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body>{children}</body></html>;
}