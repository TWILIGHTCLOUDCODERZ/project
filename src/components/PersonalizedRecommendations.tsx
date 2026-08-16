import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import type { Product } from '../data/products';

interface Recommendation {
  product: Product;
  message: string;
}

interface PersonalizedRecommendationsProps {
  userName: string;
  previousPurchaseName: string;
  recommendations: Recommendation[];
}

export default function PersonalizedRecommendations({
  userName,
  previousPurchaseName,
  recommendations,
}: PersonalizedRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50/40 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600 mb-0.5">
                AI-Powered Recommendations
              </span>
              <h2 className="font-display text-2xl lg:text-[1.75rem] font-bold text-primary-900 leading-tight">
                Hi {userName}! Curated just for you
              </h2>
            </div>
          </div>
        </div>

        {/* Previous purchase context */}
        <div className="flex items-start gap-3 mb-8 p-4 bg-white rounded-xl border border-neutral-100 shadow-sm max-w-2xl">
          <div className="w-9 h-9 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-gold-600" />
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Based on your previous purchase of{' '}
            <span className="font-semibold text-primary-900">{previousPurchaseName}</span>, we
            think you might like these complementary pieces — each with an{' '}
            <span className="font-semibold text-accent-700">additional 3% discount</span>.
          </p>
        </div>

        {/* Recommendation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {recommendations.map(({ product, message }) => {
            const discountedPrice = Math.round(product.price * 0.97);
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:border-accent-200 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* 3% off badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent-600 text-white text-[10px] font-bold tracking-[0.08em] uppercase rounded-md shadow-md">
                    3% Off
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mb-1">
                    {product.subcategory.replace('-', ' ')}
                  </p>
                  <h3 className="text-sm font-semibold text-primary-900 leading-snug mb-2 group-hover:text-accent-700 transition-colors">
                    {product.name}
                  </h3>

                  {/* AI message */}
                  <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                    {message}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1 border-t border-neutral-100">
                    <span className="text-base font-bold text-accent-700">${discountedPrice}</span>
                    <span className="text-xs text-neutral-400 line-through">${product.price}</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary-900 group-hover:text-accent-700 transition-colors">
                      View
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
