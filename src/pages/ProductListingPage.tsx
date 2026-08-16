import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Grid3X3, LayoutGrid } from 'lucide-react';
import { womenProducts, menProducts, womenCategories, menCategories } from '../data/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../data/products';

interface ProductListingPageProps {
  onQuickView: (product: Product) => void;
}

export default function ProductListingPage({ onQuickView }: ProductListingPageProps) {
  const { gender, category } = useParams<{ gender: string; category: string }>();
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [sortBy, setSortBy] = useState('featured');

  const isWomen = gender === 'women';
  const categories = isWomen ? womenCategories : menCategories;
  const allProducts = isWomen ? womenProducts : menProducts;

  const currentCategory = categories.find((c) => c.id === category);

  const products = useMemo(() => {
    const filtered = category
      ? allProducts.filter((p) => p.subcategory === category)
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
  }, [allProducts, category, sortBy]);

  const genderTitle = isWomen ? 'Women' : 'Men';

  return (
    <div className="pt-[71px] lg:pt-[79px]">
      {/* Compact header with breadcrumb */}
      <section className="bg-[#003B7A] py-8 sm:py-10 px-5">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/${gender}`} className="hover:text-white/80 transition-colors">{genderTitle}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{currentCategory?.name || 'All'}</span>
          </nav>

          {/* Back link */}
          <Link
            to={`/${gender}`}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {genderTitle}
          </Link>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
            {currentCategory?.name || 'All Products'}
          </h1>
          {currentCategory && (
            <p className="text-sm text-white/60 mt-1">{currentCategory.description}</p>
          )}
        </div>
      </section>

      {/* Products grid */}
      <section className="py-10 lg:py-14 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200">
            <p className="text-sm text-neutral-500">
              <span className="font-semibold text-primary-900">{products.length}</span>{' '}
              {products.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex items-center gap-3">
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
              <Link
                to={`/${gender}`}
                className="text-sm font-semibold text-[#003B7A] hover:underline"
              >
                Browse all categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
