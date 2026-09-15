import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./providers/authContext";

export const metadata: Metadata = {
  title: "ROLE BASE ACCESS CONTROL SYSTEM",
  description: "ITS A APP USING NEXTJS 16 AND REACT 19 TO MANAGE ROLE BASE ACCESS CONTROL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-950 text-slate">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
