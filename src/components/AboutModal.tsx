import { useEffect, useRef, useState } from 'react';
import {
  X, Layers, GitBranch, Cpu, Zap, Sparkles, User, Mail, Building2,
  Shield, ShoppingBag, Camera, Maximize2, Search, Brain, Bot,
  Cloud, Database, Bell, Lock, Server, Code2, Users, Store,
  Wand2, Network, ArrowRight, Package, Image as ImageIcon,
  MessageCircle, Mic, Globe, Volume2, PlayCircle, Pause, Video,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SECTIONS = [
  {
    id: 'overview',
    label: 'Project Overview',
    gradient: 'from-blue-600 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: 'services',
    label: 'Services & Infrastructure',
    gradient: 'from-blue-700 to-cyan-500',
    border: 'border-cyan-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.18)]',
    hoverBorder: 'hover:border-cyan-500',
    icon: <Cloud className="w-5 h-5" />,
  },
  {
    id: 'middleware',
    label: 'Middleware & APIs',
    gradient: 'from-teal-600 to-blue-400',
    border: 'border-teal-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(20,184,166,0.18)]',
    hoverBorder: 'hover:border-teal-500',
    icon: <Server className="w-5 h-5" />,
  },
  {
    id: 'frontend',
    label: 'Frontend Framework',
    gradient: 'from-sky-600 to-blue-400',
    border: 'border-sky-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(14,165,233,0.18)]',
    hoverBorder: 'hover:border-sky-500',
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    id: 'userflow',
    label: 'User Experience Flow',
    gradient: 'from-blue-600 to-teal-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    id: 'sellerflow',
    label: 'Seller Dashboard Flow',
    gradient: 'from-blue-700 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Store className="w-5 h-5" />,
  },
  {
    id: 'aisearch',
    label: 'AI-Powered Search',
    gradient: 'from-blue-600 to-cyan-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Search className="w-5 h-5" />,
  },
  {
    id: 'recommendations',
    label: 'Product Recommendations',
    gradient: 'from-blue-500 to-cyan-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'tryon',
    label: 'AI Virtual Try-On',
    gradient: 'from-blue-600 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Camera className="w-5 h-5" />,
  },
  {
    id: 'agents',
    label: 'Multi-Agent Architecture',
    gradient: 'from-blue-700 to-cyan-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Network className="w-5 h-5" />,
  },
  {
    id: 'architecture',
    label: 'Architecture Diagram',
    gradient: 'from-blue-600 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: 'features',
    label: 'Key Features',
    gradient: 'from-cyan-600 to-blue-400',
    border: 'border-cyan-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(34,211,238,0.18)]',
    hoverBorder: 'hover:border-cyan-500',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'aries',
    label: 'Aries AI Chatbot',
    gradient: 'from-blue-600 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    id: 'video',
    label: 'Video Overview',
    gradient: 'from-blue-700 to-blue-400',
    border: 'border-blue-300',
    glow: 'hover:shadow-[0_8px_30px_rgba(59,130,246,0.18)]',
    hoverBorder: 'hover:border-blue-500',
    icon: <Video className="w-5 h-5" />,
  },
];

const userFlowSteps = [
  { step: '01', title: 'Land & Browse', desc: 'Customer visits the TCC RAPTOR Try On Store. They browse the product catalog — blazers, formal wear, and accessories — filtered by gender and category.' },
  { step: '02', title: 'AI-Powered Search', desc: 'User types a natural-language query like "I want a conference meeting outfit with the best blazer suit." The AI search engine parses intent, occasion, gender, and color to recommend complete outfits rather than just keyword matches.' },
  { step: '03', title: 'Select Product', desc: 'User opens a product page. High-res imagery, size options, colour variants and pricing are displayed. A Quick View modal allows rapid evaluation without leaving the listing.' },
  { step: '04', title: 'Virtual Try-On (Blazers)', desc: 'User taps "AI Try-On". They upload a photo or capture one with the webcam. The frontend sends the image alongside the garment image to Gemini 3.1 Flash Lite Image, which renders a photorealistic composite of the person wearing the blazer.' },
  { step: '05', title: 'Curate Outfit', desc: 'The AI try-on surface suggests complementary items (trousers, vest, shoes, accessories). Users can toggle each suggestion to build a complete outfit before generating.' },
  { step: '06', title: 'Personalized Recommendations', desc: 'Based on purchase history, the system surfaces personalized product recommendations with tailored discounts. Logged-in users like Tessa see curated complementary items from previous purchases.' },
  { step: '07', title: 'Add to Cart', desc: 'Satisfied with the try-on, the user adds products to the shopping cart. Cart state persists across page navigation via React Context.' },
  { step: '08', title: 'Capture & Share', desc: 'Users can download the AI-generated outfit photo to share with friends or compare looks before purchasing.' },
];

const sellerFlowSteps = [
  { step: '01', title: 'Seller Login', desc: 'Authorized seller personnel sign in through a dedicated seller login page. Access is restricted to authorized accounts only — the general public cannot reach the dashboard.' },
  { step: '02', title: 'Seller Home Dashboard', desc: 'The command center provides an at-a-glance view of key metrics: revenue, orders, conversion rate, and AI-generated insights for the seller\'s product portfolio.' },
  { step: '03', title: 'Sales Performance', desc: 'Detailed analytics on sales trends, top-performing products, revenue breakdowns by category, and customer segments — all visualized with interactive charts.' },
  { step: '04', title: 'AI Forecast', desc: 'Machine learning models predict future demand, seasonal trends, and inventory needs, helping sellers make proactive stocking decisions.' },
  { step: '05', title: 'Dynamic Pricing', desc: 'AI-driven pricing engine recommends optimal price points based on demand, competition, inventory levels, and historical sales data.' },
  { step: '06', title: 'AI Copilot', desc: 'A conversational AI assistant that helps sellers with product descriptions, marketing copy, customer queries, and strategic recommendations.' },
  { step: '07', title: 'Actions', desc: 'A task management surface where AI-generated action items — restock alerts, price adjustments, campaign suggestions — can be reviewed and executed.' },
];

const services = [
  {
    icon: <Cloud className="w-5 h-5" />,
    title: 'Google Cloud Run Deployment',
    desc: 'The application is containerized and deployed on Google Cloud Run, providing auto-scaling, serverless execution, and zero-downtime deployments. Cloud Run handles traffic spikes automatically and scales to zero when idle, optimizing cost.',
    color: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'Firebase Authentication & Authorization',
    desc: 'Firebase Auth manages user identity with email/password authentication. JWT tokens are issued and validated on every request. Role-based access control (RBAC) separates customer and seller permissions — sellers gain dashboard access only through authorized accounts.',
    color: 'text-teal-600',
    border: 'border-teal-200',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Firestore — Customer Segment Tracking',
    desc: 'Firestore NoSQL database stores customer profiles, purchase history, browsing behavior, and segment assignments. Each user is tagged with segments (e.g., "frequent buyer", "blazer enthusiast") that drive personalized recommendations and targeted notifications.',
    color: 'text-cyan-600',
    border: 'border-cyan-200',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: 'Firebase Cloud Messaging (FCM)',
    desc: 'FCM delivers push notifications for two key scenarios: (1) Product suggestions — personalized recommendations sent when new arrivals match a customer\'s segment, and (2) Abandoned cart reminders — gentle nudges when a user leaves items in their cart without completing checkout.',
    color: 'text-blue-600',
    border: 'border-blue-200',
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: 'Firebase Backend Database',
    desc: 'Firebase serves as the primary backend database layer — Firestore for structured data (users, products, orders, cart, segments) and Firebase Storage for media (product images, user uploads, AI-generated try-on results). Real-time listeners power live cart and inventory updates.',
    color: 'text-teal-600',
    border: 'border-teal-200',
  },
  {
    icon: <ImageIcon className="w-5 h-5" />,
    title: 'AI Image Generation — Gemini 3.1 Flash Lite Image',
    desc: 'Google Gemini 3.1 Flash Lite Image powers the virtual try-on feature. It takes a user photo and a garment image, then generates a photorealistic composite of the person wearing the item. Built-in safety filters validate all inputs and outputs for responsible AI use.',
    color: 'text-blue-600',
    border: 'border-blue-200',
  },
];

const middlewareServices = [
  { name: 'Auth Middleware', desc: 'Validates Firebase JWT tokens on every API request, injects the authenticated user into the request context, and rejects unauthorized calls.' },
  { name: 'Search Orchestration', desc: 'Receives natural-language queries, calls the AI intent parser, routes to the recommendation engine, and assembles complete outfit responses.' },
  { name: 'Recommendation Engine', desc: 'Reads customer segments and purchase history from Firestore, matches against product metadata, and returns scored complementary items with discount logic.' },
  { name: 'Image Generation Pipeline', desc: 'Manages the try-on workflow: accepts user photo uploads, validates content safety, calls Gemini 3.1 Flash Lite Image, stores results in Firebase Storage, and returns signed URLs.' },
  { name: 'Notification Dispatcher', desc: 'Listens to Firestore triggers for cart abandonment and new arrivals, composes notification payloads, and sends via FCM to the right customer segments.' },
  { name: 'Cart & Order Service', desc: 'Manages cart state, validates inventory, processes checkout, writes order records to Firestore, and triggers downstream events (confirmation, segment update, recommendation refresh).' },
];

const agents = [
  {
    name: 'Search Agent',
    icon: <Search className="w-5 h-5" />,
    color: 'text-blue-600',
    border: 'border-blue-200',
    desc: 'Parses natural-language queries to extract intent — occasion, gender, category, color, and whether the user wants a complete outfit or individual items.',
    connectsTo: ['Recommendation Agent', 'Outfit Builder Agent'],
  },
  {
    name: 'Recommendation Agent',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-cyan-600',
    border: 'border-cyan-200',
    desc: 'Reads customer segments and purchase history from Firestore, scores products for relevance, and applies personalized discount logic (e.g., 3% for Tessa).',
    connectsTo: ['Notification Agent', 'Search Agent'],
  },
  {
    name: 'Try-On Agent',
    icon: <Camera className="w-5 h-5" />,
    color: 'text-blue-600',
    border: 'border-blue-200',
    desc: 'Handles the Gemini image generation pipeline — validates uploads, sends user photo + garment to Gemini 3.1 Flash Lite Image, and returns the composite result.',
    connectsTo: ['Outfit Builder Agent', 'Image Storage'],
  },
  {
    name: 'Outfit Builder Agent',
    icon: <Package className="w-5 h-5" />,
    color: 'text-teal-600',
    border: 'border-teal-200',
    desc: 'Assembles complementary products into complete looks. Receives product matches from the Search and Recommendation agents and curates coordinated sets.',
    connectsTo: ['Search Agent', 'Recommendation Agent', 'Try-On Agent'],
  },
  {
    name: 'Notification Agent',
    icon: <Bell className="w-5 h-5" />,
    color: 'text-blue-600',
    border: 'border-blue-200',
    desc: 'Monitors Firestore for cart abandonment and new-arrival events. Composes and dispatches FCM push notifications to the appropriate customer segments.',
    connectsTo: ['Recommendation Agent', 'FCM Service'],
  },
  {
    name: 'Seller Copilot Agent',
    icon: <Bot className="w-5 h-5" />,
    color: 'text-cyan-600',
    border: 'border-cyan-200',
    desc: 'Assists sellers with AI-generated insights — sales forecasts, dynamic pricing recommendations, marketing copy, and actionable task suggestions.',
    connectsTo: ['Forecast Agent', 'Pricing Agent', 'Seller Dashboard'],
  },
];

const features = [
  { icon: <Search className="w-5 h-5" />, title: 'AI-Powered Natural-Language Search', desc: 'Users type conversational queries and receive complete outfit recommendations, not just keyword matches.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Personalized Recommendations', desc: 'Purchase history and customer segments drive tailored product suggestions with individualized discounts.' },
  { icon: <Camera className="w-5 h-5" />, title: 'AI Virtual Try-On', desc: 'Gemini 3.1 Flash Lite Image renders photorealistic outfit composites from a single user photo — no green screen required.' },
  { icon: <ShoppingBag className="w-5 h-5" />, title: 'Outfit Builder', desc: 'AI-suggested accessories (vest, trousers, shoes, bag) can be toggled individually to compose and visualise a full look.' },
  { icon: <Store className="w-5 h-5" />, title: 'AI Seller Dashboard', desc: 'A complete command center with sales analytics, AI forecasting, dynamic pricing, and an AI copilot assistant.' },
  { icon: <Bell className="w-5 h-5" />, title: 'Smart Notifications', desc: 'FCM-powered push notifications for abandoned cart reminders and personalized product suggestions.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Responsive Product Catalog', desc: 'Filterable, paginated catalog across Men and Women categories with Quick View modals.' },
  { icon: <Shield className="w-5 h-5" />, title: 'Gemini Safety Filters', desc: 'Every generation request passes through Gemini built-in safety filters for responsible AI output.' },
  { icon: <Maximize2 className="w-5 h-5" />, title: 'Full-Size Image Viewer', desc: 'Generated try-on results can be viewed at full resolution in an immersive lightbox.' },
];

const YOUTUBE_VIDEO_ID = 'IXFocPEiQ4w';
const videoEmbedSrc = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`;
const videoThumbnail = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

export default function AboutModal({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [videoMaximized, setVideoMaximized] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && videoMaximized) {
        setVideoMaximized(false);
        setVideoStarted(false);
        setVideoKey(k => k + 1);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [videoMaximized]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const scrollTo = (id: string) => {
    document.getElementById(`about-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-start justify-center bg-blue-900/40 backdrop-blur-md overflow-x-hidden overflow-y-auto py-2 sm:py-4 lg:py-6 px-1 sm:px-3 lg:px-4"
    >
      <div className="relative w-full min-w-0 max-w-full sm:max-w-6xl bg-white border border-blue-200 rounded-none sm:rounded-2xl shadow-[0_8px_80px_rgba(0,59,122,0.25)] overflow-hidden break-words">

        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white/95 border-b border-blue-200 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600 mb-0.5">TCC RAPTOR</p>
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 leading-none">About This Project</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section nav pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 border-b border-blue-100">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-1.5 max-w-full px-3 py-1.5 rounded-full text-[11px] font-semibold border bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 transition-all duration-200 ${s.border} ${s.hoverBorder} ${s.glow}`}
            >
              {s.icon}
              <span className="whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14 min-w-0">

          {/* ── 1. Project Overview ──────────────────────────────────────── */}
          <section id="about-overview">
            <SectionTitle section={SECTIONS[0]} />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">What It Is</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  An AI-powered retail platform built on Google Gemini. Customers can visualise blazers and formal wear on their own photo using Gemini 3.1 Flash Lite Image, search with natural language, receive personalized recommendations, and build complete outfits — while sellers manage their business through an AI-powered dashboard.
                </p>
              </div>
              <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Why It Matters</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Retail return rates are driven by fit uncertainty. By letting shoppers "wear" items before purchasing, this platform reduces decision friction, increases conversion confidence, and demonstrates TCC RAPTOR's Gemini AI capabilities in a production-grade retail context — for both customers and sellers.
                </p>
              </div>
              <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Tech Stack</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li><span className="text-blue-600 font-medium">Frontend:</span> React 18 + TypeScript, Vite, Tailwind CSS</li>
                  <li><span className="text-blue-600 font-medium">AI Generation:</span> Google Gemini 3.1 Flash Lite Image</li>
                  <li><span className="text-blue-600 font-medium">Backend:</span> Firebase (Firestore, Auth, FCM, Storage)</li>
                  <li><span className="text-blue-600 font-medium">Deployment:</span> Google Cloud Run</li>
                  <li><span className="text-blue-600 font-medium">Safety:</span> Gemini built-in safety filters</li>
                </ul>
              </div>
              <div className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 hover:border-blue-300 rounded-xl p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Scope</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Customer storefront: browse, search, try-on, cart</li>
                  <li>• Seller dashboard: analytics, forecasting, pricing, copilot</li>
                  <li>• AI search with natural-language outfit recommendations</li>
                  <li>• Personalized product recommendations with discounts</li>
                  <li>• FCM push notifications for cart abandonment & new arrivals</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── 2. Services & Infrastructure ──────────────────────────────── */}
          <section id="about-services">
            <SectionTitle section={SECTIONS[1]} />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.title}
                  className={`bg-white border ${s.border} hover:border-blue-400 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] rounded-xl p-5 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-blue-50 border ${s.border} flex items-center justify-center ${s.color} flex-none`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-semibold ${s.color} mb-1.5`}>{s.title}</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Middleware & APIs ──────────────────────────────────────── */}
          <section id="about-middleware">
            <SectionTitle section={SECTIONS[2]} />
            <div className="mt-5 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                The middleware layer sits between the React frontend and the Firebase/Gemini backend services. It handles authentication, request orchestration, business logic, and data transformation before anything reaches the database or AI models.
              </p>
              {middlewareServices.map((m) => (
                <div
                  key={m.name}
                  className="bg-white border border-teal-200 hover:border-teal-400 hover:shadow-[0_8px_30px_rgba(20,184,166,0.12)] rounded-xl p-4 transition-all duration-300 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center flex-none mt-0.5">
                    <Server className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-teal-700 mb-0.5">{m.name}</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 4. Frontend Framework ──────────────────────────────────────── */}
          <section id="about-frontend">
            <SectionTitle section={SECTIONS[3]} />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-sky-200 hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] rounded-xl p-5 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-3">
                  <Code2 className="w-5 h-5 text-sky-600" />
                  <h4 className="text-sm font-semibold text-sky-700">Core Framework</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  <li><span className="text-sky-600 font-medium">React 18</span> — component-based UI with hooks</li>
                  <li><span className="text-sky-600 font-medium">TypeScript</span> — type-safe development</li>
                  <li><span className="text-sky-600 font-medium">Vite</span> — fast HMR dev server & build tool</li>
                  <li><span className="text-sky-600 font-medium">Tailwind CSS</span> — utility-first styling</li>
                  <li><span className="text-sky-600 font-medium">React Router</span> — client-side routing</li>
                </ul>
              </div>
              <div className="bg-white border border-sky-200 hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] rounded-xl p-5 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-3">
                  <Layers className="w-5 h-5 text-sky-600" />
                  <h4 className="text-sm font-semibold text-sky-700">State & Context</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  <li><span className="text-sky-600 font-medium">AuthContext</span> — Firebase auth state management</li>
                  <li><span className="text-sky-600 font-medium">CartContext</span> — shopping cart state</li>
                  <li><span className="text-sky-600 font-medium">SellerAuthContext</span> — seller session</li>
                  <li><span className="text-sky-600 font-medium">React hooks</span> — useState, useEffect, useCallback</li>
                </ul>
              </div>
              <div className="bg-white border border-sky-200 hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] rounded-xl p-5 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-3">
                  <Wand2 className="w-5 h-5 text-sky-600" />
                  <h4 className="text-sm font-semibold text-sky-700">UI Libraries</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  <li><span className="text-sky-600 font-medium">Lucide React</span> — icon system</li>
                  <li><span className="text-sky-600 font-medium">Tailwind</span> — custom color ramps & 8px spacing</li>
                  <li>Responsive breakpoints (mobile → desktop)</li>
                  <li>Micro-interactions & hover states</li>
                </ul>
              </div>
              <div className="bg-white border border-sky-200 hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] rounded-xl p-5 transition-all duration-300">
                <div className="flex items-center gap-2.5 mb-3">
                  <Cpu className="w-5 h-5 text-sky-600" />
                  <h4 className="text-sm font-semibold text-sky-700">AI Integration</h4>
                </div>
                <ul className="text-sm text-slate-600 space-y-1.5">
                  <li><span className="text-sky-600 font-medium">Gemini API</span> — image generation calls</li>
                  <li><span className="text-sky-600 font-medium">aiSearch.ts</span> — intent parsing & scoring engine</li>
                  <li>Client-side recommendation logic</li>
                  <li>MediaPipe Hands (WASM) for AR tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── 5. User Experience Flow ──────────────────────────────────────── */}
          <section id="about-userflow">
            <SectionTitle section={SECTIONS[4]} />
            <div className="mt-5 relative">
              <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/60 via-teal-400/30 to-transparent" />
              <div className="space-y-4 pl-14">
                {userFlowSteps.map((s) => (
                  <div
                    key={s.step}
                    className="relative group bg-white border border-blue-100 hover:border-blue-400 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]"
                  >
                    <div className="absolute -left-[42px] top-4 w-[34px] h-[34px] rounded-full bg-white border-2 border-blue-300 group-hover:border-blue-500 flex items-center justify-center transition-colors">
                      <span className="text-[10px] font-bold text-blue-600">{s.step}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">{s.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 6. Seller Dashboard Flow ──────────────────────────────────────── */}
          <section id="about-sellerflow">
            <SectionTitle section={SECTIONS[5]} />
            <div className="mt-5 relative">
              <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-600/60 via-blue-400/30 to-transparent" />
              <div className="space-y-4 pl-14">
                {sellerFlowSteps.map((s) => (
                  <div
                    key={s.step}
                    className="relative group bg-white border border-blue-100 hover:border-blue-400 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]"
                  >
                    <div className="absolute -left-[42px] top-4 w-[34px] h-[34px] rounded-full bg-white border-2 border-blue-300 group-hover:border-blue-500 flex items-center justify-center transition-colors">
                      <span className="text-[10px] font-bold text-blue-600">{s.step}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">{s.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 7. AI-Powered Search ──────────────────────────────────────── */}
          <section id="about-aisearch">
            <SectionTitle section={SECTIONS[6]} />
            <div className="mt-5 space-y-4">
              <div className="bg-white border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  The AI search engine lets users type natural-language prompts and receive intelligent recommendations. Instead of matching individual keywords, the AI understands the user's intent and recommends complete, coordinated outfits.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-600 mb-1.5">Example Query</p>
                  <p className="text-sm text-blue-900 italic">"I want a conference meeting outfit with the best blazer suit."</p>
                </div>
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-600 mb-2">AI Response — Complete Outfit</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Navy Heritage Blazer', 'Navy Suit Blazer & Trouser', 'Blue Vest Ensemble', 'Brown Oxford Shoes'].map((item) => (
                    <div key={item} className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
                      <p className="text-[11px] font-medium text-blue-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { title: 'Intent Parsing', desc: 'Extracts occasion, gender, category, color, and outfit-completeness from the query.' },
                  { title: 'Product Scoring', desc: 'Scores every product against the parsed intent using weighted relevance signals.' },
                  { title: 'Outfit Assembly', desc: 'Curates complementary products into a complete, coordinated look.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 transition-all duration-300">
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">{item.title}</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 8. Product Recommendations ──────────────────────────────────────── */}
          <section id="about-recommendations">
            <SectionTitle section={SECTIONS[7]} />
            <div className="mt-5 space-y-4">
              <div className="bg-white border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  The recommendation engine analyzes a customer's purchase history, product preferences, and customer segment to surface complementary items with personalized offers. When a user like Tessa logs in, the homepage displays curated recommendations based on her previous purchase of the Heritage Brown Blazer Coat.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-600 mb-1.5">Personalized Example</p>
                  <p className="text-sm text-blue-900 mb-3">Hi Tessa! Based on your previous purchase, Heritage Brown Blazer Coat, we think you might like:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      Luxe Structured Handbag — with an additional 3% discount
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      Sandals & Blazer Set — complete your look with 3% discount
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { title: 'Purchase History', desc: 'Firestore stores each customer\'s past purchases for recommendation grounding.' },
                  { title: 'Segment Matching', desc: 'Customer segments (e.g., "blazer enthusiast") drive which product pools are searched.' },
                  { title: 'Discount Logic', desc: 'Personalized discounts are calculated and applied per user, per recommendation.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 transition-all duration-300">
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">{item.title}</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 9. AI Virtual Try-On ──────────────────────────────────────── */}
          <section id="about-tryon">
            <SectionTitle section={SECTIONS[8]} />
            <div className="mt-5 space-y-4">
              <div className="bg-white border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  The virtual try-on feature uses Gemini 3.1 Flash Lite Image to generate photorealistic composites. A user uploads or captures a photo, selects a garment, and the AI renders the person wearing that item — no green screen, no 3D modeling, just a single API call.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: <Camera className="w-4 h-4" />, title: 'Photo Capture', desc: 'Upload an existing photo or capture live with the device webcam.' },
                  { icon: <ImageIcon className="w-4 h-4" />, title: 'Garment Selection', desc: 'Choose any blazer or outfit piece from the product catalog.' },
                  { icon: <Cpu className="w-4 h-4" />, title: 'Gemini Generation', desc: 'Gemini 3.1 Flash Lite Image composites the person + garment into one image.' },
                  { icon: <Shield className="w-4 h-4" />, title: 'Safety Validation', desc: 'Built-in safety filters validate inputs and outputs before display.' },
                  { icon: <Maximize2 className="w-4 h-4" />, title: 'Full-Size Viewer', desc: 'Results open in an immersive lightbox with keyboard support.' },
                  { icon: <Package className="w-4 h-4" />, title: 'Outfit Builder', desc: 'Toggle complementary items to build and visualize a complete look.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 mb-0.5">{item.title}</h4>
                      <p className="text-[13px] text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 10. Multi-Agent Architecture ──────────────────────────────── */}
          <section id="about-agents">
            <SectionTitle section={SECTIONS[9]} />
            <div className="mt-5 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                The platform is powered by multiple specialized AI agents that work together. Each agent handles a specific domain, and they communicate through the middleware layer to deliver a cohesive experience.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className={`bg-white border ${agent.border} hover:border-blue-400 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] rounded-xl p-4 transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg bg-blue-50 border ${agent.border} flex items-center justify-center ${agent.color} flex-none`}>
                        {agent.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-semibold ${agent.color}`}>{agent.name}</h4>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed mb-2.5">{agent.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-400">Connects to:</span>
                      {agent.connectsTo.map((target) => (
                        <span key={target} className="text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          {target}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Agent flow diagram */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5">
                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-600 mb-3">Agent Communication Flow</p>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-[12px] text-slate-600">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 font-medium text-blue-700 whitespace-nowrap">Search Agent</div>
                  <ArrowRight className="w-4 h-4 text-blue-300 hidden sm:block" />
                  <div className="bg-cyan-100 border border-cyan-300 rounded-lg px-3 py-2 font-medium text-cyan-700 whitespace-nowrap">Recommendation Agent</div>
                  <ArrowRight className="w-4 h-4 text-blue-300 hidden sm:block" />
                  <div className="bg-teal-100 border border-teal-300 rounded-lg px-3 py-2 font-medium text-teal-700 whitespace-nowrap">Outfit Builder</div>
                  <ArrowRight className="w-4 h-4 text-blue-300 hidden sm:block" />
                  <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 font-medium text-blue-700 whitespace-nowrap">Try-On Agent</div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 text-[12px] text-slate-600">
                  <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 font-medium text-blue-700 whitespace-nowrap">Notification Agent</div>
                  <ArrowRight className="w-4 h-4 text-blue-300 hidden sm:block" />
                  <div className="bg-cyan-100 border border-cyan-300 rounded-lg px-3 py-2 font-medium text-cyan-700 whitespace-nowrap">Seller Copilot Agent</div>
                  <ArrowRight className="w-4 h-4 text-blue-300 hidden sm:block" />
                  <span className="text-slate-500 text-[11px]">→ Firebase & Gemini Services</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 11. Architecture Diagram ───────────────────────────────────── */}
          <section id="about-architecture">
            <SectionTitle section={SECTIONS[10]} />
            <div className="mt-5 rounded-xl overflow-hidden border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(59,130,246,0.15)] bg-blue-50/30 p-1 sm:p-2">
              <img
                src="/TCC_Raptor_Architecture_Retail_Try_On.png"
                alt="TCC RAPTOR AI-Powered Retail Virtual Try-On Platform Architecture"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-400 text-center">
              TCC RAPTOR AI-Powered Retail Virtual Try-On Platform — End-to-End Architecture on Google Gemini
            </p>
          </section>

          {/* ── 12. Key Features ───────────────────────────────────────────── */}
          <section id="about-features">
            <SectionTitle section={SECTIONS[11]} />
            <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group bg-white border border-blue-100 hover:border-cyan-400 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(34,211,238,0.12)]"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 group-hover:border-cyan-400 flex items-center justify-center text-cyan-600 mb-3 transition-colors">
                    {f.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">{f.title}</h4>
                  <p className="text-[13px] text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 13. Aries AI Chatbot ───────────────────────────────────── */}
          <section id="about-aries">
            <SectionTitle section={SECTIONS[12]} />
            <div className="mt-5 space-y-4">
              <div className="bg-white border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-300">
                    <Zap className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">Aries — AI Shopping Assistant</h4>
                    <p className="text-[12px] text-blue-500">Powered by Web Speech API & intent-based NLP</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Aries is an AI-powered chatbot with a blue theme and thunder logo that assists customers with order tracking, product recommendations, and customer support. It features a floating launcher button accessible from every storefront page, and supports voice input and output for a hands-free experience.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-700">Deepanrey</h4>
                  </div>
                  <ul className="text-[13px] text-slate-600 space-y-1">
                    <li>• Email: deepanrey@gmail.com</li>
                    <li>• Customer ID: CUST-1001</li>
                    <li>• Language: English</li>
                    <li>• Order: ORD-10001 — Heritage Brown Blazer Coat</li>
                    <li>• Status: Out for Delivery (18 Aug 2026)</li>
                  </ul>
                </div>
                <div className="bg-white border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-blue-700">Tessa</h4>
                  </div>
                  <ul className="text-[13px] text-slate-600 space-y-1">
                    <li>• Email: tessa@gmail.com</li>
                    <li>• Customer ID: CUST-1002</li>
                    <li>• Language: Bahasa Melayu</li>
                    <li>• Order: ORD-10002 — Navy Heritage Blazer</li>
                    <li>• Status: Shipped (19 Aug 2026)</li>
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Multi-Language</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">English, Chinese (中文), and Bahasa Melayu with instant switching.</p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Voice Enabled</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Speak to Aries and hear responses spoken aloud using Web Speech API.</p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Secure Data Access</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Order info is restricted to the authenticated user's own account only.</p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Order Tracking</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Displays order ID, item, status, and expected delivery date.</p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Recommendations</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Personalized product cards based on purchase history — clickable to product pages.</p>
                  </div>
                </div>
                <div className="bg-white border border-blue-100 hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] rounded-xl p-4 flex items-start gap-3 transition-all duration-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-none">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-0.5">Voice Output</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Aries speaks responses aloud in the selected language — toggle on/off anytime.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-none mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-1">Data Isolation & Privacy</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      Aries only displays order details for the authenticated user's own account. If someone signs in with any other email, Aries will not reveal Deepanrey's or Tessa's order information. Order data is securely restricted per account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 14. Video Overview ─────────────────────────────────────── */}
          <section id="about-video">
            <SectionTitle section={SECTIONS[13]} />
            <div className="mt-5">
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-300 hover:border-blue-500 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(59,130,246,0.18)] group">
                <div className="aspect-video relative bg-slate-200">
                  {!videoStarted ? (
                    <button
                      onClick={() => setVideoStarted(true)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center group/play"
                    >
                      <img
                        src={videoThumbnail}
                        alt="TCC RAPTOR Project Overview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-blue-900/30 group-hover/play:bg-blue-900/20 transition-colors" />
                      <div className="relative w-20 h-20 rounded-full bg-blue-600 group-hover/play:bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-4 ring-white/30 transition-all group-hover/play:scale-110">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <p className="text-white font-semibold text-sm drop-shadow-lg">How This Project Works</p>
                        <p className="text-white/80 text-xs mt-1 drop-shadow">Full walkthrough of the TCC RAPTOR AI-Powered Retail Platform</p>
                      </div>
                    </button>
                  ) : (
                    <iframe
                      key={videoKey}
                      src={videoEmbedSrc}
                      title="TCC RAPTOR Project Overview"
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  )}

                  {videoStarted && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setVideoStarted(false); setVideoKey(k => k + 1); }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        Pause
                      </button>
                      <button
                        onClick={() => setVideoMaximized(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Maximize
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5 flex items-center justify-between bg-white">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">How This Project Works</h4>
                    <p className="text-[13px] text-slate-500 mt-0.5">Watch a full walkthrough of the TCC RAPTOR AI-Powered Retail Platform</p>
                  </div>
                  <button
                    onClick={() => videoStarted ? setVideoMaximized(true) : setVideoStarted(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105"
                  >
                    {videoStarted ? <><Maximize2 className="w-3.5 h-3.5" /> Maximize</> : <><PlayCircle className="w-3.5 h-3.5" /> Play Video</>}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── Creator Card ──────────────────────────────────────────────── */}
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-white transition-all duration-300 hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-300 flex items-center justify-center flex-none">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500 mb-1">Created By</p>
                  <h3 className="text-lg font-bold text-blue-900">Deepan Raj</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Senior Solution Architect – Azure, AWS &amp; GCP</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                    <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-blue-500 flex-none" />
                      TCC RAPTOR
                    </span>
                    <a
                      href="mailto:deepanraj.vellingiri@tccraptor.com"
                      className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-500 flex-none" />
                      deepanraj.vellingiri@tccraptor.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Video Maximize Overlay */}
      {videoMaximized && (
        <div className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm">TCC RAPTOR — Project Overview</h3>
              </div>
              <button
                onClick={() => { setVideoMaximized(false); setVideoStarted(false); setVideoKey(k => k + 1); }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-blue-400/30">
              <iframe
                key={`max-${videoKey}`}
                src={videoEmbedSrc}
                title="TCC RAPTOR Project Overview"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-center text-white/40 text-xs mt-3">Press ESC or close to stop playback</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ section }: { section: typeof SECTIONS[0] }) {
  return (
    <div className={`flex items-center gap-3 group cursor-default select-none`}>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center text-white flex-none shadow-lg`}>
        {section.icon}
      </div>
      <h3 className={`text-base sm:text-lg font-bold bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`}>
        {section.label}
      </h3>
      <div className={`flex-1 h-px bg-gradient-to-r ${section.gradient} opacity-20`} />
    </div>
  );
}
