import { useParams, Link } from 'react-router-dom';
import { womenCategories, menCategories } from '../data/products';

export default function CategoryLandingPage() {
  const { gender } = useParams<{ gender: string }>();
  const isWomen = gender === 'women';
  const categories = isWomen ? womenCategories : menCategories;

  const title = isWomen ? "Women's Collection" : "Men's Collection";
  const subtitle = isWomen
    ? 'Sophisticated professional wear designed for the modern woman.'
    : 'Professional attire designed for the modern gentleman.';

  return (
    <div className="pt-[71px] lg:pt-[79px]">
      {/* Hero banner */}
      <section
        className="flex flex-col items-center justify-center text-center py-16 sm:py-20 lg:py-24 px-5"
        style={{ backgroundColor: '#003B7A' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-px bg-gold-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-400/80" />
          <div className="w-10 h-px bg-gold-400/60" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-white/60 font-light max-w-md leading-relaxed">
          {subtitle}
        </p>

        <div className="flex items-center gap-3 mt-8">
          <div className="w-16 h-px bg-white/15" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="w-16 h-px bg-white/15" />
        </div>
      </section>

      {/* Category cards */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-center text-sm text-neutral-500 mb-10">
            Select a category to explore our collection
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/${gender}/${category.id}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-400 mb-2">
                    {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:text-gold-400 transition-colors">
                    View Collection
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
