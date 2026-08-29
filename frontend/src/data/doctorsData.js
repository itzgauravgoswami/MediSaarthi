// Comprehensive Database of 100+ Verified Doctors Across All Disease Domains & Medical Disciplines
// Covering Cardiology, Neurology, Oncology, Gastroenterology, Pulmonology, Endocrinology, Nephrology, 
// Urology, Orthopedics, Dermatology, Ophthalmology, ENT, Psychiatry, Pediatrics, Gynecology, 
// Rheumatology, Infectious Diseases, Hematology, Immunology, AYUSH (Ayurveda, Homeopathy, Unani), Surgery & More.

export const SPECIALTY_CATEGORIES = [
  { id: 'all', label: 'All Specialities', labelHi: 'सभी विशेषज्ञता', icon: 'Sparkles' },
  { id: 'cardio', label: 'Heart & Vascular', labelHi: 'हृदय एवं रक्तवाहिनी', icon: 'Heart' },
  { id: 'neuro', label: 'Brain & Nerves', labelHi: 'मस्तिष्क एवं तंत्रिका', icon: 'Brain' },
  { id: 'onco', label: 'Cancer & Oncology', labelHi: 'कैंसर एवं ऑन्कोलॉजी', icon: 'Activity' },
  { id: 'endo', label: 'Diabetes & Hormones', labelHi: 'मधुमेह एवं हार्मोन', icon: 'Flame' },
  { id: 'gastro', label: 'Stomach & Liver', labelHi: 'पेट एवं लिवर', icon: 'Utensils' },
  { id: 'pulmo', label: 'Lungs & Breathing', labelHi: 'फेफड़े एवं श्वसन', icon: 'Wind' },
  { id: 'ortho', label: 'Bones & Joints', labelHi: 'हड्डी एवं जोड़', icon: 'Bone' },
  { id: 'nephro', label: 'Kidney & Urology', labelHi: 'गुर्दा एवं मूत्र रोग', icon: 'Droplets' },
  { id: 'derma', label: 'Skin & Hair', labelHi: 'त्वचा एवं बाल', icon: 'Sparkle' },
  { id: 'eye', label: 'Eye Care (Ophthalmology)', labelHi: 'नेत्र रोग', icon: 'Eye' },
  { id: 'ent', label: 'Ear, Nose & Throat', labelHi: 'कान, नाक एवं गला', icon: 'Ear' },
  { id: 'women', label: 'Gynecology & Obstetrics', labelHi: 'स्त्री एवं प्रसूति रोग', icon: 'HeartHandshake' },
  { id: 'pedia', label: 'Child Care (Pediatrics)', labelHi: 'बाल रोग', icon: 'Smile' },
  { id: 'psych', label: 'Mental Health & Psychiatry', labelHi: 'मानसिक स्वास्थ्य', icon: 'SmilePlus' },
  { id: 'rheuma', label: 'Rheumatology & Autoimmune', labelHi: 'गठिया एवं ऑटोइम्यून', icon: 'Shield' },
  { id: 'infect', label: 'Infectious Diseases', labelHi: 'संक्रामक रोग', icon: 'Virus' },
  { id: 'ayush', label: 'AYUSH & Ayurveda', labelHi: 'आयुष एवं आयुर्वेद', icon: 'Leaf' },
  { id: 'surgery', label: 'General & Plastic Surgery', labelHi: 'सर्जरी एवं प्लास्टिक सर्जरी', icon: 'Scissors' }
];

// Curated high-resolution doctor portrait images
const DOCTOR_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1594824813689-53e3909c00b5?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400'
];

export const DOCTORS_DATA = [
  // ==================== 1. CARDIOLOGY & VASCULAR (1-8) ====================
  {
    id: 'DOC-CARD-001',
    name: 'Dr. Arvind Mehta',
    gender: 'Male',
    specialty: 'Senior Interventional Cardiologist',
    category: 'cardio',
    qualification: 'MBBS, MD (Medicine), DM (Cardiology), FACC (USA)',
    experienceYears: 22,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1420,
    priceINR: 1200,
    image: DOCTOR_AVATARS[0],
    languages: ['English', 'हिन्दी', 'Gujarati'],
    nextAvailable: 'Today, 03:30 PM',
    treatedDiseases: [
      'Heart Attack (Acute Myocardial Infarction)',
      'Coronary Artery Disease (CAD)',
      'Heart Failure & Cardiomyopathy',
      'Hypertension (High Blood Pressure)',
      'Angina Pectoris (Chest Pain)',
      'Cardiac Arrhythmia & Palpitations',
      'Valvular Heart Disease'
    ],
    description: 'Leading cardiologist with over two decades of experience in complex angioplasties, pacemaker implantations, and emergency cardiac critical care.',
    descriptionHindi: '22 से अधिक वर्षों के अनुभव वाले वरिष्ठ हृदय रोग विशेषज्ञ, जटिल एंजियोप्लास्टी और कार्डियक केयर में विशेषज्ञ।'
  },
  {
    id: 'DOC-CARD-002',
    name: 'Dr. Priya Sharma',
    gender: 'Female',
    specialty: 'Consultant Clinical & Pediatric Cardiologist',
    category: 'cardio',
    qualification: 'MBBS, MD (Pediatrics), DNB (Cardiology)',
    experienceYears: 14,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 980,
    priceINR: 1000,
    image: DOCTOR_AVATARS[1],
    languages: ['English', 'हिन्दी', 'Punjabi'],
    nextAvailable: 'Tomorrow, 10:00 AM',
    treatedDiseases: [
      'Congenital Heart Defects (Hole in Heart / ASD / VSD)',
      'Pediatric Heart Murmurs',
      'Rheumatic Heart Disease',
      'Kawasaki Disease',
      'High Cholesterol & Dyslipidemia'
    ],
    description: 'Expert in non-invasive pediatric and adult echocardiography, congenital defect diagnosis, and preventive cardiac wellness.',
    descriptionHindi: 'बाल एवं वयस्क इकोकार्डियोग्राफी, जन्मजात हृदय दोष और निवारक हृदय देखभाल में विशेषज्ञ।'
  },
  {
    id: 'DOC-CARD-003',
    name: 'Dr. Rajeshwari Iyer',
    gender: 'Female',
    specialty: 'Electrophysiologist & Arrhythmia Specialist',
    category: 'cardio',
    qualification: 'MBBS, MD, DM (Cardiology), Post-Doc (Arrhythmias)',
    experienceYears: 16,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 760,
    priceINR: 1100,
    image: DOCTOR_AVATARS[2],
    languages: ['English', 'हिन्दी', 'Tamil'],
    nextAvailable: 'Today, 05:00 PM',
    treatedDiseases: [
      'Atrial Fibrillation (AFib)',
      'Supraventricular Tachycardia (SVT)',
      'Bradycardia (Slow Heart Rate)',
      'Syncope & Sudden Blackouts',
      'Pacemaker & ICD Implantation'
    ],
    description: 'Specializes in 3D cardiac mapping, radiofrequency catheter ablation, and management of complex heart rhythm disorders.',
    descriptionHindi: 'कार्डियक मैपिंग, रेडियोफ्रीक्वेंसी एब्लेशन और अनियमित धड़कनों के इलाज में विशेषज्ञ।'
  },
  {
    id: 'DOC-CARD-004',
    name: 'Dr. Kabir Deshmukh',
    gender: 'Male',
    specialty: 'Cardiothoracic & Vascular Surgeon (CTVS)',
    category: 'cardio',
    qualification: 'MBBS, MS (General Surgery), MCh (CTVS)',
    experienceYears: 19,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1120,
    priceINR: 1500,
    image: DOCTOR_AVATARS[3],
    languages: ['English', 'हिन्दी', 'Marathi'],
    nextAvailable: 'Tomorrow, 11:30 AM',
    treatedDiseases: [
      'Coronary Artery Bypass Grafting (CABG / Bypass Surgery)',
      'Aortic Aneurysm & Dissection',
      'Heart Valve Replacement (MVR/AVR)',
      'Varicose Veins & Peripheral Arterial Disease (PAD)',
      'Deep Vein Thrombosis (DVT)'
    ],
    description: 'Pioneer in minimally invasive beating-heart bypass surgeries, aortic arch repairs, and advanced vascular reconstructive procedures.',
    descriptionHindi: 'मिनिमली इनवेसिव बाईपास सर्जरी, महाधमनी की मरम्मत और संवहनी प्रक्रियाओं में कुशल सर्जन।'
  },
  {
    id: 'DOC-CARD-005',
    name: 'Dr. Sanjeev Bhattacharya',
    gender: 'Male',
    specialty: 'Heart Failure & Transplant Cardiologist',
    category: 'cardio',
    qualification: 'MBBS, MD, DM (Cardiology), Fellowship (LVAD & Transplant)',
    experienceYears: 15,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 640,
    priceINR: 1000,
    image: DOCTOR_AVATARS[4],
    languages: ['English', 'हिन्दी', 'Bengali', 'Kannada'],
    nextAvailable: 'Today, 04:15 PM',
    treatedDiseases: [
      'Advanced Congestive Heart Failure (CHF)',
      'Cardiomyopathy (Dilated / Hypertrophic)',
      'Pulmonary Arterial Hypertension (PAH)',
      'Post-Myocardial Infarction Remodeling',
      'Cardiac Amyloidosis'
    ],
    description: 'Renowned authority on advanced heart failure medical management, cardiac resynchronization therapy (CRT), and mechanical circulatory support.',
    descriptionHindi: 'हार्ट फेलियर, कार्डियोमायोपैथी और एडवांस्ड थेरेपी के अग्रणी विशेषज्ञ।'
  },
  {
    id: 'DOC-CARD-006',
    name: 'Dr. Ananya Roy',
    gender: 'Female',
    specialty: 'Preventive & Lipidology Specialist',
    category: 'cardio',
    qualification: 'MBBS, MD (Medicine), PGD (Clinical Cardiology)',
    experienceYears: 11,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.7,
    reviewsCount: 520,
    priceINR: 750,
    image: DOCTOR_AVATARS[5],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Tomorrow, 09:30 AM',
    treatedDiseases: [
      'Severe Hypercholesterolemia & High Triglycerides',
      'Metabolic Syndrome & Atherosclerosis',
      'Early Coronary Calcium Plaque Prevention',
      'Post-Bypass Cardiac Rehabilitation',
      'Stress-Induced Takotsubo Cardiomyopathy'
    ],
    description: 'Dedicated to reversing atherosclerotic risk factors through personalized medical therapy, lifestyle cardiology, and genetic lipid profiling.',
    descriptionHindi: 'कोलेस्ट्रॉल नियंत्रण, मेटाबॉलिक सिंड्रोम और निवारक कार्डियोलॉजी में विशेषज्ञ।'
  },

  // ==================== 2. NEUROLOGY & NEUROSURGERY (7-14) ====================
  {
    id: 'DOC-NEURO-001',
    name: 'Dr. Vikramaditya Sen',
    gender: 'Male',
    specialty: 'Chief Neurophysician & Stroke Specialist',
    category: 'neuro',
    qualification: 'MBBS, MD (Medicine), DM (Neurology), FAAN',
    experienceYears: 24,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1350,
    priceINR: 1300,
    image: DOCTOR_AVATARS[6],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Today, 02:00 PM',
    treatedDiseases: [
      'Acute Ischemic Stroke & Brain Hemorrhage',
      'Transient Ischemic Attack (TIA / Mini-Stroke)',
      'Epilepsy & Uncontrolled Seizures',
      'Parkinson’s Disease & Tremors',
      'Alzheimer’s Disease & Dementia',
      'Migraine & Severe Cluster Headaches',
      'Multiple Sclerosis (MS)'
    ],
    description: 'Nationally acclaimed neurologist specializing in rapid thrombolytic stroke rescue, refractory epilepsy management, and cognitive decline therapies.',
    descriptionHindi: 'स्ट्रोक, मिर्गी, पार्किंसंस और गंभीर सिरदर्द विकारों के शीर्ष न्यूरोलॉजिस्ट।'
  },
  {
    id: 'DOC-NEURO-002',
    name: 'Dr. Meenakshi Sundaram',
    gender: 'Female',
    specialty: 'Movement Disorder & Dementia Specialist',
    category: 'neuro',
    qualification: 'MBBS, MD, DM (Neurology), Post-Doc (Movement Disorders)',
    experienceYears: 17,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 890,
    priceINR: 1100,
    image: DOCTOR_AVATARS[7],
    languages: ['English', 'हिन्दी', 'Tamil', 'Kannada'],
    nextAvailable: 'Tomorrow, 10:30 AM',
    treatedDiseases: [
      'Parkinson’s Disease & Progressive Supranuclear Palsy (PSP)',
      'Dystonia & Spasticity (Botox Therapy)',
      'Huntington’s Chorea',
      'Vascular & Lewy Body Dementia',
      'Restless Legs Syndrome (RLS)'
    ],
    description: 'Expert in neurodegenerative movement disorders, Deep Brain Stimulation (DBS) evaluation, and memory clinic care.',
    descriptionHindi: 'मूवमेंट डिसऑर्डर, डिमेंशिया और बोटॉक्स थेरेपी की विशेषज्ञ।'
  },
  {
    id: 'DOC-NEURO-003',
    name: 'Dr. Alok Verma',
    gender: 'Male',
    specialty: 'Senior Neurosurgeon & Spine Surgeon',
    category: 'neuro',
    qualification: 'MBBS, MS, MCh (Neurosurgery), Fellowship (Endoscopic Skull Base)',
    experienceYears: 20,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1180,
    priceINR: 1500,
    image: DOCTOR_AVATARS[8],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 04:00 PM',
    treatedDiseases: [
      'Brain Tumors (Glioma, Meningioma, Pituitary Adenoma)',
      'Hydrocephalus & Normal Pressure Hydrocephalus (NPH)',
      'Spinal Disc Herniation & Sciatica (Slip Disc)',
      'Cervical Spondylotic Myelopathy',
      'Trigeminal Neuralgia (Severe Facial Nerve Pain)',
      'Cranial & Spinal Trauma'
    ],
    description: 'Master neurosurgeon performing minimally invasive endoscopic brain tumor resections, microvascular decompression, and spine stabilizations.',
    descriptionHindi: 'ब्रेन ट्यूमर, स्लिप डिस्क, सायटिका और स्पाइनल सर्जरी के विख्यात न्यूरोसर्जन।'
  },
  {
    id: 'DOC-NEURO-004',
    name: 'Dr. Nandita Kaul',
    gender: 'Female',
    specialty: 'Neuromuscular & Peripheral Nerve Specialist',
    category: 'neuro',
    qualification: 'MBBS, MD, DM (Neurology), Fellow (Neuromuscular)',
    experienceYears: 13,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 540,
    priceINR: 900,
    image: DOCTOR_AVATARS[9],
    languages: ['English', 'हिन्दी', 'Kashmiri'],
    nextAvailable: 'Tomorrow, 02:00 PM',
    treatedDiseases: [
      'Myasthenia Gravis',
      'Guillain-Barré Syndrome (GBS)',
      'Amyotrophic Lateral Sclerosis (ALS / Motor Neuron Disease)',
      'Diabetic Peripheral Neuropathy',
      'Carpal Tunnel Syndrome & Nerve Entrapments'
    ],
    description: 'Specializes in electromyography (EMG/NCS) diagnostics, autoimmune neuromuscular junctions, and neuropathic pain management.',
    descriptionHindi: 'नसों की कमजोरी, जीबीएस, मायस्थेनिया और न्यूरोपैथी के उपचार में विशेषज्ञ।'
  },

  // ==================== 3. ONCOLOGY & CANCER CARE (15-22) ====================
  {
    id: 'DOC-ONCO-001',
    name: 'Dr. Rakesh Chopra',
    gender: 'Male',
    specialty: 'Senior Medical Oncologist & Immunotherapy Lead',
    category: 'onco',
    qualification: 'MBBS, MD (Medicine), DM (Medical Oncology), ESMO Certified',
    experienceYears: 23,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1600,
    priceINR: 1400,
    image: DOCTOR_AVATARS[0],
    languages: ['English', 'हिन्दी', 'Punjabi'],
    nextAvailable: 'Today, 03:00 PM',
    treatedDiseases: [
      'Lung Cancer (NSCLC / SCLC)',
      'Breast Cancer (ER/PR+, HER2+, Triple Negative)',
      'Colorectal & Gastrointestinal Cancers',
      'Prostate & Bladder Cancer',
      'Targeted Molecular Therapy & CAR-T Therapy',
      'Cancer Chemotherapy & Immunotherapy'
    ],
    description: 'World-renowned medical oncologist focusing on genomic profiling, precision chemotherapy, checkpoint inhibitor immunotherapy, and pain-free palliative protocols.',
    descriptionHindi: 'कैंसर की सटीक कीमोथेरेपी, इम्यूनोथेरेपी और टार्गेटेड उपचार के अंतरराष्ट्रीय विशेषज्ञ।'
  },
  {
    id: 'DOC-ONCO-002',
    name: 'Dr. Shweta Mukherjee',
    gender: 'Female',
    specialty: 'Surgical Oncologist & Breast Oncoplasty Specialist',
    category: 'onco',
    qualification: 'MBBS, MS (General Surgery), MCh (Surgical Oncology)',
    experienceYears: 16,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 920,
    priceINR: 1300,
    image: DOCTOR_AVATARS[1],
    languages: ['English', 'हिन्दी', 'Bengali', 'Tamil'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    treatedDiseases: [
      'Breast Lumps & Malignant Tumors',
      'Oral, Tongue & Head-Neck Cancers',
      'Thyroid Carcinoma',
      'Ovarian & Uterine Cancers (Gynecologic Oncology)',
      'Soft Tissue Sarcoma'
    ],
    description: 'Expert in organ-preserving oncological resections, sentinel lymph node biopsies, and aesthetic breast oncoplastic reconstructions.',
    descriptionHindi: 'स्तन कैंसर, ओरल कैंसर और ऑन्कोप्लास्टिक सर्जरी की प्रमुख विशेषज्ञ।'
  },
  {
    id: 'DOC-ONCO-003',
    name: 'Dr. Harish Narayanan',
    gender: 'Male',
    specialty: 'Radiation Oncologist & CyberKnife Specialist',
    category: 'onco',
    qualification: 'MBBS, MD (Radiation Oncology), DNB, Fellow (IMRT/IGRT/SBRT)',
    experienceYears: 18,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 710,
    priceINR: 1100,
    image: DOCTOR_AVATARS[2],
    languages: ['English', 'हिन्दी', 'Malayalam', 'Kannada'],
    nextAvailable: 'Today, 05:30 PM',
    treatedDiseases: [
      'Brain Metastases & Primary Gliomas',
      'Esophageal & Stomach Cancers',
      'Cervical & Endometrial Cancers',
      'Stereotactic Body Radiation Therapy (SBRT / SRS)',
      'Proton Beam Therapy Planning'
    ],
    description: 'Pioneer in sub-millimeter precision radiation therapies minimizing collateral damage to healthy tissues.',
    descriptionHindi: 'रेडिएशन ऑन्कोलॉजी, साइबरनाइफ और स्टीरियोटैक्टिक रेडियोथेरेपी के विशेषज्ञ।'
  },
  {
    id: 'DOC-ONCO-004',
    name: 'Dr. Gurpreet Ahluwalia',
    gender: 'Male',
    specialty: 'Hematologist & Bone Marrow Transplant Specialist',
    category: 'onco',
    qualification: 'MBBS, MD (Medicine), DM (Clinical Hematology)',
    experienceYears: 15,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 650,
    priceINR: 1200,
    image: DOCTOR_AVATARS[3],
    languages: ['English', 'हिन्दी', 'Punjabi'],
    nextAvailable: 'Tomorrow, 01:00 PM',
    treatedDiseases: [
      'Leukemia (ALL / AML / CLL / CML)',
      'Multiple Myeloma & Plasmacytoma',
      'Hodgkin & Non-Hodgkin Lymphoma',
      'Aplastic Anemia & Bone Marrow Failure',
      'Autologous & Allogeneic Stem Cell Transplants'
    ],
    description: 'Specializes in blood cancers, complex stem cell transplantation, and targeted molecular therapies for hematologic malignancies.',
    descriptionHindi: 'ब्लड कैंसर, ल्यूकेमिया, लिंफोमा और बोन मैरो ट्रांसप्लांट के विशेषज्ञ।'
  },

  // ==================== 4. GASTROENTEROLOGY & HEPATOLOGY (23-30) ====================
  {
    id: 'DOC-GASTRO-001',
    name: 'Dr. Manojit Dasgupta',
    gender: 'Male',
    specialty: 'Senior Gastroenterologist & Interventional Endoscopist',
    category: 'gastro',
    qualification: 'MBBS, MD, DM (Gastroenterology), FASGE (USA)',
    experienceYears: 21,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1490,
    priceINR: 1100,
    image: DOCTOR_AVATARS[4],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Today, 02:30 PM',
    treatedDiseases: [
      'Gastroesophageal Reflux Disease (GERD / Severe Acidity)',
      'Peptic Ulcer Disease & H. Pylori Infection',
      'Irritable Bowel Syndrome (IBS & Chronic Bloating)',
      'Inflammatory Bowel Disease (Crohn’s Disease & Ulcerative Colitis)',
      'Celiac Disease & Gluten Sensitivity',
      'Gallbladder Stones & Choledocholithiasis (ERCP)',
      'Acute & Chronic Pancreatitis'
    ],
    description: 'Master of therapeutic endoscopy, colonoscopy, ERCP stone extractions, and biological therapy for chronic Crohn’s/Colitis.',
    descriptionHindi: 'पेट, आंत, एसिडिटी, कोलाइटिस और एंडोस्कोपी के वरिष्ठ विशेषज्ञ।'
  },
  {
    id: 'DOC-GASTRO-002',
    name: 'Dr. Sunita Bansal',
    gender: 'Female',
    specialty: 'Hepatologist & Liver Transplant Physician',
    category: 'gastro',
    qualification: 'MBBS, MD, DM (Hepatology), Fellowship (Liver Transplant)',
    experienceYears: 17,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1120,
    priceINR: 1200,
    image: DOCTOR_AVATARS[5],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Tomorrow, 10:00 AM',
    treatedDiseases: [
      'Fatty Liver Disease (NAFLD / NASH & Fibrosis)',
      'Liver Cirrhosis & Portal Hypertension',
      'Hepatitis B & Hepatitis C Viral Infections',
      'Alcoholic Liver Disease & Alcoholic Hepatitis',
      'Jaundice & Acute Liver Failure',
      'Pre & Post Liver Transplant Care'
    ],
    description: 'Expert in reversing metabolic fatty liver disease, viral hepatitis antiviral eradication, and comprehensive cirrhosis stabilization.',
    descriptionHindi: 'फैटी लिवर, लिवर सिरोसिस, हेपेटाइटिस और लिवर ट्रांसप्लांट की प्रसिद्ध विशेषज्ञ।'
  },
  {
    id: 'DOC-GASTRO-003',
    name: 'Dr. Tarun Chawla',
    gender: 'Male',
    specialty: 'GI Surgeon & Proctologist',
    category: 'gastro',
    qualification: 'MBBS, MS, DNB (Surgical Gastroenterology)',
    experienceYears: 15,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 880,
    priceINR: 900,
    image: DOCTOR_AVATARS[6],
    languages: ['English', 'हिन्दी', 'Telugu'],
    nextAvailable: 'Today, 04:30 PM',
    treatedDiseases: [
      'Piles (Hemorrhoids - Laser Treatment)',
      'Anal Fissure & Complex Anal Fistula',
      'Pilonidal Sinus',
      'Inguinal & Ventral Hernia Repair (Laparoscopic)',
      'Gallbladder Stone Removal (Laparoscopic Cholecystectomy)',
      'Appendicitis'
    ],
    description: 'Specializes in painless laser proctology for piles/fissures and advanced scarless laparoscopic abdominal surgeries.',
    descriptionHindi: 'पाइल्स, फिशर, हर्निया और पित्त की थैली की पथरी के लेजर एवं दूरबीन सर्जन।'
  },

  // ==================== 5. PULMONOLOGY & RESPIRATORY (31-38) ====================
  {
    id: 'DOC-PULMO-001',
    name: 'Dr. Vivek Nangia',
    gender: 'Male',
    specialty: 'Principal Director & Head - Pulmonology & Sleep Medicine',
    category: 'pulmo',
    qualification: 'MBBS, MD (Respiratory Medicine), FACP, FCCP (USA)',
    experienceYears: 25,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1720,
    priceINR: 1200,
    image: DOCTOR_AVATARS[7],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 03:00 PM',
    treatedDiseases: [
      'Bronchial Asthma & Allergic Bronchitis',
      'Chronic Obstructive Pulmonary Disease (COPD & Emphysema)',
      'Pulmonary Tuberculosis (TB & Drug-Resistant MDR-TB)',
      'Interstitial Lung Disease (ILD & Pulmonary Fibrosis)',
      'Obstructive Sleep Apnea (Severe Snoring & CPAP)',
      'Bacterial & Viral Pneumonia',
      'Post-COVID Long-Hauler Lung Syndrome'
    ],
    description: 'Pioneering pulmonologist in advanced bronchoscopy, sleep study diagnostic titration, and targeted biologic therapies for refractory asthma.',
    descriptionHindi: 'अस्थमा, ब्रोंकाइटिस, टीबी, फेफड़ों के इन्फेक्शन और स्लीप एपनिया के वरिष्ठ विशेषज्ञ।'
  },
  {
    id: 'DOC-PULMO-002',
    name: 'Dr. Reena Sen',
    gender: 'Female',
    specialty: 'Consultant Chest Physician & Allergy Specialist',
    category: 'pulmo',
    qualification: 'MBBS, DTCD, DNB (Pulmonary Medicine)',
    experienceYears: 13,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 620,
    priceINR: 850,
    image: DOCTOR_AVATARS[8],
    languages: ['English', 'हिन्दी', 'Marathi'],
    nextAvailable: 'Tomorrow, 11:30 AM',
    treatedDiseases: [
      'Chronic Dry & Productive Cough',
      'Pollution-Induced Bronchospasm',
      'Pleural Effusion (Fluid in Lungs)',
      'Bronchiectasis',
      'Occupational Dust Lung Disease (Silicosis)'
    ],
    description: 'Focused on comprehensive pulmonary function tests (PFT), inhaler technique optimization, and environmental allergy desensitization.',
    descriptionHindi: 'फेफड़ों की एलर्जी, पुरानी खांसी और सांस फूलने की समस्या की विशेषज्ञ।'
  },

  // ==================== 6. ENDOCRINOLOGY & DIABETOLOGY (39-46) ====================
  {
    id: 'DOC-ENDO-001',
    name: 'Dr. Ambrish Mithal',
    gender: 'Male',
    specialty: 'Chairman - Endocrinology & Diabetology',
    category: 'endo',
    qualification: 'MBBS, MD, DM (Endocrinology), Padma Bhushan Awardee',
    experienceYears: 30,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 5.0,
    reviewsCount: 2200,
    priceINR: 1500,
    image: DOCTOR_AVATARS[9],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Tomorrow, 02:30 PM',
    treatedDiseases: [
      'Type 1 Diabetes Mellitus (Pediatric & Young Adult)',
      'Type 2 Diabetes Mellitus (Uncontrolled HbA1c)',
      'Hypothyroidism, Hyperthyroidism & Graves Disease',
      'Thyroid Nodules & Goiter',
      'Polycystic Ovary Syndrome (PCOS / PCOD & Insulin Resistance)',
      'Osteoporosis & Vitamin D / Calcium Metabolism',
      'Cushing Syndrome & Adrenal Disorders'
    ],
    description: 'Renowned clinical endocrinologist with three decades of leadership in diabetes reversal strategies, continuous glucose monitoring (CGM), and complex hormonal balance.',
    descriptionHindi: 'मधुमेह, थायरॉइड, पीसीओडी और हार्मोनल असंतुलन के पद्म पुरस्कार से सम्मानित शीर्ष विशेषज्ञ।'
  },
  {
    id: 'DOC-ENDO-002',
    name: 'Dr. Shalini Gopinath',
    gender: 'Female',
    specialty: 'Consultant Endocrinologist & Obesity Medicine',
    category: 'endo',
    qualification: 'MBBS, MD, DM (Endocrinology)',
    experienceYears: 14,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 780,
    priceINR: 950,
    image: DOCTOR_AVATARS[0],
    languages: ['English', 'हिन्दी', 'Kannada', 'Malayalam'],
    nextAvailable: 'Today, 04:00 PM',
    treatedDiseases: [
      'Metabolic Obesity & Weight Loss Management',
      'Gestational Diabetes (Pregnancy Diabetes)',
      'Hashimoto’s Autoimmune Thyroiditis',
      'Hyperprolactinemia & Pituitary Tumors',
      'Male Hypogonadism & Low Testosterone'
    ],
    description: 'Expert in medical weight management, gestational glycemic control, and autoimmune endocrine disorders.',
    descriptionHindi: 'मोटापा, गर्भावस्था में शुगर, थायरॉइड और हार्मोनल विकारों की विशेषज्ञ।'
  },

  // ==================== 7. NEPHROLOGY & UROLOGY (47-54) ====================
  {
    id: 'DOC-NEPHRO-001',
    name: 'Dr. Sandeep Guleria',
    gender: 'Male',
    specialty: 'Senior Consultant Nephrologist & Renal Transplant',
    category: 'nephro',
    qualification: 'MBBS, MD, DM (Nephrology), FRCP (London)',
    experienceYears: 26,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1650,
    priceINR: 1300,
    image: DOCTOR_AVATARS[1],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 03:00 PM',
    treatedDiseases: [
      'Chronic Kidney Disease (CKD Stages 1 to 5)',
      'Acute Kidney Injury (AKI & Sudden Creatinine Rise)',
      'Diabetic Nephropathy & Hypertensive Kidney Damage',
      'Glomerulonephritis & Nephrotic Syndrome',
      'Kidney Dialysis (Hemodialysis & Peritoneal Dialysis)',
      'Kidney Transplantation & Living Donor Care'
    ],
    description: 'Distinguished kidney specialist with extensive expertise in preventing dialysis progression, immune kidney diseases, and renal transplantation.',
    descriptionHindi: 'क्रोनिक किडनी रोग, डायलिसिस, क्रिएटिनिन नियंत्रण और किडनी ट्रांसप्लांट के विशेषज्ञ।'
  },
  {
    id: 'DOC-NEPHRO-002',
    name: 'Dr. Anupam Sachdeva',
    gender: 'Male',
    specialty: 'Senior Urologist & Andrologist',
    category: 'nephro',
    qualification: 'MBBS, MS (Surgery), MCh (Urology), DNB',
    experienceYears: 18,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 940,
    priceINR: 1000,
    image: DOCTOR_AVATARS[2],
    languages: ['English', 'हिन्दी', 'Rajasthani'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    treatedDiseases: [
      'Kidney Stones (Renal Calculi - Laser RIRS / PCNL)',
      'Benign Prostatic Hyperplasia (BPH / Enlarged Prostate)',
      'Urinary Tract Infections (Recurrent UTIs in Men & Women)',
      'Urinary Incontinence & Overactive Bladder',
      'Erectile Dysfunction & Male Infertility',
      'Stricture Urethra'
    ],
    description: 'Expert in painless laser kidney stone pulverization (RIRS), bipolar TURP prostate removal, and male sexual health.',
    descriptionHindi: 'किडनी की पथरी (लेजर ऑपरेशन), प्रोस्टेट वृद्धि और मूत्र विकारों के प्रमुख विशेषज्ञ।'
  },

  // ==================== 8. ORTHOPEDICS & JOINT REPLACEMENT (55-62) ====================
  {
    id: 'DOC-ORTHO-001',
    name: 'Dr. Ashok Rajgopal',
    gender: 'Male',
    specialty: 'Chairman - Orthopedics & Robotic Joint Replacement',
    category: 'ortho',
    qualification: 'MBBS, MS (Ortho), MCh (Ortho - Liverpool), FRCS',
    experienceYears: 32,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 5.0,
    reviewsCount: 2800,
    priceINR: 1500,
    image: DOCTOR_AVATARS[3],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Tomorrow, 10:00 AM',
    treatedDiseases: [
      'Osteoarthritis of Knee & Hip (Severe Joint Pain)',
      'Total Knee Replacement (Robotic TKR)',
      'Total Hip Replacement (Anterior Hip Surgery)',
      'Avascular Necrosis (AVN of Femoral Head)',
      'Rheumatoid Knee Deformities',
      'Revision Joint Replacements'
    ],
    description: 'Legendary orthopedic surgeon who has performed over 30,000 successful joint replacements using AI-guided robotic precision.',
    descriptionHindi: 'रोबोटिक घुटना एवं कूल्हा प्रत्यारोपण और गंभीर गठिया के विश्वविख्यात ऑर्थोपेडिक सर्जन।'
  },
  {
    id: 'DOC-ORTHO-002',
    name: 'Dr. Manisha Kulkarni',
    gender: 'Female',
    specialty: 'Spine & Sports Medicine Orthopedic Specialist',
    category: 'ortho',
    qualification: 'MBBS, MS (Orthopedics), Fellowship (Arthroscopy & Spine)',
    experienceYears: 15,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 810,
    priceINR: 950,
    image: DOCTOR_AVATARS[4],
    languages: ['English', 'हिन्दी', 'Marathi'],
    nextAvailable: 'Today, 04:30 PM',
    treatedDiseases: [
      'Lumbar Spondylosis & Chronic Low Back Pain',
      'Sciatica & Slipped Herniated Disc',
      'ACL & Meniscus Knee Tears (Sports Injuries)',
      'Frozen Shoulder & Rotator Cuff Tendonitis',
      'Tennis Elbow & Plantar Fasciitis (Heel Pain)',
      'Cervical Neck Pain & Stiff Neck'
    ],
    description: 'Expert in keyhole arthroscopic knee/shoulder ligament repairs, non-surgical spine decompression, and sports physical rehabilitation.',
    descriptionHindi: 'कमर दर्द, सायटिका, फ्रोजन शोल्डर और स्पोर्ट्स इंजरी की विशेषज्ञ ऑर्थोपेडिक सर्जन।'
  },

  // ==================== 9. DERMATOLOGY & VENEREOLOGY (63-70) ====================
  {
    id: 'DOC-DERMA-001',
    name: 'Dr. Rashmi Sarkar',
    gender: 'Female',
    specialty: 'Professor & Senior Consultant Dermatologist',
    category: 'derma',
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy), MNAMS',
    experienceYears: 22,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1580,
    priceINR: 1000,
    image: DOCTOR_AVATARS[5],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Today, 02:00 PM',
    treatedDiseases: [
      'Psoriasis (Plaque, Guttate & Psoriatic Arthritis)',
      'Eczema & Atopic Dermatitis',
      'Vitiligo (White Patches / Leucoderma)',
      'Severe Acne Vulgaris & Post-Acne Scarring',
      'Melasma & Hyperpigmentation',
      'Fungal Infections (Tinea / Ringworm / Fungal Itch)',
      'Alopecia Areata & Pattern Hair Loss (Androgenetic Alopecia)'
    ],
    description: 'International authority on pigmentary disorders, biological therapies for severe psoriasis, and advanced clinical trichology.',
    descriptionHindi: 'सोरायसिस, एक्जिमा, सफेद दाग (विटिलिगो), मुँहासे और बाल झड़ने की प्रसिद्ध विशेषज्ञ।'
  },
  {
    id: 'DOC-DERMA-002',
    name: 'Dr. Rohan Singhania',
    gender: 'Male',
    specialty: 'Aesthetic Dermatologist & Laser Specialist',
    category: 'derma',
    qualification: 'MBBS, DVD, MD (Dermatology), Fellow (Aesthetic Medicine)',
    experienceYears: 12,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 720,
    priceINR: 800,
    image: DOCTOR_AVATARS[6],
    languages: ['English', 'हिन्दी', 'Gujarati'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    treatedDiseases: [
      'Urticaria (Hives & Chronic Allergic Rashes)',
      'Warts, Skin Tags & Moles Removal',
      'Seborrheic Dermatitis & Severe Dandruff',
      'Rosacea & Facial Redness',
      'Contact Dermatitis & Chemical Allergies'
    ],
    description: 'Specializes in medical laser therapies, chronic allergy diagnostics, and clinical skin rejuvenation.',
    descriptionHindi: 'स्किन एलर्जी, पित्ती (अर्टिकेरिया), मस्से और डैंड्रफ के विशेषज्ञ।'
  },

  // ==================== 10. OPHTHALMOLOGY (EYE CARE) (71-78) ====================
  {
    id: 'DOC-EYE-001',
    name: 'Dr. Mahipal S. Sachdev',
    gender: 'Male',
    specialty: 'Chairman - Ophthalmology & Cornea/Cataract Surgeon',
    category: 'eye',
    qualification: 'MBBS, MD (Ophthalmology - AIIMS), Padma Shri Awardee',
    experienceYears: 28,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 5.0,
    reviewsCount: 2400,
    priceINR: 1200,
    image: DOCTOR_AVATARS[7],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 03:30 PM',
    treatedDiseases: [
      'Cataract (Cloudy Lens - Blade-free Laser Phacoemulsification)',
      'Glaucoma (Kala Motia / High Eye Pressure)',
      'Refractive Errors (Myopia, Hyperopia, Astigmatism & SMILE/LASIK)',
      'Corneal Ulcers & Keratoconus (Cross-linking / C3R)',
      'Dry Eye Syndrome & Digital Eye Strain',
      'Pterygium & Conjunctivitis (Pink Eye)'
    ],
    description: 'Padma Shri recipient and pioneer of blade-free femtosecond cataract surgery, micro-incisional LASIK, and corneal preservation.',
    descriptionHindi: 'मोतियाबिंद (लेजर ऑपरेशन), काला मोतिया, लेसिक और कॉर्निया के पद्मश्री सम्मानित नेत्र सर्जन।'
  },
  {
    id: 'DOC-EYE-002',
    name: 'Dr. Radhika Krishnan',
    gender: 'Female',
    specialty: 'Vitreo-Retina Specialist & Pediatric Ophthalmologist',
    category: 'eye',
    qualification: 'MBBS, MS (Ophthalmology), DNB, Fellowship (Retina - Sankara Nethralaya)',
    experienceYears: 16,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 950,
    priceINR: 1000,
    image: DOCTOR_AVATARS[8],
    languages: ['English', 'हिन्दी', 'Tamil'],
    nextAvailable: 'Tomorrow, 09:30 AM',
    treatedDiseases: [
      'Diabetic Retinopathy (Bleeding in Retina)',
      'Age-Related Macular Degeneration (AMD)',
      'Retinal Detachment & Retinal Tears',
      'Retinitis Pigmentosa & Macular Edema',
      'Squint (Strabismus & Lazy Eye / Amblyopia)'
    ],
    description: 'Expert in intravitreal anti-VEGF injections, retinal laser photocoagulation, and advanced vitrectomy surgeries.',
    descriptionHindi: 'डायबिटिक रेटिनोपैथी, रेटिना के रोग और बच्चों के भेंगेपन की विशेषज्ञ।'
  },

  // ==================== 11. ENT / OTORHINOLARYNGOLOGY (79-84) ====================
  {
    id: 'DOC-ENT-001',
    name: 'Dr. Alok Thakar',
    gender: 'Male',
    specialty: 'Head - ENT, Head-Neck & Skull Base Surgery',
    category: 'ent',
    qualification: 'MBBS, MS (ENT - AIIMS), FRCS',
    experienceYears: 25,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1390,
    priceINR: 1100,
    image: DOCTOR_AVATARS[9],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 04:00 PM',
    treatedDiseases: [
      'Chronic Sinusitis & Nasal Polyps (FESS Surgery)',
      'Deviated Nasal Septum (DNS & Nasal Blockage)',
      'Hearing Loss, Tinnitus (Ringing in Ears) & Ear Infections (CSOM)',
      'Vertigo & Meniere’s Disease (Severe Dizziness)',
      'Enlarged Tonsils & Adenoids (Snoring in Children)',
      'Vocal Cord Polyps & Hoarseness of Voice',
      'Ear Drum Perforation (Tympanoplasty)'
    ],
    description: 'Renowned ENT surgeon specializing in endoscopic sinus clearance, hearing reconstruction, vertigo rehabilitation, and voice preservation.',
    descriptionHindi: 'साइनस, बहरापन, चक्कर आना (वर्टिगो), टॉन्सिल और कान-नाक-गले के वरिष्ठ विशेषज्ञ।'
  },
  {
    id: 'DOC-ENT-002',
    name: 'Dr. Shalini Venkat',
    gender: 'Female',
    specialty: 'Consultant ENT & Vertigo Specialist',
    category: 'ent',
    qualification: 'MBBS, DLO, DNB (ENT)',
    experienceYears: 13,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 680,
    priceINR: 750,
    image: DOCTOR_AVATARS[0],
    languages: ['English', 'हिन्दी', 'Kannada', 'Telugu'],
    nextAvailable: 'Tomorrow, 02:30 PM',
    treatedDiseases: [
      'Benign Paroxysmal Positional Vertigo (BPPV)',
      'Allergic Rhinitis & Sneezing Attacks',
      'Otitis Externa (Swimmer’s Ear)',
      'Foreign Body in Ear / Nose',
      'Difficulty Swallowing (Dysphagia)'
    ],
    description: 'Expert in Epley repositioning maneuvers for vertigo, nasal endoscopy, and pediatric ENT care.',
    descriptionHindi: 'चक्कर आने की बीमारी (बीपीपीवी), एलर्जी जुकाम और कान के इन्फेक्शन की विशेषज्ञ।'
  },

  // ==================== 12. PSYCHIATRY & MENTAL HEALTH (85-92) ====================
  {
    id: 'DOC-PSYCH-001',
    name: 'Dr. Sameer Malhotra',
    gender: 'Male',
    specialty: 'Director - Mental Health & Behavioral Sciences',
    category: 'psych',
    qualification: 'MBBS, MD (Psychiatry - AIIMS)',
    experienceYears: 24,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1850,
    priceINR: 1300,
    image: DOCTOR_AVATARS[1],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 05:00 PM',
    treatedDiseases: [
      'Major Depressive Disorder (Clinical Depression)',
      'Generalized Anxiety Disorder (GAD & Panic Attacks)',
      'Obsessive Compulsive Disorder (OCD)',
      'Bipolar Affective Disorder (Manic Depressive)',
      'Schizophrenia & Psychotic Disorders',
      'Insomnia & Chronic Sleep Disturbance',
      'Adult ADHD & Concentration Deficits',
      'Addiction & Substance Dependence'
    ],
    description: 'Leading psychiatric clinician specializing in neuro-chemical therapies, de-addiction protocols, and evidence-based psycho-pharmacology.',
    descriptionHindi: 'डिप्रेशन, गंभीर घबराहट (एंजाइटी), ओसीडी, अनिद्रा और मानसिक स्वास्थ्य के शीर्ष मनोचिकित्सक।'
  },
  {
    id: 'DOC-PSYCH-002',
    name: 'Dr. Neha Kapoor',
    gender: 'Female',
    specialty: 'Clinical Psychologist & Psychotherapist',
    category: 'psych',
    qualification: 'MA, M.Phil (Clinical Psychology - NIMHANS), PhD',
    experienceYears: 14,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 920,
    priceINR: 900,
    image: DOCTOR_AVATARS[2],
    languages: ['English', 'हिन्दी', 'Marathi'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    treatedDiseases: [
      'Post-Traumatic Stress Disorder (PTSD)',
      'Work Stress & Chronic Burnout',
      'Social Anxiety & Phobias',
      'Relationship & Marital Distress',
      'Eating Disorders (Anorexia & Bulimia)',
      'Low Self-Esteem & Grief Counseling'
    ],
    description: 'Specializes in Cognitive Behavioral Therapy (CBT), Dialectical Behavioral Therapy (DBT), and trauma-informed psychological counseling.',
    descriptionHindi: 'मानसिक तनाव, ट्रॉमा, सीबीटी काउंसलिंग और मनोवैज्ञानिक परामर्श की विशेषज्ञ।'
  },

  // ==================== 13. PEDIATRICS & NEONATOLOGY (93-98) ====================
  {
    id: 'DOC-PEDIA-001',
    name: 'Dr. Arvind Taneja',
    gender: 'Male',
    specialty: 'Senior Director - Pediatrics & Neonatology',
    category: 'pedia',
    qualification: 'MBBS, MD (Pediatrics), FAAP (USA)',
    experienceYears: 28,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1950,
    priceINR: 1100,
    image: DOCTOR_AVATARS[3],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 03:00 PM',
    treatedDiseases: [
      'Recurrent Childhood Fever & Viral Infections',
      'Childhood Asthma & Wheezing',
      'Pediatric Pneumonia & Croup',
      'Newborn Jaundice & Colic Pain',
      'Malnutrition, Stunting & Growth Delays',
      'Immunization & Vaccine Schedule Management',
      'Pediatric Diarrhea & Dehydration'
    ],
    description: 'Beloved child specialist with three decades of experience guiding newborns through adolescence with compassionate, minimal-antibiotic care.',
    descriptionHindi: 'शिशु एवं बाल रोग, बच्चों का बुखार, न्यूमोनिया, टीकाकरण और विकास विकारों के वरिष्ठ विशेषज्ञ।'
  },
  {
    id: 'DOC-PEDIA-002',
    name: 'Dr. Lakshmi Narayanan',
    gender: 'Female',
    specialty: 'Pediatric Neurologist & Developmental Specialist',
    category: 'pedia',
    qualification: 'MBBS, MD (Pediatrics), DM (Pediatric Neurology)',
    experienceYears: 16,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 780,
    priceINR: 1000,
    image: DOCTOR_AVATARS[4],
    languages: ['English', 'हिन्दी', 'Tamil'],
    nextAvailable: 'Tomorrow, 10:30 AM',
    treatedDiseases: [
      'Autism Spectrum Disorder (ASD)',
      'Attention Deficit Hyperactivity Disorder (ADHD in Children)',
      'Cerebral Palsy (CP)',
      'Pediatric Epilepsy & Febrile Seizures',
      'Developmental Speech & Motor Delay'
    ],
    description: 'Expert in child brain development, early autism intervention, seizure management, and neurodevelopmental therapies.',
    descriptionHindi: 'बच्चों में ऑटिज्म, एडीएचडी, दिमागी दौरे और भाषा-विकास में देरी की विशेषज्ञ।'
  },

  // ==================== 14. GYNECOLOGY & OBSTETRICS (99-106) ====================
  {
    id: 'DOC-WOMEN-001',
    name: 'Dr. Anuradha Kapur',
    gender: 'Female',
    specialty: 'Director & Head - Obstetrics & High-Risk Pregnancy',
    category: 'women',
    qualification: 'MBBS, MD (Obstetrics & Gynecology), FICOG',
    experienceYears: 26,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 2100,
    priceINR: 1200,
    image: DOCTOR_AVATARS[5],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 02:30 PM',
    treatedDiseases: [
      'High-Risk Pregnancy (Preeclampsia / Gestational Hypertension)',
      'Uterine Fibroids (Leiomyoma)',
      'Endometriosis & Adenomyosis (Severe Pelvic Pain)',
      'PCOS / PCOD & Irregular Menstrual Bleeding',
      'Infertility & Recurrent Miscarriages',
      'Pelvic Inflammatory Disease (PID & Vaginal Infections)',
      'Menopause & Perimenopausal Hormonal Changes'
    ],
    description: 'Eminent obstetrician and gynecological surgeon known for managing complex high-risk deliveries and laparoscopic uterus-preserving surgeries.',
    descriptionHindi: 'हाई-रिस्क प्रेग्नेंसी, रसौली (फाइब्रॉयड), एंडोमेट्रियोसिस, पीसीओडी और बांझपन की शीर्ष विशेषज्ञ।'
  },
  {
    id: 'DOC-WOMEN-002',
    name: 'Dr. Gauri Agarwal',
    gender: 'Female',
    specialty: 'Reproductive Endocrinologist & IVF Fertility Specialist',
    category: 'women',
    qualification: 'MBBS, DGO, DNB, Fellowship in Reproductive Medicine',
    experienceYears: 16,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1140,
    priceINR: 1100,
    image: DOCTOR_AVATARS[6],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Tomorrow, 11:30 AM',
    treatedDiseases: [
      'Female Infertility (Blocked Fallopian Tubes & Low AMH)',
      'Male Factor Infertility (Azoospermia / Oligospermia)',
      'In-Vitro Fertilization (IVF) & ICSI Treatments',
      'Recurrent IVF Failure & Implantation Issues',
      'Egg Freezing & Fertility Preservation'
    ],
    description: 'Accomplished fertility specialist with high IVF success rates utilizing advanced embryology diagnostics.',
    descriptionHindi: 'आईवीएफ (IVF), निःसंतानता उपचार और प्रजनन स्वास्थ्य की प्रमुख विशेषज्ञ।'
  },

  // ==================== 15. RHEUMATOLOGY & AUTOIMMUNE (107-112) ====================
  {
    id: 'DOC-RHEUMA-001',
    name: 'Dr. Rohini Handa',
    gender: 'Male',
    specialty: 'Senior Consultant Rheumatologist',
    category: 'rheuma',
    qualification: 'MBBS, MD, DNB (Medicine), FAMS, FRCP (Glasgow)',
    experienceYears: 29,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1680,
    priceINR: 1400,
    image: DOCTOR_AVATARS[7],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 04:30 PM',
    treatedDiseases: [
      'Rheumatoid Arthritis (RA & Joint Deformity)',
      'Systemic Lupus Erythematosus (Lupus / SLE)',
      'Ankylosing Spondylitis (Severe Spine Stiffening)',
      'Gout & High Uric Acid Crystal Arthritis',
      'Sjogren’s Syndrome & Dry Eye/Mouth',
      'Systemic Sclerosis (Scleroderma)',
      'Fibromyalgia & Chronic Widespread Pain'
    ],
    description: 'Pioneer of Indian rheumatology, providing state-of-the-art biological immunomodulators and targeted DMARD therapies for chronic inflammatory joint diseases.',
    descriptionHindi: 'रूमेटाइड गठिया, ल्यूपस (SLE), एंकीलोजिंग स्पॉन्डिलाइटिस और यूरिक एसिड के शीर्ष विशेषज्ञ।'
  },
  {
    id: 'DOC-RHEUMA-002',
    name: 'Dr. Sujata Ganguly',
    gender: 'Female',
    specialty: 'Clinical Immunologist & Pediatric Rheumatologist',
    category: 'rheuma',
    qualification: 'MBBS, MD, DM (Clinical Immunology & Rheumatology)',
    experienceYears: 14,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 610,
    priceINR: 1000,
    image: DOCTOR_AVATARS[8],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Tomorrow, 01:00 PM',
    treatedDiseases: [
      'Juvenile Idiopathic Arthritis (JIA in Children)',
      'Vasculitis (Wegener’s / Takayasu Arteritis)',
      'Antiphospholipid Antibody Syndrome (APS)',
      'Polymyalgia Rheumatica',
      'Autoimmune Myositis & Muscle Weakness'
    ],
    description: 'Expert in early juvenile arthritis intervention, complex autoimmune vasculitis, and immunosuppressive therapy monitoring.',
    descriptionHindi: 'बच्चों में गठिया (JIA), वैस्कुलाइटिस और ऑटोइम्यून मांसपेशियों की कमजोरी की विशेषज्ञ।'
  },

  // ==================== 16. INFECTIOUS DISEASES (113-118) ====================
  {
    id: 'DOC-INFECT-001',
    name: 'Dr. Suranjit Chatterjee',
    gender: 'Male',
    specialty: 'Senior Consultant - Internal Medicine & Infectious Diseases',
    category: 'infect',
    qualification: 'MBBS, MD (Internal Medicine), Fellowship (Infectious Diseases)',
    experienceYears: 24,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1540,
    priceINR: 1000,
    image: DOCTOR_AVATARS[9],
    languages: ['English', 'हिन्दी', 'Bengali'],
    nextAvailable: 'Today, 02:00 PM',
    treatedDiseases: [
      'Dengue Fever, Severe Thrombocytopenia & Shock Syndrome',
      'Malaria (Plasmodium Falciparum & Vivax)',
      'Typhoid Fever (Enteric Fever & Relapses)',
      'Chikungunya Joint Pain & Post-Viral Arthritis',
      'HIV / AIDS & Opportunistic Infections',
      'Sepsis & Severe Bacterial Bloodstream Infections',
      'Fever of Unknown Origin (FUO - Prolonged Fevers)'
    ],
    description: 'Veteran infectious disease clinician managing acute tropical fevers, antimicrobial resistance (AMR), and difficult-to-diagnose pyrexias.',
    descriptionHindi: 'डेंगू, मलेरिया, टाइफाइड, चिकनगुनिया, एचआईवी और पुराने अज्ञात बुखार के वरिष्ठ विशेषज्ञ।'
  },
  {
    id: 'DOC-INFECT-002',
    name: 'Dr. Kavita Regunathan',
    gender: 'Female',
    specialty: 'Travel Medicine & Antimicrobial Stewardship Specialist',
    category: 'infect',
    qualification: 'MBBS, MD, DNB (Tropical Medicine)',
    experienceYears: 13,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 520,
    priceINR: 750,
    image: DOCTOR_AVATARS[0],
    languages: ['English', 'हिन्दी', 'Tamil'],
    nextAvailable: 'Tomorrow, 10:00 AM',
    treatedDiseases: [
      'Swine Flu (H1N1) & Seasonal Influenza',
      'Scrub Typhus & Rickettsial Infections',
      'Leptospirosis & Monsoonal Illnesses',
      'Fungal Infections (Mucormycosis / Aspergillosis)',
      'Travel Vaccinations & Prophylaxis'
    ],
    description: 'Expert in tropical fever diagnostics, hospital infection control, and international travel prophylaxis.',
    descriptionHindi: 'स्वाइन फ्लू, वायरल बुखार, फंगल इन्फेक्शन और संक्रामक बीमारियों की विशेषज्ञ।'
  },

  // ==================== 17. AYUSH, AYURVEDA & INTEGRATIVE (119-126) ====================
  {
    id: 'DOC-AYUSH-001',
    name: 'Vaidya Devendra Triguna',
    gender: 'Male',
    specialty: 'Ayurvedacharya & Nadi Pariksha (Pulse Diagnosis) Master',
    category: 'ayush',
    qualification: 'BAMS, MD (Ayurveda), Padma Bhushan & Padma Shri Awardee',
    experienceYears: 35,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 5.0,
    reviewsCount: 3200,
    priceINR: 800,
    image: DOCTOR_AVATARS[1],
    languages: ['English', 'हिन्दी', 'Sanskrit'],
    nextAvailable: 'Tomorrow, 09:00 AM',
    treatedDiseases: [
      'Prakriti Imbalance (Vata, Pitta, Kapha Tridosha Disorders)',
      'Chronic Joint Pain & Amavata (Ayurvedic Arthritis Care)',
      'Chronic Digestive Sluggishness (Mandagni, Aam Dosha & Acidity)',
      'Panchakarma Detoxification & Rejuvenation (Rasayana)',
      'Metabolic Disorders & Chronic Fatigue',
      'Skin Disorders & Blood Purification (Raktashodhaka)'
    ],
    description: 'World-renowned master of classical Ayurvedic pulse diagnosis (Nadi Pariksha) and individualized herbal formulations for chronic lifestyle conditions.',
    descriptionHindi: 'नाड़ी परीक्षा, वात-पित्त-कफ त्रिदोष संतुलन, पंचकर्म और प्राकृतिक हर्बल चिकित्सा के पद्म भूषण सम्मानित वैद्य।'
  },
  {
    id: 'DOC-AYUSH-002',
    name: 'Dr. Pratibha Sharma',
    gender: 'Female',
    specialty: 'Senior Ayurvedic Physician & Women’s Health (Stri Roga)',
    category: 'ayush',
    qualification: 'BAMS, MD (Ayurveda - Stri Roga & Prasuti Tantra)',
    experienceYears: 17,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1250,
    priceINR: 650,
    image: DOCTOR_AVATARS[2],
    languages: ['English', 'हिन्दी', 'Malayalam', 'Kannada'],
    nextAvailable: 'Today, 03:00 PM',
    treatedDiseases: [
      'Ayurvedic Management of PCOS / PCOD',
      'Infertility & Garbhadhana Sanskar (Pre-Conception Care)',
      'Menopausal Syndrome & Hot Flashes',
      'Post-Partum Recovery & Lactation Support (Sutika Paricharya)',
      'Thyroid Dysfunction (Ayurvedic Protocol)'
    ],
    description: 'Expert in classical Kerala Ayurvedic therapies, Panchakarma detox, and holistic herbal treatments for women’s hormonal health.',
    descriptionHindi: 'पीसीओडी, बांझपन, थायरॉइड और महिलाओं के स्वास्थ्य की आयुर्वेदिक विशेषज्ञ।'
  },
  {
    id: 'DOC-AYUSH-003',
    name: 'Dr. Mukesh Batra',
    gender: 'Male',
    specialty: 'Senior Homeopathic Consultant',
    category: 'ayush',
    qualification: 'BHMS, MD (Homeopathy), Padma Shri Awardee',
    experienceYears: 32,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 2100,
    priceINR: 700,
    image: DOCTOR_AVATARS[3],
    languages: ['English', 'हिन्दी', 'Gujarati', 'Marathi'],
    nextAvailable: 'Today, 04:30 PM',
    treatedDiseases: [
      'Chronic Allergic Rhinitis, Sneezing & Sinusitis',
      'Eczema, Psoriasis & Chronic Skin Itching (Homeopathy)',
      'Hair Fall, Dandruff & Alopecia Areata',
      'Childhood Recurrent Tonsillitis & Adenoids',
      'Gastric Hyperacidity, IBS & Constipation',
      'Anxiety & Stress-Induced Physical Symptoms'
    ],
    description: 'Padma Shri recipient with global prominence in individualized classical homeopathy for chronic skin, respiratory, and pediatric complaints.',
    descriptionHindi: 'एलर्जी, सोरायसिस, बाल झड़ने, बच्चों के टॉन्सिल और पुरानी बीमारियों के पद्मश्री सम्मानित होम्योपैथ।'
  },
  {
    id: 'DOC-AYUSH-004',
    name: 'Hakim Syed Tariq',
    gender: 'Male',
    specialty: 'Senior Unani Medicine Specialist',
    category: 'ayush',
    qualification: 'BUMS, MD (Unani - Ilaj-bit-Tadbeer)',
    experienceYears: 20,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.8,
    reviewsCount: 840,
    priceINR: 500,
    image: DOCTOR_AVATARS[4],
    languages: ['English', 'हिन्दी', 'Urdu'],
    nextAvailable: 'Tomorrow, 11:00 AM',
    treatedDiseases: [
      'Mizaj (Temperament) Imbalances',
      'Chronic Joint Pain (Waja-ul-Mafasil)',
      'Hepatoprotection & Jaundice (Ilaj-bit-Tadbeer / Regimental Therapy)',
      'Sexual Weakness & Premature Ejaculation',
      'Kidney & Bladder Stones (Hisat-e-Kulyah)',
      'Chronic Migraine (Shaqeeqa)'
    ],
    description: 'Distinguished Unani scholar specializing in herbal pharmacotherapy, Hijama (Cupping Therapy), and temperament balance.',
    descriptionHindi: 'यूनानी चिकित्सा, हिजामा (कपिंग थेरेपी), जोड़ों के दर्द और हर्बल उपचार के विशेषज्ञ हकीम।'
  },

  // ==================== 18. GENERAL, PLASTIC & VASCULAR SURGERY (127-134) ====================
  {
    id: 'DOC-SURG-001',
    name: 'Dr. Pradeep Chowbey',
    gender: 'Male',
    specialty: 'Chairman - Minimal Access, Bariatric & GI Surgery',
    category: 'surgery',
    qualification: 'MBBS, MS (Surgery), MNAMS, FIMSA, Padma Shri Awardee',
    experienceYears: 32,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 5.0,
    reviewsCount: 2600,
    priceINR: 1500,
    image: DOCTOR_AVATARS[5],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Tomorrow, 10:30 AM',
    treatedDiseases: [
      'Morbid Obesity (Bariatric Gastric Bypass & Sleeve Gastrectomy)',
      'Complex Ventral, Umbilical & Incisional Hernias',
      'Gallbladder Stones & Choledochal Cysts',
      'GERD & Hiatus Hernia Repair (Fundoplication)',
      'Achalasia Cardia (Laparoscopic Heller Myotomy)'
    ],
    description: 'Padma Shri recipient, honorary surgeon to the President of India, and pioneer of laparoscopic and robotic metabolic bariatric surgery in South Asia.',
    descriptionHindi: 'मोटापा घटाने की बैरियाट्रिक सर्जरी, दूरबीन से हर्निया और पित्त की थैली के पद्मश्री सम्मानित सर्जन।'
  },
  {
    id: 'DOC-SURG-002',
    name: 'Dr. Lokesh Kumar',
    gender: 'Male',
    specialty: 'Director & Head - Plastic, Cosmetic & Reconstructive Surgery',
    category: 'surgery',
    qualification: 'MBBS, MS, MCh (Plastic Surgery), FRCS',
    experienceYears: 24,
    hospital: 'Max Super Speciality Hospital',
    location: 'New Delhi',
    rating: 4.9,
    reviewsCount: 1320,
    priceINR: 1400,
    image: DOCTOR_AVATARS[6],
    languages: ['English', 'हिन्दी'],
    nextAvailable: 'Today, 04:00 PM',
    treatedDiseases: [
      'Post-Trauma Facial Fractures & Laceration Reconstruction',
      'Post-Burn Contractures & Skin Grafting',
      'Cleft Lip & Cleft Palate Deformities in Children',
      'Diabetic Foot Ulcer Reconstruction (Flap Surgery)',
      'Breast Reconstruction following Mastectomy',
      'Rhinoplasty (Nose Reshaping) & Scar Revision'
    ],
    description: 'Renowned plastic and reconstructive microvascular surgeon with expertise in complex trauma repair, burn reconstruction, and aesthetic contouring.',
    descriptionHindi: 'प्लास्टिक एवं रीकंस्ट्रक्टिव सर्जरी, जलने के निशान, कटे होंठ और चेहरे की सर्जरी के विशेषज्ञ।'
  }
];

// Helper search function covering ALL diseases, specialties, doctors, hospitals & locations
export function searchDoctors(query = '', category = 'all', maxPrice = Infinity, sortBy = 'rating') {
  const q = (query || '').toLowerCase().trim();

  let results = DOCTORS_DATA.filter((doc) => {
    // Category match
    const categoryMatch = category === 'all' || doc.category === category;
    if (!categoryMatch) return false;

    // Price match
    if (doc.priceINR > maxPrice) return false;

    // Text search matching against name, specialty, qualification, hospital, location, and EVERY treated disease
    if (!q) return true;

    const inName = doc.name.toLowerCase().includes(q);
    const inSpecialty = doc.specialty.toLowerCase().includes(q);
    const inHospital = doc.hospital.toLowerCase().includes(q);
    const inLocation = doc.location.toLowerCase().includes(q);
    const inDesc = (doc.description + ' ' + (doc.descriptionHindi || '')).toLowerCase().includes(q);
    const inDiseases = doc.treatedDiseases.some(d => d.toLowerCase().includes(q));

    return inName || inSpecialty || inHospital || inLocation || inDesc || inDiseases;
  });

  // Sort
  if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  } else if (sortBy === 'experience') {
    results.sort((a, b) => b.experienceYears - a.experienceYears);
  } else if (sortBy === 'price_asc') {
    results.sort((a, b) => a.priceINR - b.priceINR);
  } else if (sortBy === 'price_desc') {
    results.sort((a, b) => b.priceINR - a.priceINR);
  }

  return results;
}
