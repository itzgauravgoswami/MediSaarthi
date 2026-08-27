"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import FeatureGrid from "@/components/FeatureGrid";
import VoiceShowcase from "@/components/VoiceShowcase";
import DocumentShowcase from "@/components/DocumentShowcase";
import DoctorDashboardPreview from "@/components/DoctorDashboardPreview";
import AyushSection from "@/components/AyushSection";
import SafetySection from "@/components/SafetySection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

// Prominent Brand Teal Section Divider Component (Thicker 3px & Vibrant Glow)
function WideSectionDivider() {
  return (
    <div className="w-full relative z-20 overflow-hidden">
      <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#18A999] dark:via-[#18A999] to-transparent shadow-[0_0_12px_rgba(24,169,153,0.6)]" />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-page-theme text-primary-theme selection:bg-[#18A999]/30 selection:text-white transition-colors duration-300">
        {/* Navigation Header */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-grow">
          {/* 1. Hero Section with Virtual Intake Kiosk */}
          <HeroSection />

          <WideSectionDivider />

          {/* 2. Credibility & Ecosystem Trust Bar */}
          <TrustBar />

          <WideSectionDivider />

          {/* 3. 5-Step Clinical Intake Workflow */}
          <HowItWorks />

          <WideSectionDivider />

          {/* 4. Complete Platform Capabilities Grid */}
          <FeatureGrid />

          <WideSectionDivider />

          {/* 5. Multilingual Voice AI Assistant Showcase */}
          <VoiceShowcase />

          <WideSectionDivider />

          {/* 6. Medical Document Intelligence OCR & Parsing */}
          <DocumentShowcase />

          <WideSectionDivider />

          {/* 7. Physician Pre-Consultation Summary Portal */}
          <DoctorDashboardPreview />

          <WideSectionDivider />

          {/* 8. AYUSH & Traditional Medicine Integration */}
          <AyushSection />

          <WideSectionDivider />

          {/* 9. Responsible AI Safety & Human Oversight */}
          <SafetySection />

          <WideSectionDivider />

          {/* 10. Frequently Asked Questions Accordion */}
          <FAQSection />

          <WideSectionDivider />

          {/* 11. Final High-Impact Conversion CTA */}
          <FinalCTA />
        </main>

        {/* Footer with Logo & Disclaimers */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
