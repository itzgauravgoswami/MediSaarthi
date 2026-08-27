"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Stethoscope, User, Building2, Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      role: "Doctor",
      quote: "Instead of spending the first few minutes collecting basic history, I can begin the consultation with the patient's information already organized.",
      author: "Dr. Ananya Sharma",
      title: "Senior Cardiologist",
      badge: "Representative demo testimonial",
      icon: Stethoscope,
      avatarBg: "bg-[#0F4C5C] text-white",
    },
    {
      role: "Patient",
      quote: "I could explain my problem by speaking in Hindi instead of filling out a long form. The voice assistant asked clear follow-up questions.",
      author: "Raj Kumar",
      title: "OPD Patient",
      badge: "Representative demo testimonial",
      icon: User,
      avatarBg: "bg-[#6366F1] text-white",
    },
    {
      role: "Hospital Administrator",
      quote: "The goal is simple: move repetitive information collection away from the consultation room and streamline our OPD queue management.",
      author: "Healthcare Operations Lead",
      title: "Multi-Specialty Hospital Network",
      badge: "Representative demo testimonial",
      icon: Building2,
      avatarBg: "bg-emerald-600 text-white",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  const Icon = current.icon;

  return (
    <section className="py-24 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#111111] text-[#18A999] text-xs font-bold uppercase tracking-widest border border-[#27272a]">
            REPRESENTATIVE CLINICAL FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-newsreader">
            Designed for doctors, built for patients.
          </h2>
          <p className="text-[#a1a1aa] text-base sm:text-lg">
            Illustrative feedback demonstrating how MediSaarthi transforms interactions for healthcare providers and patients alike.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="max-w-4xl mx-auto bg-[#111111] rounded-3xl p-8 sm:p-12 border border-[#27272a] shadow-2xl relative">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#27272a]">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${current.avatarBg} flex items-center justify-center font-bold shadow-md`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white font-newsreader">{current.author}</h3>
                <p className="text-xs font-semibold text-[#a1a1aa]">{current.title}</p>
              </div>
            </div>

            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#18181b] text-[#a1a1aa] border border-[#27272a] italic">
              * {current.badge}
            </span>
          </div>

          {/* Quote Body */}
          <div className="relative mb-8 space-y-4">
            <Quote className="w-10 h-10 text-[#18A999]/20 absolute -top-4 -left-4 pointer-events-none" />
            <p className="text-lg sm:text-xl font-medium text-white leading-relaxed italic pl-6 font-newsreader">
              "{current.quote}"
            </p>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all focus-accessible ${
                    currentIndex === idx ? "w-8 bg-[#18A999]" : "w-2.5 bg-[#27272a] hover:bg-[#3f3f46]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-[#18181b] border border-[#27272a] text-white hover:bg-[#27272a] hover:text-[#18A999] shadow-md transition-all focus-accessible"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-[#18181b] border border-[#27272a] text-white hover:bg-[#27272a] hover:text-[#18A999] shadow-md transition-all focus-accessible"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
