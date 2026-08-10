import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Compass,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Share2,
  Sparkles,
  Star,
  User,
  Users,
  X,
  Bookmark,
  Layers,
  ArrowUpRight,
  Quote
} from 'lucide-react';

export default function App() {
  // Navigation active view: 'landing' | 'login' | 'register' | 'profile' | 'jobs'
  const [currentView, setCurrentView] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Typewriter / Roller effect for landing hero
  const [wordIndex, setWordIndex] = useState(0);
  const words = ['Possibility.', 'Opportunity.', 'Growth.', 'Impact.'];

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  // Form State Handlers
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form
  const [regRole, setRegRole] = useState('work'); // 'hire' | 'work'
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Profile Setup Form
  const [profileName, setProfileName] = useState('Jane Doe');
  const [profileHeading, setProfileHeading] = useState('Senior Product Designer');
  const [profileAbout, setProfileAbout] = useState('');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 000-0000');
  const [profileLocation, setProfileLocation] = useState('San Francisco, CA');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Job Search State
  const [selectedJobId, setSelectedJobId] = useState('job-1');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSaveDraft = () => {
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0A0F1D] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* GLOBAL SCREEN SWITCHER TOOLBAR (For Design Review & Testing) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#0B0F19] text-white py-2 px-4 shadow-md flex items-center justify-between flex-wrap gap-2 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
            Design Preview Mode
          </span>
          <span className="text-slate-400 hidden sm:inline">Select View:</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => navigateTo('landing')}
            className={`px-3 py-1 rounded-md transition font-medium whitespace-nowrap ${
              currentView === 'landing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            1. Landing Page
          </button>
          <button
            onClick={() => navigateTo('login')}
            className={`px-3 py-1 rounded-md transition font-medium whitespace-nowrap ${
              currentView === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            2. Log In
          </button>
          <button
            onClick={() => navigateTo('register')}
            className={`px-3 py-1 rounded-md transition font-medium whitespace-nowrap ${
              currentView === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            3. Create Account
          </button>
          <button
            onClick={() => navigateTo('profile')}
            className={`px-3 py-1 rounded-md transition font-medium whitespace-nowrap ${
              currentView === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            4. Complete Profile
          </button>
          <button
            onClick={() => navigateTo('jobs')}
            className={`px-3 py-1 rounded-md transition font-medium whitespace-nowrap ${
              currentView === 'jobs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            5. Job Search
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RENDER ACTIVE VIEW PAGE                                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-grow flex flex-col">
        {currentView === 'landing' && (
          <LandingView
            navigateTo={navigateTo}
            wordIndex={wordIndex}
            words={words}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        )}
        {currentView === 'login' && (
          <LoginView
            navigateTo={navigateTo}
            email={loginEmail}
            setEmail={setLoginEmail}
            password={loginPassword}
            setPassword={setLoginPassword}
            showPassword={showLoginPassword}
            setShowPassword={setShowLoginPassword}
          />
        )}
        {currentView === 'register' && (
          <RegisterView
            navigateTo={navigateTo}
            role={regRole}
            setRole={setRegRole}
            name={regName}
            setName={setRegName}
            email={regEmail}
            setEmail={setRegEmail}
            password={regPassword}
            setPassword={setRegPassword}
            showPassword={showRegPassword}
            setShowPassword={setShowRegPassword}
          />
        )}
        {currentView === 'profile' && (
          <ProfileView
            navigateTo={navigateTo}
            name={profileName}
            setName={setProfileName}
            heading={profileHeading}
            setHeading={setProfileHeading}
            about={profileAbout}
            setAbout={setProfileAbout}
            phone={profilePhone}
            setPhone={setProfilePhone}
            location={profileLocation}
            setLocation={setProfileLocation}
            handleSaveDraft={handleSaveDraft}
            savedToast={profileSavedToast}
          />
        )}
        {currentView === 'jobs' && (
          <JobsView
            navigateTo={navigateTo}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
          />
        )}
      </div>
    </div>
  );
}

/* =================================================================== */
/* 1. LANDING PAGE VIEW (Matching Image 1)                            */
/* =================================================================== */
function LandingView({ navigateTo, wordIndex, words, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="fade-in flex flex-col min-h-screen">
      {/* Header Navigation */}
      <header className="w-full bg-[#FAF9F5] border-b border-slate-200/60 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigateTo('landing')}
              className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-slate-900"
            >
              <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-serif">
                J
              </span>
              Joblifyr
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
                Find Talent
              </button>
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
                Find Work
              </button>
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
                Categories
              </button>
              <button onClick={() => navigateTo('landing')} className="hover:text-slate-900 transition">
                Resources
              </button>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigateTo('login')}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigateTo('register')}
              className="bg-[#4F52E6] hover:bg-[#4345D9] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-500/20 flex items-center gap-2"
            >
              Join Joblifyr
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => navigateTo('jobs')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-slate-900"
            >
              Find Talent
            </button>
            <button
              onClick={() => navigateTo('jobs')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-slate-900"
            >
              Find Work
            </button>
            <button
              onClick={() => navigateTo('jobs')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-slate-900"
            >
              Categories
            </button>
            <button
              onClick={() => navigateTo('landing')}
              className="block w-full text-left py-2 font-medium text-slate-700 hover:text-slate-900"
            >
              Resources
            </button>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="w-full py-2.5 text-center font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                Log In
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="w-full py-2.5 text-center font-semibold text-white bg-[#4F52E6] rounded-xl"
              >
                Join Joblifyr
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/60 text-xs font-semibold text-slate-700 uppercase tracking-wider">
              <Sparkles size={14} className="text-indigo-600" />
              A better way to work together
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
              Where good work meets{' '}
              <span className="text-[#4F52E6] font-serif italic inline-block transition-all duration-300">
                {words[wordIndex]}
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              One considered space for ambitious people and teams to find each other, do meaningful
              work, and keep growing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('register')}
                className="bg-[#0A0F1D] hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-slate-900/10 text-base"
              >
                Find your next move <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigateTo('jobs')}
                className="inline-flex items-center gap-2.5 font-semibold text-slate-800 hover:text-indigo-600 px-4 py-3.5 transition text-base"
              >
                <CirclePlay size={22} className="text-slate-900" /> See how it works
              </button>
            </div>

            <div className="flex items-center gap-4 pt-6 text-sm text-slate-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-xs font-bold text-amber-900">
                  JM
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-900">
                  AL
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-900">
                  RK
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-xs font-bold">
                  +
                </div>
              </div>
              <span>
                Trusted by <strong className="text-slate-900">18,000+</strong> people building their
                future
              </span>
            </div>
          </div>

          {/* Right Floating Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="w-full h-[460px] rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 relative overflow-hidden flex items-center justify-center border border-indigo-100/50 shadow-inner">
              {/* Background ambient orbs */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-200/40 rounded-full blur-2xl" />

              {/* Profile Card */}
              <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-floating border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-indigo-400 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    MK
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    Available
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-4">Maya Kline</h3>
                <p className="text-sm text-slate-500">Product designer · Berlin</p>

                <div className="flex gap-2 mt-4">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold">
                    Product design
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-semibold">
                    Research
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star size={14} fill="currentColor" /> 4.9{' '}
                    <span className="text-slate-400 font-normal">(48 reviews)</span>
                  </span>
                  <button
                    onClick={() => navigateTo('jobs')}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                  >
                    View profile <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Floating Match Card */}
              <div className="absolute bottom-6 left-4 z-20 bg-white rounded-xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">It’s a match</div>
                  <div className="text-[11px] text-slate-500">98% role alignment</div>
                </div>
              </div>

              {/* Floating Company Card */}
              <div className="absolute top-6 right-4 z-20 bg-white rounded-xl p-3 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                  N
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Northstar Labs</div>
                  <div className="text-[11px] text-slate-500">Just posted a role</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Bar */}
        <section className="border-y border-slate-200/80 py-8 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <span className="font-medium tracking-wide">
              Helping independent work feel more human
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 font-extrabold text-slate-400 text-xl tracking-tight">
              <span>orbit</span>
              <span>lumen</span>
              <span>cinder</span>
              <span>MONO</span>
              <span>aperture</span>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Explore with intent
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
                Work that fits your <br className="hidden sm:inline" />
                <span className="font-serif italic text-indigo-600 font-normal">whole</span> career.
              </h2>
            </div>
            <p className="text-slate-600 max-w-sm text-base leading-relaxed">
              From first projects to defining roles, Joblifyr makes it simpler to discover
              opportunities worth your time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Development',
                count: '3,240 open roles',
                icon: '⌘',
                color: 'bg-indigo-100 text-indigo-700'
              },
              {
                title: 'Design & creative',
                count: '1,860 open roles',
                icon: '✦',
                color: 'bg-teal-100 text-teal-700'
              },
              {
                title: 'Writing & marketing',
                count: '2,480 open roles',
                icon: '✎',
                color: 'bg-orange-100 text-orange-700'
              },
              {
                title: 'Business & finance',
                count: '930 open roles',
                icon: '◈',
                color: 'bg-pink-100 text-pink-700'
              }
            ].map((cat) => (
              <div
                key={cat.title}
                onClick={() => navigateTo('jobs')}
                className="group bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 cursor-pointer flex flex-col justify-between h-52 relative"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-xl font-bold`}
                >
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </div>
                <ArrowRight
                  size={20}
                  className="absolute bottom-6 right-6 text-indigo-600 group-hover:translate-x-1 transition"
                />
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Dark Container */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-2xl">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">
                Designed for momentum
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Less searching. <br />
                <span className="font-serif italic text-emerald-400 font-normal">More starting.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 divide-y divide-slate-800">
              {[
                {
                  num: '01',
                  title: 'Show what you do',
                  desc: 'Build a living profile with your work, experience, and the things that make you different.'
                },
                {
                  num: '02',
                  title: 'Find the right fit',
                  desc: 'Use thoughtful search, clear details, and signals that help you decide quickly.'
                },
                {
                  num: '03',
                  title: 'Make work happen',
                  desc: 'Connect, collaborate, and grow from a place built around trust.'
                }
              ].map((step) => (
                <div key={step.num} className="py-6 first:pt-0 last:pb-0 flex gap-6">
                  <span className="font-mono text-emerald-400 text-sm font-bold">{step.num}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Fresh opportunities
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Roles with room to <span className="font-serif italic text-indigo-600">grow.</span>
            </h2>
            <p className="text-slate-600 text-base">See the work that’s moving today.</p>
            <button
              onClick={() => navigateTo('jobs')}
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-800 transition"
            >
              Explore all work <ArrowRight size={16} />
            </button>
          </div>

          <div className="lg:col-span-7 divide-y divide-slate-200/80 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            {[
              {
                role: 'Senior product designer',
                company: 'Aster Studio',
                meta: 'Remote · Full-time',
                pay: '$75–95/hr',
                initials: 'A',
                bg: 'bg-indigo-600'
              },
              {
                role: 'Frontend engineer',
                company: 'Northstar Labs',
                meta: 'Remote · Contract',
                pay: '$60–85/hr',
                initials: 'N',
                bg: 'bg-teal-600'
              },
              {
                role: 'Brand strategist',
                company: 'House of Form',
                meta: 'New York · Hybrid',
                pay: '$5k–7k/mo',
                initials: 'H',
                bg: 'bg-orange-500'
              }
            ].map((job) => (
              <div
                key={job.role}
                onClick={() => navigateTo('jobs')}
                className="py-5 px-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${job.bg} text-white font-bold flex items-center justify-center`}
                  >
                    {job.initials}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">{job.company}</div>
                    <h3 className="text-base font-bold text-slate-900">{job.role}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{job.meta}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900">{job.pay}</div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-0.5 ml-auto mt-1">
                    View <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stories Testimonial */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-emerald-100/70 border border-emerald-200 rounded-3xl p-8 sm:p-14 relative overflow-hidden">
            <div className="text-6xl font-serif text-emerald-700 leading-none">“</div>
            <blockquote className="text-2xl sm:text-4xl font-serif text-slate-900 leading-tight max-w-3xl mt-4">
              Joblifyr feels like it understands that a great opportunity is about more than a job
              title.
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-white font-bold flex items-center justify-center text-xs">
                  TR
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Tariq Reynolds</div>
                  <div className="text-xs text-slate-600">Independent creative director</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold text-slate-900">
                  4.8<span className="text-base font-normal text-slate-600">/5</span>
                </div>
                <div className="text-xs text-slate-600">average connection rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#4F52E6] text-white py-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                Your next chapter is here
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2">
                Good work is <br /> closer than you think.
              </h2>
            </div>
            <button
              onClick={() => navigateTo('register')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl text-base shadow-xl transition flex items-center gap-2 whitespace-nowrap"
            >
              Create your profile <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0F19] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-serif">
                J
              </span>
              Joblifyr
            </div>
            <p className="text-xs text-slate-400 mt-2">Work, with more possibility.</p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm font-medium">
            <button onClick={() => navigateTo('jobs')} className="hover:text-white transition">
              Discover
            </button>
            <button onClick={() => navigateTo('jobs')} className="hover:text-white transition">
              For companies
            </button>
            <button onClick={() => navigateTo('login')} className="hover:text-white transition">
              Sign in
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          © 2026 Joblifyr. Made for good work.
        </div>
      </footer>
    </div>
  );
}

/* =================================================================== */
/* 2. LOGIN PAGE VIEW (Matching Image 2)                               */
/* =================================================================== */
function LoginView({ navigateTo, email, setEmail, password, setPassword, showPassword, setShowPassword }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    navigateTo('jobs');
  };

  return (
    <div className="fade-in flex flex-col min-h-screen bg-[#FAF9F5]">
      {/* Header Navigation */}
      <header className="w-full bg-[#FAF9F5] border-b border-slate-200/60 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={() => navigateTo('landing')}
            className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2"
          >
            Joblifyr
          </button>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
              Find Talent
            </button>
            <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
              Find Work
            </button>
            <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900 transition">
              Categories
            </button>
            <button onClick={() => navigateTo('landing')} className="hover:text-slate-900 transition">
              Resources
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('login')}
              className="text-sm font-semibold text-slate-900 px-4 py-2"
            >
              Log In
            </button>
            <button
              onClick={() => navigateTo('register')}
              className="bg-[#4F52E6] hover:bg-[#4345D9] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
            >
              Join Joblifyr
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Container Card */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-2">Log in to continue to Joblifyr.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent!')}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition text-sm text-center"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigateTo('jobs')}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <ArrowRight size={16} className="text-indigo-600" /> Sign in with Google
            </button>
            <button
              type="button"
              onClick={() => navigateTo('jobs')}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <Briefcase size={16} className="text-blue-600" /> Sign in with LinkedIn
            </button>
          </div>

          <div className="text-center mt-8 text-xs text-slate-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigateTo('register')}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </main>

      {/* Dark Footer */}
      <footer className="bg-[#0B0F19] text-slate-400 py-8 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-white text-xl">Joblifyr</div>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <a href="#" className="hover:text-white transition">
              About Us
            </a>
            <a href="#" className="hover:text-white transition">
              Careers
            </a>
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Cookie Settings
            </a>
            <a href="#" className="hover:text-white transition">
              Contact Support
            </a>
          </div>
          <div>© 2024 Joblifyr Inc. Built for ambitious teams.</div>
        </div>
      </footer>
    </div>
  );
}

/* =================================================================== */
/* 3. REGISTER PAGE VIEW (Matching Image 3)                            */
/* =================================================================== */
function RegisterView({
  navigateTo,
  role,
  setRole,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    navigateTo('profile');
  };

  return (
    <div className="fade-in flex flex-col min-h-screen bg-[#FAF9F5]">
      {/* Header Navigation */}
      <header className="w-full bg-[#FAF9F5] border-b border-slate-200/60 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={() => navigateTo('landing')}
            className="text-2xl font-extrabold tracking-tight text-slate-900"
          >
            Joblifyr
          </button>
          <button
            onClick={() => navigateTo('login')}
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Form Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl max-w-lg mx-auto lg:max-w-none w-full">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Join the high-end recruitment ecosystem today.
            </p>

            {/* Segmented Toggle Role Selector */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <button
                type="button"
                onClick={() => setRole('hire')}
                className={`py-3 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition ${
                  role === 'hire'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase size={16} /> I want to hire
              </button>
              <button
                type="button"
                onClick={() => setRole('work')}
                className={`py-3 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition ${
                  role === 'work'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User size={16} /> I want to work
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Must be at least 8 characters.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition text-sm flex items-center justify-center gap-2 mt-4"
              >
                Create account <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                OR CONTINUE WITH
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigateTo('profile')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
              >
                <strong>G</strong> Google
              </button>
              <button
                type="button"
                onClick={() => navigateTo('profile')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs"
              >
                <span className="font-bold text-blue-600">in</span> LinkedIn
              </button>
            </div>

            <div className="text-center mt-6 text-xs text-slate-600">
              Already have an account?{' '}
              <button
                onClick={() => navigateTo('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Log in
              </button>
            </div>
          </div>

          {/* Right Banner Testimonial Column */}
          <div className="lg:col-span-6 hidden lg:flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 bg-white shadow-md border border-slate-200/80 rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <div className="text-xs">
                <div className="text-slate-400 font-medium">Top Tier Talent</div>
                <div className="font-bold text-slate-900">Vetted Network</div>
              </div>
            </div>

            <div className="mt-16 bg-white/70 backdrop-blur-md rounded-3xl p-10 border border-slate-200/60 shadow-xl shadow-indigo-500/5 relative">
              <Quote className="text-slate-300 w-10 h-10 mb-4" />
              <blockquote className="text-xl font-serif italic text-slate-800 leading-relaxed">
                "Joblifyr transformed how we build our engineering teams. The caliber of talent and
                the seamless interface make it our exclusive hiring platform."
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-300 overflow-hidden border-2 border-white shadow">
                  <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-indigo-800 flex items-center justify-center text-white font-bold text-xs">
                    SJ
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Sarah Jenkins</div>
                  <div className="text-xs text-slate-500">VP of Engineering, TechFlow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0F19] text-slate-400 py-8 px-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-white text-xl">Joblifyr</div>
          <div>© 2024 Joblifyr Inc. Built for ambitious teams.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              About Us
            </a>
            <a href="#" className="hover:text-white">
              Careers
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Cookie Settings
            </a>
            <a href="#" className="hover:text-white">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =================================================================== */
/* 4. COMPLETE YOUR PROFILE VIEW (Matching Image 4)                    */
/* =================================================================== */
function ProfileView({
  navigateTo,
  name,
  setName,
  heading,
  setHeading,
  about,
  setAbout,
  phone,
  setPhone,
  location,
  setLocation,
  handleSaveDraft,
  savedToast
}) {
  return (
    <div className="fade-in flex flex-col min-h-screen bg-[#FAF9F5]">
      {/* Header Navigation */}
      <header className="w-full bg-[#FAF9F5] border-b border-slate-200/60 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigateTo('landing')}
              className="text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Joblifyr
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900">
                Find Jobs
              </button>
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900">
                Companies
              </button>
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900">
                Salaries
              </button>
              <button onClick={() => navigateTo('jobs')} className="hover:text-slate-900">
                Messages
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => alert('Resume Uploader Mock Triggered')}
              className="text-slate-700 hover:text-slate-900"
            >
              Upload your resume
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              JD
            </div>
            <button
              onClick={() => navigateTo('jobs')}
              className="text-slate-700 hover:text-slate-900 border-l border-slate-300 pl-4"
            >
              Employers / Post Job
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Stand out to top employers by providing a comprehensive overview of your skills and
            experience.
          </p>
        </div>

        {savedToast && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between">
            <span>Draft saved successfully!</span>
            <X size={16} className="cursor-pointer" onClick={() => handleSaveDraft()} />
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 pb-4 border-b border-slate-200">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Professional Heading
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              About Me
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Briefly describe your professional background and goals..."
              className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl text-sm transition"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => navigateTo('jobs')}
            className="bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md shadow-indigo-500/20 transition"
          >
            Continue to Experience
          </button>
        </div>
      </main>

      {/* Light Clean Footer */}
      <footer className="bg-[#FAF9F5] border-t border-slate-200 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2024 Joblifyr. All rights reserved.</div>
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-slate-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-900">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =================================================================== */
/* 5. JOB SEARCH & DETAILS VIEW (Matching Image 5)                    */
/* =================================================================== */
function JobsView({
  navigateTo,
  selectedJobId,
  setSelectedJobId,
  searchTitle,
  setSearchTitle,
  searchLocation,
  setSearchLocation
}) {
  const jobsData = [
    {
      id: 'job-1',
      title: 'Senior UX Designer',
      company: 'Stellar Tech Innovations',
      location: 'San Francisco, CA • Remote',
      pay: '$120k - $150k a year',
      payFull: '$120,000 - $150,000 a year',
      type: 'Full-time',
      workMode: 'Remote',
      posted: 'Posted 2 days ago',
      matchScore: '98% Match',
      matchType: 'green',
      logoText: 'J',
      logoBg: 'bg-slate-100 text-indigo-600',
      description:
        'We are looking for a Senior UX Designer to lead the design of our core product suite. You will work closely with product managers and engineers to deliver exceptional user experiences...',
      fullDescription:
        'We are looking for a highly skilled Senior UX Designer to join our dynamic product team. You will be responsible for leading the user experience design for our flagship enterprise SaaS platform, ensuring a seamless, intuitive, and visually engaging experience for our global user base.',
      responsibilities: [
        'Lead end-to-end design processes from conceptualization to final deployment.',
        'Collaborate with product managers, engineers, and stakeholders to define user flows.',
        'Conduct user research, usability testing, and transform insights into actionable designs.'
      ]
    },
    {
      id: 'job-2',
      title: 'Product Manager',
      company: 'FinCorp Solutions',
      location: 'New York, NY • Hybrid',
      pay: '$140k - $170k a year',
      payFull: '$140,000 - $170,000 a year',
      type: 'Full-time',
      workMode: 'Hybrid',
      posted: 'Posted 5 days ago',
      matchScore: '85% Match',
      matchType: 'blue',
      logoText: 'F',
      logoBg: 'bg-emerald-100 text-emerald-700',
      description:
        'Join our rapidly growing fintech startup. You will own the roadmap for our consumer-facing app, driving growth and engagement through data-driven decisions...',
      fullDescription:
        'FinCorp Solutions is seeking an ambitious Product Manager to drive product strategy and execution for our next-generation consumer banking suite.',
      responsibilities: [
        'Define key product requirements and user stories.',
        'Work closely with cross-functional development teams.',
        'Track and analyze KPIs to optimize feature rollout.'
      ]
    },
    {
      id: 'job-3',
      title: 'Frontend Developer',
      company: 'Creative Agency LLC',
      location: 'Austin, TX • On-site',
      pay: '$90k - $120k a year',
      payFull: '$90,000 - $120,000 a year',
      type: 'Contract',
      workMode: 'On-site',
      posted: 'Posted 1 week ago',
      matchScore: null,
      logoText: '</>',
      logoBg: 'bg-amber-100 text-amber-700',
      description:
        'Looking for a React specialist to build interactive marketing sites and high-performance user dashboards for global enterprise clients...',
      fullDescription:
        'Creative Agency LLC is hiring a Frontend Developer experienced in modern Javascript frameworks, React, Next.js, and responsive design systems.',
      responsibilities: [
        'Build responsive, accessible UI components.',
        'Optimize app performance and SEO structure.',
        'Collaborate with visual designers to implement pixel-perfect layouts.'
      ]
    }
  ];

  const activeJob = jobsData.find((j) => j.id === selectedJobId) || jobsData[0];

  return (
    <div className="fade-in flex flex-col min-h-screen bg-[#FAF9F5]">
      {/* Header Navigation */}
      <header className="w-full bg-[#FAF9F5] border-b border-slate-200/60 sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button
              onClick={() => navigateTo('landing')}
              className="text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Joblifyr
            </button>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button
                onClick={() => navigateTo('jobs')}
                className="text-indigo-600 border-b-2 border-indigo-600 pb-1 font-semibold"
              >
                Find Jobs
              </button>
              <button
                onClick={() => navigateTo('jobs')}
                className="text-slate-600 hover:text-slate-900 pb-1"
              >
                Companies
              </button>
              <button
                onClick={() => navigateTo('jobs')}
                className="text-slate-600 hover:text-slate-900 pb-1"
              >
                Salaries
              </button>
              <button
                onClick={() => navigateTo('jobs')}
                className="text-slate-600 hover:text-slate-900 pb-1"
              >
                Messages
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
              JD
            </div>
            <button
              onClick={() => alert('Post a Job modal opened!')}
              className="bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md"
            >
              Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Main Search Hero Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 w-full">
        <h2 className="text-sm font-semibold text-slate-600 mb-3">Find your next role</h2>

        {/* Dual Search Input Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-md flex flex-col md:flex-row items-center gap-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Job title, keywords, or company"
              className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block" />

          <div className="relative flex-grow w-full">
            <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="City, state, or remote"
              className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => alert('Filtering jobs...')}
            className="w-full md:w-auto bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold px-8 py-3 rounded-xl text-sm transition shadow-md whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Suggested tags */}
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
          <span>Suggested:</span>
          <button
            onClick={() => setSearchTitle('UX Designer')}
            className="bg-slate-200/60 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium transition"
          >
            UX Designer
          </button>
          <button
            onClick={() => setSearchTitle('Product Manager')}
            className="bg-slate-200/60 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium transition"
          >
            Product Manager
          </button>
          <button
            onClick={() => setSearchTitle('Frontend Developer')}
            className="bg-slate-200/60 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium transition"
          >
            Frontend Developer
          </button>
        </div>
      </section>

      {/* Main Two Column Feed */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Job Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>
                Showing <strong className="text-slate-900">243</strong> jobs
              </span>
              <div className="flex items-center gap-1">
                <span>Sort by:</span>
                <span className="font-bold text-slate-900 cursor-pointer">Relevance</span>
              </div>
            </div>

            {jobsData.map((job) => {
              const isSelected = selectedJobId === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-6 rounded-2xl transition cursor-pointer relative bg-white border ${
                    isSelected
                      ? 'border-2 border-indigo-600 shadow-lg'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-extrabold text-sm">
                      {job.logoText}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Bookmarked ${job.title}`);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-3">{job.title}</h3>
                  <div className="text-xs text-slate-600 font-medium mt-1">{job.company}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{job.location}</div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">
                      💵 {job.pay}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{job.posted}</span>
                    {job.matchScore && (
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          job.matchType === 'green'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        ✓ {job.matchScore}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Job View */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm sticky top-[120px]">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-extrabold text-lg">
                {activeJob.logoText}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Saved ${activeJob.title}`)}
                  className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  <Bookmark size={18} />
                </button>
                <button
                  onClick={() => alert(`Shared link for ${activeJob.title}`)}
                  className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {activeJob.title}
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {activeJob.company} <span className="font-normal text-slate-500">• {activeJob.location}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => alert(`Applied for ${activeJob.title}!`)}
                  className="bg-[#4F52E6] hover:bg-[#4345D9] text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-500/20 transition"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => alert(`Saved ${activeJob.title}`)}
                  className="bg-white hover:bg-slate-50 border border-indigo-600 text-indigo-600 font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                >
                  Save Job
                </button>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Job Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">💵 Pay</span>
                    <strong className="text-slate-900 text-sm mt-0.5 block">
                      {activeJob.payFull}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">💼 Job type</span>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded">
                        {activeJob.type}
                      </span>
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded">
                        {activeJob.workMode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Job Description Section */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-4">Full Job Description</h3>

                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  About the Role
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeJob.fullDescription}
                </p>

                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-6 mb-3">
                  Key Responsibilities:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {activeJob.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Light Clean Footer */}
      <footer className="bg-[#FAF9F5] border-t border-slate-200 py-8 px-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="font-extrabold text-slate-900 text-xl">Joblifyr</div>
          <div className="flex justify-center gap-6 font-medium">
            <a href="#" className="hover:text-slate-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-900">
              Cookie Policy
            </a>
            <a href="#" className="hover:text-slate-900">
              Contact Us
            </a>
          </div>
          <div>© 2024 Joblifyr Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
