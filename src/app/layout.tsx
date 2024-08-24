import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const dancingScript = Dancing_Script({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "huayanjun",
  description: "A blog of huayanjun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="layout-container">
          {children}
        </div>
      </body>
    </html>
  );
}