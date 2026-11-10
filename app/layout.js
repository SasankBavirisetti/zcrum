import { Inter, Inter_Tight } from "next/font/google";
import { dark, shadesOfPurple } from "@clerk/ui/themes";

import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Header from "../components/header";
const inter = Inter_Tight({ subsets: ["latin"] });

export const metadata = {
  title: "Zcrum",
  description: "Project Management App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${inter.className}`}
    >
      <body className="min-h-full flex flex-col dotted-background">
        <ClerkProvider
          appearance={{
            theme: shadesOfPurple,
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#1a202c",
              colorInputBackground: "#2D3748",
              colorInputText: "#F3F4F6",
            },
            elements: {
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
              card: "bg-gray-800",
              headerTitle: "text-blue-400",
              headerSubtitle: "text-gray-400",
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-screen pb-3">{children}</main>
            <footer className="bg-gray-900 py-12">
              <div className="container mx-auto text-center px-4 text-gray-200">
                <p>Made with 💗 by RoadsideCoder</p>
              </div>
            </footer>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
