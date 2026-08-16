import { X, ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-primary-800" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-neutral-50 rounded-l-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                  product.badge === 'Premium'
                    ? 'bg-gold-500 text-white'
                    : product.badge === 'New Arrival'
                    ? 'bg-accent-600 text-white'
                    : 'bg-primary-900 text-white'
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-xs font-medium tracking-wider uppercase text-neutral-400 mb-2">
              {product.subcategory.replace('-', ' ')}
            </p>
            <h2 className="font-display text-2xl font-semibold text-primary-900 mb-3">{product.name}</h2>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-xl font-bold text-primary-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-neutral-400 line-through">${product.originalPrice}</span>
                  <span className="text-xs font-semibold text-error-500 bg-error-50 px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-primary-600 leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            <div className="mb-5">
              <p className="text-xs font-medium tracking-wider uppercase text-primary-800 mb-3">
                Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? 'border-accent-600 scale-110' : 'border-neutral-200'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-5">
              <p className="text-xs font-medium tracking-wider uppercase text-primary-800 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'bg-white text-primary-800 border-neutral-200 hover:border-primary-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-medium tracking-wider uppercase text-primary-800 mb-3">Quantity</p>
              <div className="inline-flex items-center border border-neutral-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-primary-600 hover:text-primary-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium text-primary-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-primary-600 hover:text-primary-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-900 text-white text-sm font-semibold rounded-lg hover:bg-primary-800 transition-colors duration-300">
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button className="p-3.5 border border-neutral-200 rounded-lg text-primary-600 hover:text-error-500 hover:border-error-200 transition-colors duration-300">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
