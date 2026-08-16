import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView: _onQuickView }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 mb-3.5">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/12 transition-colors duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase rounded-md ${
                product.badge === 'Premium'
                  ? 'bg-gold-500 text-white'
                  : product.badge === 'New Arrival'
                  ? 'bg-accent-600 text-white'
                  : product.badge === 'Best Seller'
                  ? 'bg-primary-900 text-white'
                  : 'bg-primary-700 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] uppercase rounded-md bg-error-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action buttons — appear on hover */}
        <div className="absolute bottom-3 inset-x-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-primary-900 text-[11px] font-semibold rounded-lg shadow-md hover:bg-neutral-50 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`p-2.5 rounded-lg shadow-md transition-colors ${
              liked ? 'bg-error-500 text-white' : 'bg-white text-neutral-500 hover:text-error-500'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
          {product.subcategory.replace('-', ' ')}
        </p>
        <h3 className="text-[13px] font-medium text-primary-900 leading-snug line-clamp-1 group-hover:text-accent-700 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[13px] font-bold text-primary-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-400 line-through">${product.originalPrice}</span>
          )}
        </div>
        {/* Color dots */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-3 h-3 rounded-full border border-neutral-200 ring-offset-1"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
