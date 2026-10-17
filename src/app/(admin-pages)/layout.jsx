import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Header from "@/componends/admin/Header";
import Sidebar from "@/componends/admin/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" richColors />

        <div className="min-h-screen bg-[#f8fafc]">

          {/* ================================
              SIDEBAR
          ================================= */}

          <aside className="fixed left-0 top-0 z-40 h-screen w-[330px]">
            <Sidebar />
          </aside>


          {/* ================================
              RIGHT SIDE
          ================================= */}

          <div className="ml-[330px]">

            {/* HEADER */}

            <header className="fixed left-[330px] right-0 top-0 z-30 h-[82px]">
              <Header />
            </header>


            {/* PAGE CONTENT */}

            <main className="min-h-screen pt-[82px]">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}