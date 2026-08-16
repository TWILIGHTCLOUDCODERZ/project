import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import { womenProducts, menProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import PersonalizedRecommendations from '../components/PersonalizedRecommendations';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../data/products';

const HERO_SLIDES = [

  {
    src: '/Female_model_tcc_raptor_retail.png',
    position: 'object-top',
    objectPosition: undefined,
    label: "Women's Collection",
    kb: 'hero-kb-2',
  },
  {
    src: '/Male_model_tcc_raptor_retail.png',
    position: 'object-top',
    objectPosition: undefined,
    label: "Men's Collection",
    kb: 'hero-kb-3',
  },
];

interface HomePageProps {
  onQuickView: (product: Product) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-accent-500" />
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        {children}
      </span>
    </div>
  );
}

export default function HomePage({ onQuickView }: HomePageProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const { user } = useAuth();
  const featuredWomen = womenProducts.filter((p) => p.badge).slice(0, 3);
  const featuredMen = menProducts.filter((p) => p.badge).slice(0, 3);

  const isTessa = user?.email?.toLowerCase() === 'tessa@gmail.com';
  const tessaRecommendations = isTessa
    ? [
        {
          product: womenProducts.find((p) => p.id === 'w-handbag-1')!,
          message: 'Would you like to purchase this with an additional 3% discount?',
        },
        {
          product: womenProducts.find((p) => p.id === 'w-blazer-3')!,
          message: 'Complete your look with this set and enjoy an additional 3% discount.',
        },
      ].filter((r) => r.product)
    : [];

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#001233]">

        {/* Slideshow layers — crossfade + Ken Burns motion */}
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.label}
            className={[
              'absolute inset-0 w-full h-full object-cover select-none pointer-events-none',
              slide.objectPosition ? '' : slide.position,
              'transition-opacity duration-1000 ease-in-out',
              i === activeSlide ? `hero-slide-active ${slide.kb}` : '',
            ].join(' ')}
            style={{
              opacity: i === activeSlide ? 1 : 0,
              ...(slide.objectPosition ? { objectPosition: slide.objectPosition } : {}),
            }}
          />
        ))}

        {/* Left-side gradient — strong vignette for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001233]/85 via-[#001233]/40 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/70 via-transparent to-transparent" />

        {/* Slide indicator dots — bottom left */}
        <div className="absolute bottom-8 left-10 sm:left-14 lg:left-20 flex items-center gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? 'w-6 h-1.5 bg-gold-400'
                  : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Left-aligned content */}
        <div className="relative z-10 h-full flex flex-col items-start justify-center px-10 sm:px-14 lg:px-20 pb-12 max-w-2xl">

          {/* AI badge — outlined pill */}
          <div className="group flex items-center gap-2.5 border border-white/30 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm cursor-default hover:border-gold-400/70 hover:bg-white/8 hover:shadow-[0_0_16px_2px_rgba(212,175,55,0.18)] transition-all duration-300">
            <Cpu className="w-4 h-4 text-gold-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[13px] text-white/80 tracking-wide font-medium">Powered by&nbsp;</span>
            <span className="text-[13px] font-bold text-white tracking-wide group-hover:text-gold-300 transition-colors">
              Gemini 3.1 Flash Lite Image
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold text-white leading-[1.05] mb-4 drop-shadow-[0_2px_12px_rgba(0,18,51,0.5)]">
            <span className="block text-5xl sm:text-6xl lg:text-7xl tracking-tight">Redefine</span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-light italic tracking-tight">Your Style</span>
          </h1>

          {/* Experience tagline — bordered strip */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold-400/70" />
            <p className="text-[13px] sm:text-sm font-semibold tracking-[0.22em] uppercase text-gold-300">
              Experience the Real Feel
            </p>
          </div>

          {/* Sub-label — changes with slide */}
          <p
            key={activeSlide}
            className="text-[13px] text-white/55 tracking-[0.14em] uppercase font-medium mb-10 transition-all duration-500"
          >
            {HERO_SLIDES[activeSlide].label}
          </p>

          {/* CTA — outlined border style */}
          <Link
            to="/women"
            className="group inline-flex items-center gap-3 px-8 py-3.5 border-2 border-white text-white text-sm font-bold tracking-[0.06em] uppercase rounded-sm hover:bg-white hover:text-[#001233] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.2)]"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ─── Promise strip ─────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {[
              { title: 'Authentic Guarantee', desc: 'Every piece is 100% genuine' },
              { title: 'Expert Tailoring', desc: 'Precision fit across all sizes' },
              { title: '30-Day Returns', desc: 'Hassle-free returns policy' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center sm:items-start py-7 px-8 text-center sm:text-left">
                <p className="text-[13px] font-semibold text-primary-900 mb-0.5">{item.title}</p>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Personalized Recommendations (Tessa) ─────────────── */}
      {isTessa && (
        <PersonalizedRecommendations
          userName="Tessa"
          previousPurchaseName="Heritage Brown Blazer Coat"
          recommendations={tessaRecommendations}
        />
      )}

      {/* ─── Women's Collection ────────────────────────────────── */}
      <section id="featured" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <SectionLabel>For Her</SectionLabel>
              <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-primary-900 leading-tight">
                Women's Collection
              </h2>
              <p className="mt-3 text-sm text-neutral-500 max-w-sm leading-relaxed">
                Structured blazers and precision-tailored pieces for the modern professional.
              </p>
            </div>
            <Link
              to="/women"
              className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-900 border-b border-primary-900 pb-0.5 hover:text-accent-600 hover:border-accent-600 transition-colors group"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 lg:gap-8">
            <Link to="/women" className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/Female_model_tcc_raptor_retail.png"
                alt="Women's model"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-400">Explore</span>
                <p className="font-display text-2xl font-bold text-white mt-1">Shop Women</p>
              </div>
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {featuredWomen.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-neutral-100 max-w-7xl mx-auto" />

      {/* ─── Men's Collection ──────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <SectionLabel>For Him</SectionLabel>
              <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-primary-900 leading-tight">
                Men's Collection
              </h2>
              <p className="mt-3 text-sm text-neutral-500 max-w-sm leading-relaxed">
                Premium blazers and refined business wear for the discerning gentleman.
              </p>
            </div>
            <Link
              to="/men"
              className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-900 border-b border-primary-900 pb-0.5 hover:text-accent-600 hover:border-accent-600 transition-colors group"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 lg:gap-8">
            <Link to="/men" className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100">
              <img
                src="/Male_model_tcc_raptor_retail.png"
                alt="Men's model"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gold-400">Explore</span>
                <p className="font-display text-2xl font-bold text-white mt-1">Shop Men</p>
              </div>
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {featuredMen.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI Technology Banner ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#001233] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_50%,rgba(9,103,210,0.15),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionLabel>Innovation</SectionLabel>
              <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-white leading-tight mb-5">
                The Future of
                <br />
                <span className="font-light italic">Fashion Retail</span>
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-8 max-w-md">
                Virtual try-on powered by state-of-the-art generative AI. Upload your photo and see any item from our catalogue on you — instantly, accurately, professionally.
              </p>
              <div className="inline-flex items-center gap-4 border border-white/15 rounded-xl px-6 py-4 bg-white/5">
                <Cpu className="w-6 h-6 text-gold-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest mb-0.5">Powered by</p>
                  <p className="text-base font-bold text-gold-400">Gemini 3.1 Flash Lite Image</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { src: '/Female_model_tcc_raptor_retail.png', label: "Women's Wear" },
                { src: '/Male_model_tcc_raptor_retail.png', label: "Men's Wear" },
              ].map((item) => (
                <div key={item.label} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-semibold text-white/70">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-lg mx-auto px-5 text-center">
          <SectionLabel>Exclusive Access</SectionLabel>
          <h2 className="font-display text-[2rem] font-bold text-primary-900 mb-3">
            Join the Inner Circle
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            New arrivals, exclusive previews, and curated style guides — delivered directly to your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            />
            <button className="px-6 py-3.5 bg-[#001845] text-white text-sm font-semibold rounded-lg hover:bg-[#002b6b] transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-[11px] text-neutral-400">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
}
