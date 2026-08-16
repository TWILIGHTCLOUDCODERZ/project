import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';
import { womenProducts, menProducts, womenCategories, menCategories } from '../data/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../data/products';

interface CategoryPageProps {
  onQuickView: (product: Product) => void;
}

export default function CategoryPage({ onQuickView }: CategoryPageProps) {
  const { gender } = useParams<{ gender: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [sortBy, setSortBy] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);

  const isWomen = gender === 'women';
  const categories = isWomen ? womenCategories : menCategories;
  const allProducts = isWomen ? womenProducts : menProducts;

  const products = useMemo(() => {
    const filtered = activeCategory
      ? allProducts.filter((p) => p.subcategory === activeCategory)
      : allProducts;
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...filtered].sort((_a, b) => (b.badge === 'New Arrival' ? 1 : -1));
      default:
        return filtered;
    }
  }, [allProducts, activeCategory, sortBy]);

  const title = isWomen ? "Women's Collection" : "Men's Collection";
  const subtitle = isWomen
    ? 'Sophisticated professional wear designed for the modern woman.'
    : 'Professional attire designed for the modern gentleman.';

  const handleCategoryClick = (catId: string) => {
    if (activeCategory === catId) {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name;

  return (
    <div className="font-body pt-[71px] lg:pt-[79px]">

      {/* ─── Hero banner ──────────────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center text-center py-16 sm:py-20 lg:py-24 px-5"
        style={{ backgroundColor: '#003B7A' }}
      >
        {/* Decorative rule */}
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

        {/* Bottom rule */}
        <div className="flex items-center gap-3 mt-8">
          <div className="w-16 h-px bg-white/15" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="w-16 h-px bg-white/15" />
        </div>
      </section>

      {/* ─── Category filter pills ─────────────────────────────── */}
      <section className="bg-white border-b border-neutral-200 sticky top-[71px] lg:top-[79px] z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 py-3.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSearchParams({})}
              className={`shrink-0 px-5 py-2 text-[12px] font-semibold tracking-wide rounded-full transition-all duration-200 ${
                !activeCategory
                  ? 'bg-[#003B7A] text-white'
                  : 'bg-neutral-100 text-primary-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`shrink-0 px-5 py-2 text-[12px] font-semibold tracking-wide rounded-full transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-[#003B7A] text-white'
                    : 'bg-neutral-100 text-primary-600 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Product grid ─────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200">
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-primary-900">{products.length}</span>{' '}
              {products.length === 1 ? 'product' : 'products'}
              {activeCategoryName && (
                <span className="text-neutral-400"> — {activeCategoryName}</span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="sm:hidden flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border border-neutral-200 rounded-lg text-primary-700 hover:bg-white transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-[12px] font-medium border border-neutral-200 rounded-lg bg-white text-primary-700 focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 transition-colors ${
                    gridCols === 3 ? 'bg-primary-900 text-white' : 'bg-white text-neutral-400 hover:text-primary-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 transition-colors ${
                    gridCols === 4 ? 'bg-primary-900 text-white' : 'bg-white text-neutral-400 hover:text-primary-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile category filter drawer */}
          {filterOpen && (
            <div className="sm:hidden mb-6 p-4 bg-white rounded-xl border border-neutral-200">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 text-[12px] font-medium rounded-full transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#003B7A] text-white'
                        : 'bg-neutral-100 text-primary-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          {products.length > 0 ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                gridCols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-base text-neutral-400 mb-4">No products in this category</p>
              <button
                onClick={() => setSearchParams({})}
                className="text-sm font-semibold text-[#003B7A] hover:underline"
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
