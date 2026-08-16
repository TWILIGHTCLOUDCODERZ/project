import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { X, Heart, ShoppingBag, Minus, Plus, Star, Share2, Shirt } from 'lucide-react';
import { womenProducts, menProducts } from '../data/products';
import VirtualTryOnModal from '../components/VirtualTryOnModal';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const allProducts = [...womenProducts, ...menProducts];
  const product = allProducts.find((p) => p.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user } = useAuth();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[79px]">
        <div className="text-center">
          <p className="text-lg text-neutral-400 mb-4">Product not found</p>
          <Link to="/" className="text-sm font-medium text-accent-600 hover:text-accent-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isWomen = product.category === 'women';
  const relatedPool = isWomen ? womenProducts : menProducts;
  const relatedProducts = relatedPool
    .filter((p) => p.id !== product.id && p.subcategory === product.subcategory)
    .slice(0, 3);

  const galleryImages = product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-neutral-100 pt-[71px] lg:pt-[79px] pb-16">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left — image gallery */}
            <div className="relative bg-neutral-50">
              {/* Main image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={galleryImages[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                />
                {product.badge && (
                  <span
                    className={`absolute top-5 left-5 px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full ${
                      product.badge === 'Premium'
                        ? 'bg-gold-500 text-white'
                        : product.badge === 'New Arrival'
                        ? 'bg-accent-600 text-white'
                        : product.badge === 'Best Seller'
                        ? 'bg-primary-900 text-white'
                        : 'bg-success-600 text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Thumbnails — only when multiple images */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 p-4">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        activeImage === idx
                          ? 'border-accent-600 shadow-md shadow-accent-200'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — details */}
            <div className="relative p-8 sm:p-10 flex flex-col">
              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                aria-label="Go back"
              >
                <X className="w-4 h-4 text-primary-700" />
              </button>

              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-2">
                {product.subcategory.replace('-', ' ')}
              </p>
              <h1 className="font-display text-3xl font-bold text-primary-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-gold-400 fill-gold-400' : 'text-neutral-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-neutral-400">(24 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-primary-900">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-neutral-400 line-through">${product.originalPrice}</span>
                    <span className="text-xs font-semibold text-error-500 bg-error-50 px-2.5 py-1 rounded-full">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed mb-6">{product.description}</p>

              {/* Color */}
              <div className="mb-5">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-3">
                  Color:&nbsp;<span className="font-normal text-neutral-500 normal-case">{selectedColor}</span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.name
                          ? 'border-accent-600 ring-2 ring-accent-200 scale-110'
                          : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary-800">Size</p>
                  <button className="text-xs text-accent-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-primary-900 text-white border-primary-900 shadow-md shadow-primary-900/20'
                          : 'bg-white text-primary-800 border-neutral-200 hover:border-primary-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-7">
                <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-3">Quantity</p>
                <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-primary-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-semibold text-primary-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-primary-600 hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto space-y-3">
                {product.subcategory === 'blazers' && (
                  <button
                    onClick={() => user ? setShowTryOn(true) : setShowAuth(true)}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#003B7A] text-white text-sm font-bold rounded-xl hover:bg-[#002b5c] transition-colors shadow-lg"
                  >
                    <Shirt className="w-5 h-5" />
                    Try On Blazer
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-accent-700 text-white text-sm font-bold rounded-xl hover:bg-accent-800 transition-colors shadow-lg shadow-accent-700/25">
                    <ShoppingBag className="w-5 h-5" />
                    Add to Bag
                  </button>
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-14 h-14 flex items-center justify-center border rounded-xl transition-all ${
                      liked ? 'border-error-200 bg-error-50 text-error-500' : 'border-neutral-200 text-neutral-400 hover:border-error-200 hover:text-error-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-14 h-14 flex items-center justify-center border border-neutral-200 rounded-xl text-neutral-400 hover:border-neutral-400 hover:text-primary-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-primary-900 mb-7">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full bg-primary-900 text-white">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-medium tracking-wider uppercase text-neutral-400 mb-1">
                      {p.subcategory.replace('-', ' ')}
                    </p>
                    <h3 className="text-sm font-semibold text-primary-900">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-primary-900">${p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">${p.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Virtual Try-On Modal */}
      {showTryOn && product && user && (
        <VirtualTryOnModal product={product} onClose={() => setShowTryOn(false)} />
      )}

      {/* Auth Modal (prompted by Try-On) */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} initialMode="login" />
      )}
    </div>
  );
}
