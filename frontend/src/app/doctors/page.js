"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import DoctorAvatar from '@/components/patient/DoctorAvatar';
import { doctorApi, appointmentApi } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SPECIALTY_CATEGORIES, popularDiseases } from '@/constants/medicalSpecialties';
import { 
  Search, 
  Stethoscope, 
  Star, 
  MapPin, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles,
  Building2,
  Award,
  Lock,
  LogIn,
  UserCheck
} from 'lucide-react';

export default function PublicDoctorsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const { isAuthenticated, user, login } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('rating');
  const [bookingModalDoc, setBookingModalDoc] = useState(null);
  const [showAuthRequiredModal, setShowAuthRequiredModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('03:30 PM');

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoadingDoctors(true);
        const data = await doctorApi.getDoctors();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchSearch = !searchQuery ||
        (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialization || doc.department || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' ||
        (doc.specialization || doc.department || '').toLowerCase().includes(selectedCategory.toLowerCase());
      const matchPrice = !doc.consultationFee || doc.consultationFee <= maxPrice;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [doctors, searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleBook = (doc) => {
    if (!isAuthenticated || !user) {
      setBookingModalDoc(doc);
      setShowAuthRequiredModal(true);
      return;
    }
    setBookingModalDoc(doc);
    setShowAuthRequiredModal(false);
    setBookingSuccess(false);
  };

  const handleQuickLoginAsPatient = () => {
    setShowAuthRequiredModal(false);
    router.push('/login');
  };

  const handleConfirm = () => {
    if (!isAuthenticated || !user) {
      setShowAuthRequiredModal(true);
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalDoc(null);
      setBookingSuccess(false);
    }, 2800);
  };

  const popularDiseases = [
    { label: 'Heart Attack', labelHi: 'हार्ट अटैक', query: 'heart attack' },
    { label: 'Diabetes', labelHi: 'डायबिटीज / शुगर', query: 'diabetes' },
    { label: 'Stroke & Paralysis', labelHi: 'लकवा / स्ट्रोक', query: 'stroke' },
    { label: 'Asthma & Lungs', labelHi: 'अस्थमा / दमा', query: 'asthma' },
    { label: 'Joint & Knee Pain', labelHi: 'घुटने व जोड़ दर्द', query: 'joint' },
    { label: 'Skin & Psoriasis', labelHi: 'सोरायसिस / त्वचा', query: 'psoriasis' },
    { label: 'PCOS / Thyroid', labelHi: 'थायरॉइड / पीसीओडी', query: 'thyroid' },
    { label: 'Kidney Stones', labelHi: 'गुर्दे की पथरी', query: 'kidney stones' },
    { label: 'Eye & Cataract', labelHi: 'मोतियाबिंद', query: 'cataract' },
    { label: 'Depression & Anxiety', labelHi: 'डिप्रेशन / तनाव', query: 'depression' },
    { label: 'Ayurveda & Prakriti', labelHi: 'आयुर्वेद / नाड़ी परीक्षा', query: 'ayurveda' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Public Landing Navbar */}
      <Navbar />

      {/* Background Ambient Glow & Gridlines */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#18A999]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-85 dark:opacity-60 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)"
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 space-y-10 relative z-10">
        
        {/* Public Hero Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F4C5C]/10 dark:bg-[#0F4C5C]/30 text-[#18A999] border border-[#18A999]/30 text-xs font-bold uppercase tracking-wider font-mono shadow-xs">
            <Award className="w-4 h-4 text-[#18A999]" />
            {isHindi ? 'भारत का अग्रणी विशेषज्ञ क्लिनिकल नेटवर्क' : "India's Leading Specialist Clinical Network"}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white font-newsreader tracking-tight leading-tight">
            {isHindi ? (
              <>
                शीर्ष डॉक्टरों से परामर्श लें, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C5C] via-[#18A999] to-[#2DD4BF]">
                  हर बीमारी का सटीक उपचार
                </span>
              </>
            ) : (
              <>
                Find & Consult Top Doctors for <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C5C] via-[#18A999] to-[#2DD4BF]">
                  Every Known Disease
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            {isHindi 
              ? 'मैक्स सुपर स्पेशलिटी अस्पताल, नई दिल्ली के सभी विभागों के शीर्ष विशेषज्ञों से ऑनलाइन एवं अस्पताल परामर्श बुक करें।'
              : 'Connect with verified super-specialists from Max Super Speciality Hospital, New Delhi with integrated AI pre-consultation intake.'}
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#111111] rounded-full border border-slate-200 dark:border-[#27272a] shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              100% NABH & MCI Verified
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#111111] rounded-full border border-slate-200 dark:border-[#27272a] shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-[#18A999]" />
              50+ Medical Disciplines
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#111111] rounded-full border border-slate-200 dark:border-[#27272a] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pre-Intake Voice AI Enabled
            </span>
          </div>
        </div>

        {/* Search, Disease Pills & Specialty Filters */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] p-4 sm:p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#18A999]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi 
                  ? "रोग का नाम, डॉक्टर, अस्पताल या विशेषज्ञता खोजें (उदा. Heart Attack, Diabetes, Cancer, Migraine)..." 
                  : "Search disease, symptoms, doctor name, hospital or city (e.g. Heart Attack, Diabetes, Migraine, Psoriasis)..."}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#18A999] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#18A999]"
              >
                <option value="rating">{isHindi ? 'रेटिंग: उच्चतम पहले' : 'Sort: Highest Rated'}</option>
                <option value="experience">{isHindi ? 'अनुभव: वरिष्ठ पहले' : 'Sort: Most Experienced'}</option>
                <option value="price_asc">{isHindi ? 'शुल्क: कम से अधिक' : 'Fee: Low to High'}</option>
                <option value="price_desc">{isHindi ? 'शुल्क: अधिक से कम' : 'Fee: High to Low'}</option>
              </select>

              {/* Price Filter */}
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#18A999]"
              >
                <option value={2000}>{isHindi ? 'सभी शुल्क (INR)' : 'All Fees (INR)'}</option>
                <option value={800}>{isHindi ? '₹800 तक' : 'Under ₹800'}</option>
                <option value={1000}>{isHindi ? '₹1,000 तक' : 'Under ₹1,000'}</option>
                <option value={1200}>{isHindi ? '₹1,200 तक' : 'Under ₹1,200'}</option>
                <option value={1500}>{isHindi ? '₹1,500 तक' : 'Under ₹1,500'}</option>
              </select>
            </div>
          </div>

          {/* Quick Disease Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-[#18A999] uppercase tracking-wider shrink-0 font-mono">
              {isHindi ? 'त्वरित खोज:' : 'Quick Disease Search:'}
            </span>
            {popularDiseases.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(item.query)}
                className={`px-3 py-1 rounded-full border shrink-0 transition-all font-medium ${
                  searchQuery.toLowerCase() === item.query
                    ? 'bg-[#0F4C5C] text-white border-[#18A999]'
                    : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999]'
                }`}
              >
                {isHindi ? item.labelHi : item.label}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-2 scrollbar-none border-t border-slate-100 dark:border-[#27272a]">
            {SPECIALTY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-md'
                      : 'bg-slate-100/70 dark:bg-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/50'
                  }`}
                >
                  <span>{isHindi ? cat.labelHi : cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter and Results */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-[#a1a1aa] font-mono">
            {isHindi ? `उपलब्ध विशेषज्ञ: ${filteredDoctors.length}` : `Displaying ${filteredDoctors.length} Specialists`}
          </span>
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs font-bold text-[#18A999] hover:underline"
            >
              {isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}
            </button>
          )}
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] dark:hover:border-[#18A999] rounded-3xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4 group relative"
            >
              <div className="flex gap-4">
                <DoctorAvatar
                  src={doc.image}
                  name={doc.name}
                  specialty={doc.specialty}
                  size="md"
                  className="group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase font-mono">
                      {doc.experienceYears}+ {isHindi ? 'वर्ष अनुभव' : 'Yrs Exp'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white font-newsreader leading-snug group-hover:text-[#18A999] transition-colors truncate">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F4C5C] dark:text-[#18A999] line-clamp-1">
                    {doc.specialty}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                    {doc.qualification}
                  </p>
                </div>
              </div>

              {/* Hospital & Location */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-[#1f1f23]">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#18A999] shrink-0" />
                  <strong className="font-semibold text-slate-900 dark:text-white truncate">{doc.hospital}</strong>
                </span>
                <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                  {doc.location}
                </span>
              </div>

              {/* Small Description */}
              <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
                {isHindi ? (doc.descriptionHindi || doc.description) : doc.description}
              </p>

              {/* Treated Diseases Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  {isHindi ? 'उपचारित रोग:' : 'Key Conditions Treated:'}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-hidden">
                  {(doc.treatedDiseases || []).slice(0, 3).map((dis, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(dis.split('(')[0].trim())}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-colors truncate max-w-[200px]"
                      title={dis}
                    >
                      {dis}
                    </button>
                  ))}
                  {(doc.treatedDiseases || []).length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                      +{(doc.treatedDiseases || []).length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Price & Booking Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#27272a] flex items-center justify-between gap-2">
                <div className="shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase leading-tight">
                    {isHindi ? 'परामर्श शुल्क' : 'Consultation Fee'}
                  </span>
                  <span className="text-lg md:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                    ₹{doc.priceINR}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href="/patient/interview">
                    <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] hover:text-[#18A999] text-xs font-semibold transition-all">
                      {isHindi ? 'प्री-इंटेक' : 'Pre-Intake'}
                    </button>
                  </Link>
                  <button
                    onClick={() => handleBook(doc)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white text-xs font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>{isHindi ? 'अपॉइंटमेंट' : 'Book Visit'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0F4C5C]/10 text-[#18A999] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-newsreader">
              {isHindi ? 'कोई डॉक्टर नहीं मिला' : 'No Doctors Found Matching Your Query'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isHindi 
                ? 'कृपया अलग कीवर्ड या रोग का नाम खोजें अथवा सभी फ़िल्टर साफ़ करें।' 
                : 'Try adjusting your search keywords or clear category filters to view all specialists.'}
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMaxPrice(2000); }}>
              {isHindi ? 'सभी डॉक्टर्स देखें' : 'View All Doctors'}
            </Button>
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#0F4C5C] via-[#148e81] to-[#0F4C5C] text-white border border-[#18A999]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-200">
              SMART CLINICAL ONBOARDING
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-newsreader text-white">
              {isHindi 
                ? 'डॉक्टर से मिलने से पहले अपना वॉयस इंटेक रिकॉर्ड करें' 
                : 'Complete Your AI Voice Intake Before Meeting Your Doctor'}
            </h3>
            <p className="text-xs md:text-sm text-teal-100 leading-relaxed">
              {isHindi 
                ? 'अपनी मातृभाषा में लक्षण बोलें और पुराने पर्चे अपलोड करें। डॉक्टर 30 सेकंड में आपका संरचित क्लिनिकल इतिहास देख सकेंगे।'
                : 'Speak symptoms in your native language and upload previous prescriptions. Save 70% OPD consultation waiting time.'}
            </p>
          </div>
          <Link href="/patient/interview" className="shrink-0">
            <Button size="lg" className="bg-white text-[#0F4C5C] hover:bg-slate-100 font-extrabold shadow-xl border-none">
              {isHindi ? 'वॉयस इंटेक शुरू करें' : 'Start Voice Intake'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Auth Required Prompt Modal */}
      {showAuthRequiredModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => { setShowAuthRequiredModal(false); setBookingModalDoc(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold font-newsreader text-slate-900 dark:text-white">
                {isHindi ? 'लॉगिन आवश्यक है' : 'Login Required to Book'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">
                {isHindi 
                  ? 'डॉक्टर से परामर्श स्लॉट बुक करने और रोगी टोकन प्राप्त करने के लिए कृपया अपने खाते में साइन इन करें।' 
                  : 'You must be logged in to confirm an appointment and receive your verified patient consultation token.'}
              </p>
            </div>

            {bookingModalDoc && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] flex items-center gap-3">
                <DoctorAvatar
                  src={bookingModalDoc.image}
                  name={bookingModalDoc.name}
                  specialty={bookingModalDoc.specialty}
                  size="sm"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-newsreader truncate">{bookingModalDoc.name}</h4>
                  <p className="text-[11px] text-[#18A999] truncate">{bookingModalDoc.specialty}</p>
                  <p className="text-[10px] text-emerald-500 font-bold font-mono">Fee: ₹{bookingModalDoc.priceINR}</p>
                </div>
              </div>
            )}

            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                onClick={handleQuickLoginAsPatient}
                icon={UserCheck}
                fullWidth
              >
                {isHindi ? 'मरीज के रूप में तुरंत लॉगिन करें' : 'Quick Sign In as Patient'}
              </Button>
              <Link href="/login?role=patient&redirect=/doctors" className="block">
                <Button
                  variant="outline"
                  icon={LogIn}
                  fullWidth
                >
                  {isHindi ? 'लॉगिन पृष्ठ पर जाएं' : 'Go to Standard Login Page'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking Modal (When Authenticated) */}
      {bookingModalDoc && !showAuthRequiredModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setBookingModalDoc(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader">
                  {isHindi ? 'परामर्श स्लॉट बुक हो गया!' : 'Appointment Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {isHindi 
                    ? `आपका अपॉइंटमेंट डॉ. ${bookingModalDoc.name} के साथ ${selectedDate} को ${selectedSlot} बजे के लिए बुक हो गया है।`
                    : `Your consultation with ${bookingModalDoc.name} is confirmed for ${selectedDate} at ${selectedSlot}.`}
                </p>
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                  {isHindi ? 'परामर्श शुल्क: ' : 'Confirmed Fee: '} ₹{bookingModalDoc.priceINR} (Booked for {user?.name || 'Patient'})
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-[#27272a] pb-4">
                  <DoctorAvatar
                    src={bookingModalDoc.image}
                    name={bookingModalDoc.name}
                    specialty={bookingModalDoc.specialty}
                    size="md"
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-newsreader">
                      {bookingModalDoc.name}
                    </h3>
                    <p className="text-xs text-[#18A999] font-semibold">
                      {bookingModalDoc.specialty}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {bookingModalDoc.hospital} • {bookingModalDoc.location}
                    </p>
                  </div>
                </div>

                {/* Patient Profile Info */}
                <div className="p-3 rounded-2xl bg-teal-50/50 dark:bg-[#0F4C5C]/20 border border-teal-200/50 dark:border-[#18A999]/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Logged In Patient:</span>
                    <strong className="text-slate-900 dark:text-white font-newsreader">{user?.name || 'Patient'}</strong>
                  </div>
                  {user?.token && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#18A999] text-white text-[10px] font-bold font-mono">
                      TOKEN {user.token}
                    </span>
                  )}
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
                    {isHindi ? 'परामर्श तिथि चुनें:' : 'Select Consultation Date:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedDate === d
                            ? 'bg-[#0F4C5C] text-white border-[#18A999]'
                            : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {d === 'Today' ? (isHindi ? 'आज' : 'Today') : d === 'Tomorrow' ? (isHindi ? 'कल' : 'Tomorrow') : (isHindi ? '2 दिन बाद' : 'In 2 Days')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
                    {isHindi ? 'समय स्लॉट चुनें:' : 'Select Time Slot:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['10:30 AM', '02:30 PM', '03:30 PM', '05:00 PM', '06:15 PM', '07:30 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                          selectedSlot === slot
                            ? 'bg-[#18A999] text-white border-[#18A999]'
                            : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fee Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">
                      {isHindi ? 'कुल परामर्श शुल्क' : 'Total Consultation Fee'}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{bookingModalDoc.priceINR}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    NABH Hospital Desk
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setBookingModalDoc(null)}
                    fullWidth
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    fullWidth
                  >
                    {isHindi ? 'अपॉइंटमेंट पक्का करें' : 'Confirm Consultation'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
