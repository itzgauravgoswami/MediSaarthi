"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DOCTORS_DATA, SPECIALTY_CATEGORIES, searchDoctors } from '@/data/doctorsData';
import { useLanguage } from '@/context/LanguageContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DoctorAvatar from '@/components/patient/DoctorAvatar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  Stethoscope, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Award, 
  Lock, 
  LogIn, 
  UserCheck,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function PatientDoctorsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const { isAuthenticated, user, login } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('02:30 PM');

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return searchDoctors(searchQuery, selectedCategory, maxPrice, sortBy);
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleBookDoctor = (doc) => {
    if (!isAuthenticated || !user) {
      setSelectedDoctorForBooking(doc);
      setShowAuthModal(true);
      return;
    }
    setSelectedDoctorForBooking(doc);
    setShowAuthModal(false);
    setBookingSuccess(false);
  };

  const handleQuickLoginAsPatient = () => {
    login('patient', { name: 'Rahul Kumar', email: 'rahul.kumar@gmail.com' });
    setShowAuthModal(false);
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedDoctorForBooking(null);
      setBookingSuccess(false);
    }, 2400);
  };

  // Popular Disease Tags for 1-Click Search
  const popularDiseases = [
    { label: 'Heart Attack', labelHi: 'हार्ट अटैक', query: 'heart attack' },
    { label: 'Diabetes', labelHi: 'डायबिटीज', query: 'diabetes' },
    { label: 'Stroke / Paralysis', labelHi: 'लकवा / स्ट्रोक', query: 'stroke' },
    { label: 'Asthma & Lungs', labelHi: 'अस्थमा / दमा', query: 'asthma' },
    { label: 'Knee & Joint Pain', labelHi: 'घुटने का दर्द', query: 'joint' },
    { label: 'Skin & Psoriasis', labelHi: 'सोरायसिस / त्वचा', query: 'psoriasis' },
    { label: 'Thyroid / PCOS', labelHi: 'थायरॉइड', query: 'thyroid' },
    { label: 'Kidney Stones', labelHi: 'गुर्दे की पथरी', query: 'kidney stones' },
    { label: 'Cataract & Eye', labelHi: 'मोतियाबिंद', query: 'cataract' },
    { label: 'Depression & Anxiety', labelHi: 'तनाव / डिप्रेशन', query: 'depression' },
    { label: 'Ayurveda & AYUSH', labelHi: 'आयुर्वेद / नाड़ी', query: 'ayurveda' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl w-full mx-auto space-y-4">
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0F4C5C]/20 via-[#18A999]/10 to-transparent border border-[#18A999]/25 dark:border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#18A999]/20 text-[#18A999]">
                <Stethoscope className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader tracking-tight">
                {isHindi ? 'विशेषज्ञ चिकित्सक एवं परामर्श' : 'Find & Book Specialist Doctors'}
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#18A999]/15 text-[#18A999] border border-[#18A999]/30 font-mono">
                {filteredDoctors.length} {isHindi ? 'डॉक्टर उपलब्ध' : 'Verified Available'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#a1a1aa] max-w-xl leading-relaxed">
              {isHindi 
                ? 'मैक्स सुपर स्पेशलिटी अस्पताल, नई दिल्ली के सभी विभागों के शीर्ष विशेषज्ञों से परामर्श स्लॉट बुक करें।'
                : 'Connect with verified super-specialists across all departments of Max Super Speciality Hospital, New Delhi.'}
            </p>
          </div>

          {/* Quick Action & Patient Token Pill */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] text-xs">
              <span className="text-[10px] text-slate-400 block font-mono">ACTIVE TOKEN</span>
              <span className="font-extrabold text-[#18A999] font-mono">TOKEN #102</span>
            </div>
            <Link href="/patient/interview">
              <Button size="sm" variant="primary" icon={Sparkles}>
                {isHindi ? 'वॉयस प्री-इंटेक' : 'AI Pre-Intake'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search, Sort & Filter Row */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] p-3 sm:p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#18A999]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi 
                  ? "रोग का नाम, डॉक्टर, अस्पताल या विशेषज्ञता खोजें..." 
                  : "Search disease, symptoms, doctor name, hospital or city (e.g. Heart Attack, Diabetes, Migraine)..."}
                className="w-full pl-10 pr-8 py-2 text-xs bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#18A999]"
              >
                <option value="rating">{isHindi ? 'रेटिंग: उच्चतम पहले' : 'Sort: Highest Rated'}</option>
                <option value="experience">{isHindi ? 'अनुभव: वरिष्ठ पहले' : 'Sort: Most Experienced'}</option>
                <option value="price_asc">{isHindi ? 'शुल्क: कम से अधिक' : 'Price: Low to High'}</option>
                <option value="price_desc">{isHindi ? 'शुल्क: अधिक से कम' : 'Price: High to Low'}</option>
              </select>

              {/* Price Filter Dropdown */}
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#18A999]"
              >
                <option value={2000}>{isHindi ? 'सभी शुल्क (INR)' : 'All Fees (INR)'}</option>
                <option value={800}>{isHindi ? '₹800 तक' : 'Under ₹800'}</option>
                <option value={1000}>{isHindi ? '₹1,000 तक' : 'Under ₹1,000'}</option>
                <option value={1200}>{isHindi ? '₹1,200 तक' : 'Under ₹1,200'}</option>
                <option value={1500}>{isHindi ? '₹1,500 तक' : 'Under ₹1,500'}</option>
              </select>
            </div>
          </div>

          {/* Quick Disease Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <span className="text-[10px] font-bold text-[#18A999] uppercase tracking-wider shrink-0 font-mono">
              {isHindi ? 'त्वरित खोज:' : 'Quick Disease Search:'}
            </span>
            {popularDiseases.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(item.query)}
                className={`px-2.5 py-0.5 rounded-full border shrink-0 transition-all text-[11px] font-medium ${
                  searchQuery.toLowerCase() === item.query
                    ? 'bg-[#0F4C5C] text-white border-[#18A999]'
                    : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999]'
                }`}
              >
                {isHindi ? item.labelHi : item.label}
              </button>
            ))}
          </div>

          {/* Category Tabs Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100 dark:border-[#27272a]">
            {SPECIALTY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#27272a] hover:border-[#18A999]/50'
                  }`}
                >
                  <span>{isHindi ? cat.labelHi : cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-[#a1a1aa] font-mono">
            {isHindi ? `उपलब्ध डॉक्टर: ${filteredDoctors.length}` : `Showing ${filteredDoctors.length} Specialists`}
          </span>
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMaxPrice(2000); }}
              className="text-xs font-bold text-[#18A999] hover:underline"
            >
              {isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Reset Filters'}
            </button>
          )}
        </div>

        {/* Doctor Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#111111] border border-slate-200/90 dark:border-[#27272a] hover:border-[#18A999] dark:hover:border-[#18A999] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group relative"
            >
              {/* Doctor Avatar & Identity */}
              <div className="flex gap-3.5">
                <DoctorAvatar
                  src={doc.image}
                  name={doc.name}
                  specialty={doc.specialty}
                  size="md"
                  className="group-hover:scale-105 transition-transform"
                />

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#0F4C5C]/10 text-[#18A999] border border-[#18A999]/30 uppercase font-mono">
                      {doc.experienceYears}+ {isHindi ? 'वर्ष' : 'Yrs'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[9px] text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-newsreader leading-snug group-hover:text-[#18A999] transition-colors truncate">
                    {doc.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#0F4C5C] dark:text-[#18A999] truncate">
                    {doc.specialty}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {doc.qualification}
                  </p>
                </div>
              </div>

              {/* Hospital Location */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-[#1f1f23]">
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="w-3 h-3 text-[#18A999] shrink-0" />
                  <strong className="font-semibold text-slate-800 dark:text-white truncate">{doc.hospital}</strong>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {doc.location}
                </span>
              </div>

              {/* Short Bio */}
              <p className="text-[11px] text-slate-500 dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
                {isHindi ? (doc.descriptionHindi || doc.description) : doc.description}
              </p>

              {/* Key Disease Tags */}
              <div className="flex flex-wrap gap-1">
                {doc.treatedDiseases.slice(0, 3).map((dis, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(dis.split('(')[0].trim())}
                    className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#27272a] hover:border-[#18A999] transition-colors truncate max-w-[140px]"
                    title={dis}
                  >
                    {dis}
                  </button>
                ))}
                {doc.treatedDiseases.length > 3 && (
                  <span className="px-1 text-[9px] text-slate-400 self-center font-mono">
                    +{doc.treatedDiseases.length - 3}
                  </span>
                )}
              </div>

              {/* Bottom Price & Action Row */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#27272a] flex items-center justify-between gap-2">
                <div className="shrink-0">
                  <span className="text-[9px] text-slate-400 block font-mono uppercase leading-tight">
                    {isHindi ? 'परामर्श शुल्क' : 'OPD Fee'}
                  </span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                    ₹{doc.priceINR}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href="/patient/interview">
                    <button className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#27272a] text-slate-700 dark:text-slate-300 hover:border-[#18A999] hover:text-[#18A999] text-[11px] font-semibold transition-all">
                      {isHindi ? 'प्री-इंटेक' : 'Pre-Intake'}
                    </button>
                  </Link>
                  <button
                    onClick={() => handleBookDoctor(doc)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0F4C5C] to-[#18A999] text-white text-[11px] font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all flex items-center gap-1"
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
          <div className="text-center py-12 bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0F4C5C]/10 text-[#18A999] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-newsreader">
              {isHindi ? 'कोई डॉक्टर नहीं मिला' : 'No Doctors Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isHindi 
                ? 'कृपया अलग कीवर्ड या रोग का नाम खोजें अथवा सभी फ़िल्टर साफ़ करें।' 
                : 'Try adjusting your search keywords or clear category filters to view all specialists.'}
            </p>
            <Button size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMaxPrice(2000); }}>
              {isHindi ? 'सभी डॉक्टर्स देखें' : 'View All Doctors'}
            </Button>
          </div>
        )}
      </div>

      {/* Auth Required Prompt Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => { setShowAuthModal(false); setSelectedDoctorForBooking(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold font-newsreader text-slate-900 dark:text-white">
                {isHindi ? 'लॉगिन आवश्यक है' : 'Login Required to Book'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#a1a1aa] leading-relaxed">
                {isHindi 
                  ? 'डॉक्टर से परामर्श स्लॉट बुक करने और रोगी टोकन प्राप्त करने के लिए कृपया अपने खाते में साइन इन करें।' 
                  : 'You must be logged in to confirm an appointment and receive your verified patient consultation token.'}
              </p>
            </div>

            {selectedDoctorForBooking && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] flex items-center gap-3">
                <DoctorAvatar
                  src={selectedDoctorForBooking.image}
                  name={selectedDoctorForBooking.name}
                  specialty={selectedDoctorForBooking.specialty}
                  size="sm"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white font-newsreader truncate">{selectedDoctorForBooking.name}</h4>
                  <p className="text-[11px] text-[#18A999] truncate">{selectedDoctorForBooking.specialty}</p>
                  <p className="text-[10px] text-emerald-500 font-bold font-mono">Fee: ₹{selectedDoctorForBooking.priceINR}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                onClick={handleQuickLoginAsPatient}
                icon={UserCheck}
                fullWidth
              >
                {isHindi ? 'मरीज के रूप में तुरंत लॉगिन करें' : 'Quick Sign In as Patient'}
              </Button>
              <Link href="/login?role=patient&redirect=/patient/doctors" className="block">
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

      {/* Appointment Booking Modal */}
      {selectedDoctorForBooking && !showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoctorForBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-4 space-y-3 animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-newsreader">
                  {isHindi ? 'अपॉइंटमेंट सफलतापूर्वक बुक हुआ!' : 'Appointment Confirmed!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {isHindi 
                    ? `आपका टोकन #102 डॉ. ${selectedDoctorForBooking.name} के साथ ${selectedDate} को ${selectedSlot} बजे के लिए पंजीकृत हो गया है।`
                    : `Your Token #102 has been registered with ${selectedDoctorForBooking.name} for ${selectedDate} at ${selectedSlot}.`}
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                  {isHindi ? 'परामर्श शुल्क: ' : 'Confirmed Fee: '} ₹{selectedDoctorForBooking.priceINR} (Pay at Hospital Desk / UPI)
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#27272a] pb-3">
                  <DoctorAvatar
                    src={selectedDoctorForBooking.image}
                    name={selectedDoctorForBooking.name}
                    specialty={selectedDoctorForBooking.specialty}
                    size="sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white font-newsreader">
                      {selectedDoctorForBooking.name}
                    </h3>
                    <p className="text-xs text-[#18A999] font-semibold">
                      {selectedDoctorForBooking.specialty}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedDoctorForBooking.hospital} • {selectedDoctorForBooking.location}
                    </p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block font-mono">
                    {isHindi ? 'दिनांक चुनें:' : 'Select Consultation Date:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Today', 'Tomorrow', 'In 2 Days'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
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

                {/* Time Slot Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block font-mono">
                    {isHindi ? 'समय स्लॉट चुनें:' : 'Select Time Slot:'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['10:30 AM', '02:30 PM', '04:00 PM', '05:30 PM', '06:15 PM', '07:00 PM'].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
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

                {/* Price Summary */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block">
                      {isHindi ? 'कुल परामर्श शुल्क' : 'Total Consultation Fee'}
                    </span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{selectedDoctorForBooking.priceINR}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                    {isHindi ? 'टोकन #102 से लिंक' : 'Linked to Token #102'}
                  </span>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDoctorForBooking(null)}
                    fullWidth
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirmBooking}
                    fullWidth
                  >
                    {isHindi ? 'अपॉइंटमेंट पक्का करें' : 'Confirm Booking'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
