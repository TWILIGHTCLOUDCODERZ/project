import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, Loader2, Shirt } from 'lucide-react';
import { searchProducts, type OutfitRecommendation } from '../lib/aiSearch';
import type { Product } from '../data/products';

interface AISearchModalProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'I want a conference meeting outfit with the best blazer suit',
  'Show me a complete brown formal look for men',
  'I need an elegant evening outfit for women',
  'Best office blazer and trousers for work',
];

export default function AISearchModal({ onClose }: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ outfits: OutfitRecommendation[]; individualProducts: Product[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    setHasSearched(true);
    // Simulate AI thinking for UX
    setTimeout(() => {
      const searchResults = searchProducts(searchQuery);
      setResults(searchResults);
      setSearching(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSuggestionClick = (prompt: string) => {
    setQuery(prompt);
    performSearch(prompt);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[200] flex items-start justify-center bg-primary-900/70 backdrop-blur-sm p-4 pt-[10vh]"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-[#001845] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[13px] font-bold tracking-tight text-white leading-none">AI-Powered Search</p>
          </div>
          <p className="text-sm text-white/50 mt-2">
            Describe what you're looking for in natural language — our AI will recommend complete outfits.
          </p>
        </div>

        {/* Search input */}
        <div className="px-6 py-4 border-b border-neutral-100">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I want a conference meeting outfit with the best blazer suit"
                className="w-full pl-11 pr-12 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setResults(null); setHasSearched(false); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Suggested prompts */}
          {!hasSearched && (
            <div className="mt-4">
              <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-2.5">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:bg-accent-50 hover:border-accent-300 hover:text-accent-700 transition-all text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {searching && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-7 h-7 text-accent-500 animate-spin mb-3" />
              <p className="text-sm text-neutral-500">AI is analyzing your request and curating outfits…</p>
            </div>
          )}

          {!searching && results && (results.outfits.length > 0 || results.individualProducts.length > 0) && (
            <div className="p-6 space-y-6">
              {/* Outfit recommendations */}
              {results.outfits.map((outfit) => (
                <div key={outfit.id} className="bg-gradient-to-br from-accent-50/50 to-neutral-50 rounded-xl border border-accent-100 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shrink-0">
                      <Shirt className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent-600">Complete Outfit</span>
                      </div>
                      <h3 className="font-display text-base font-bold text-primary-900 leading-tight">{outfit.title}</h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{outfit.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {outfit.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
                        className="group text-left"
                      >
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                          {product.badge && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded bg-primary-900 text-white">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-primary-900 leading-snug line-clamp-1 group-hover:text-accent-700 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] font-bold text-primary-900 mt-0.5">${product.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Individual products */}
              {results.individualProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-px bg-neutral-300" />
                    <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
                      {results.outfits.length > 0 ? 'More Matches' : 'Recommended Products'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.individualProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => { navigate(`/product/${product.id}`); onClose(); }}
                        className="group text-left"
                      >
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-100 mb-2">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
                          />
                          {product.badge && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase rounded bg-primary-900 text-white">
                              {product.badge}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300" />
                        </div>
                        <p className="text-[11px] font-medium text-primary-900 leading-snug line-clamp-1 group-hover:text-accent-700 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-bold text-primary-900">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!searching && hasSearched && results && results.outfits.length === 0 && results.individualProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Search className="w-8 h-8 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-600 mb-1">No matches found</p>
              <p className="text-xs text-neutral-400">Try rephrasing your search or use one of the suggested prompts above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
