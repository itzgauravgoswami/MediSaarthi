import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata = {
  title: "MediSaarthi | Your AI Clinical Intake Companion",
  description: "MediSaarthi is an AI-powered clinical intake and patient history platform for hospitals, clinics, and AYUSH institutions.",
  keywords: ["MediSaarthi", "Clinical Intake AI", "Patient History Platform", "Multilingual Voice AI", "AYUSH History"],
  authors: [{ name: "MediSaarthi HealthTech" }],
  openGraph: {
    title: "MediSaarthi — Your AI Clinical Intake Companion",
    description: "Empowering doctors with AI-guided pre-consultation patient intake, multilingual voice history, document processing, and AYUSH support.",
    url: "https://medisaarthi.ai",
    siteName: "MediSaarthi",
    images: [
      {
        url: "/logo/logo.png",
        width: 800,
        height: 600,
        alt: "MediSaarthi AI Clinical Intake Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable} dark scroll-smooth antialiased`} data-theme="dark">
      <body className="min-h-screen flex flex-col bg-page-theme text-primary-theme transition-colors duration-300 selection:bg-[#18A999]/30 selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
