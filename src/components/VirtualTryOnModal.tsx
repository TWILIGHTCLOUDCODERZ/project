import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  X, Upload, Camera, Loader2, Download, RefreshCw,
  AlertCircle, Plus, Minus, ShoppingBag, CheckCircle2, Sparkles,
  ZoomIn, FlipHorizontal, Maximize2,
} from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface VirtualTryOnModalProps {
  product: Product;
  onClose: () => void;
}

type Step = 'select' | 'preview' | 'generating' | 'result' | 'error';

interface Suggestion {
  id: string;
  name: string;
  category: string;
  image: string | null;
  promptAddition: string;
}

// Suggestions keyed by product id prefix for precise matching,
// falling back to category-level defaults
// ── Shared accessories ─────────────────────────────────────────────────────
const BROWN_BELT: Suggestion = {
  id: 'brown-belt',
  name: 'Brown Belt',
  category: 'Accessory',
  image: '/Men/belt/Brown_Belt_men.jfif',
  promptAddition: 'a cognac brown leather belt with a polished gold buckle',
};

const WHITE_VEST_WOMEN: Suggestion = {
  id: 'white-vest',
  name: 'White Formal Vest',
  category: 'Layering',
  image: '/Women/White_Vest_Women.png',
  promptAddition: 'an elegant white single-breasted vest with satin lapels worn as a layering piece',
};

const BROWN_BAG: Suggestion = {
  id: 'brown-bag',
  name: 'Brown Structured Bag',
  category: 'Accessory',
  image: '/Women/women_hand_bag.png',
  promptAddition: 'a structured brown leather handbag with gold hardware accents',
};

const BROWN_SANDALS: Suggestion = {
  id: 'brown-sandals',
  name: 'Brown Sandals',
  category: 'Footwear',
  image: '/Women/WOMEN_SANDALS_BLAZER.png',
  promptAddition: 'elegant brown heeled sandals with ankle strap',
};

// ── Men suggestions ────────────────────────────────────────────────────────
const BLUE_BLAZER_SUGGESTIONS: Suggestion[] = [
  {
    id: 'blue-pants',
    name: 'Blue Formal Pants',
    category: 'Trousers',
    image: '/Men/blue_blazer/Blazer_Blue_Men_Pant.png',
    promptAddition: 'navy blue flat-front formal trousers with a precision-cut straight leg',
  },
  {
    id: 'brown-shoes',
    name: 'Brown Leather Shoes',
    category: 'Footwear',
    image: '/Men/shoe_brown/Brown_Shoe_Men_Front.png',
    promptAddition: 'handcrafted cognac brown cap-toe Oxford leather shoes',
  },
  BROWN_BELT,
  {
    id: 'blue-vest',
    name: 'Blue Vest',
    category: 'Layering',
    image: '/Men/blue_blazer/Blazer_Blue_Vest.png',
    promptAddition: 'a matching navy blue formal vest with V-neck and gold buttons layered under the blazer',
  },
];

const BROWN_BLAZER_SUGGESTIONS: Suggestion[] = [
  {
    id: 'brown-pants',
    name: 'Brown Formal Pants',
    category: 'Trousers',
    image: '/Men/brown_blazer/Brown_Blazer_pant_Men.png',
    promptAddition: 'cognac brown flat-front formal trousers in premium wool blend',
  },
  {
    id: 'brown-shoes',
    name: 'Brown Leather Shoes',
    category: 'Footwear',
    image: '/Men/shoe_brown/Brown_Shoe_Men_Front.png',
    promptAddition: 'handcrafted cognac brown cap-toe Oxford leather shoes',
  },
  BROWN_BELT,
  {
    id: 'brown-vest',
    name: 'Formal Vest',
    category: 'Layering',
    image: '/Men/brown_blazer/Brown_vest_men.png',
    promptAddition: 'a brown six-button formal vest with a V-neck pointed hem layered under the blazer',
  },
];

// ── Women suggestions (color-aware) ───────────────────────────────────────
// Black blazer  → Black Pants + Brown Sandals + Brown Bag + White Vest
// Brown blazer  → Brown Pants + Brown Sandals + Brown Bag + White Vest
// White/Ivory   → Black Pants + Brown Pants  + Brown Bag + White Vest

const BLACK_PANT_WOMEN: Suggestion = {
  id: 'black-pants',
  name: 'Black Formal Pants',
  category: 'Trousers',
  image: '/Women/women_black_formal_pant.png',
  promptAddition: 'sleek black high-waisted formal straight-leg trousers',
};

const BROWN_PANT_WOMEN: Suggestion = {
  id: 'brown-pants',
  name: 'Brown Formal Pants',
  category: 'Trousers',
  image: '/Women/Women_Brown_Formal_Pant.png',
  promptAddition: 'caramel brown formal tapered trousers in premium wool blend',
};

function getWomenSuggestions(product: Product): Suggestion[] {
  const colorNames = product.colors.map((c) => c.name.toLowerCase());
  const nameLower = product.name.toLowerCase();

  const isBlack = colorNames.some((c) => ['black', 'charcoal', 'noir'].includes(c)) ||
    nameLower.includes('black') || nameLower.includes('noir');
  const isBrown = colorNames.some((c) =>
    ['cognac', 'chocolate', 'caramel', 'espresso', 'walnut', 'brown'].includes(c)) ||
    nameLower.includes('brown');

  if (isBlack) {
    return [BLACK_PANT_WOMEN, BROWN_SANDALS, BROWN_BAG, WHITE_VEST_WOMEN];
  }
  if (isBrown) {
    return [BROWN_PANT_WOMEN, BROWN_SANDALS, BROWN_BAG, WHITE_VEST_WOMEN];
  }
  // White / Ivory / Sand / neutral → show both pants
  return [BLACK_PANT_WOMEN, BROWN_PANT_WOMEN, BROWN_BAG, WHITE_VEST_WOMEN];
}

function getSuggestions(product: Product): Suggestion[] {
  if (product.category === 'women') return getWomenSuggestions(product);
  // Distinguish blue vs brown men's blazers by color or id
  const isBlue = product.colors.some((c) =>
    ['navy', 'blue', 'steel blue'].includes(c.name.toLowerCase())
  );
  return isBlue ? BLUE_BLAZER_SUGGESTIONS : BROWN_BLAZER_SUGGESTIONS;
}

export default function VirtualTryOnModal({ product, onClose }: VirtualTryOnModalProps) {
  const [step, setStep] = useState<Step>('select');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [cartAdded, setCartAdded] = useState(false);
  const [isFullSizeOpen, setIsFullSizeOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { addItems } = useCart();

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

  const suggestions = getSuggestions(product);

  // ─── Photo input ───────────────────────────────────────────────────────────

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserPhoto(ev.target?.result as string);
      setStep('preview');
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setCameraReady(false);
    } catch {
      setErrorMessage('Unable to access camera. Please check permissions and try again.');
      setStep('error');
    }
  };

  // Attach stream to video element once camera overlay is mounted
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().then(() => setCameraReady(true)).catch(() => setCameraReady(true));
    }
  }, [isCameraOpen]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    setUserPhoto(canvas.toDataURL('image/png'));
    setStep('preview');
    closeCamera();
  }, [mirrored]);

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCameraOpen(false);
    setCameraReady(false);
  };

  // ─── Image helpers ─────────────────────────────────────────────────────────

  /** Resize any image source to max 1024px on longest edge and return as base64 string. */
  const toBase64 = (source: string): Promise<{ data: string; mimeType: string }> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const MAX = 1024;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          const s = MAX / Math.max(w, h);
          w = Math.round(w * s);
          h = Math.round(h * s);
        }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d')!.drawImage(img, 0, 0, w, h);
        c.toBlob((b) => {
          if (!b) { reject(new Error('Image encode failed')); return; }
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve({ data: result.split(',')[1], mimeType: 'image/png' });
          };
          reader.readAsDataURL(b);
        }, 'image/png');
      };
      img.onerror = () => reject(new Error(`Failed to load: ${source.slice(0, 80)}`));
      img.src = source;
    });

  const fetchAsBase64 = async (relativePath: string): Promise<{ data: string; mimeType: string }> => {
    const url = new URL(relativePath, window.location.origin).href;
    return toBase64(url);
  };

  // ─── Generation ────────────────────────────────────────────────────────────

  const runGeneration = async (activeSuggestionIds: Set<string>) => {
    if (!userPhoto || !GEMINI_API_KEY) {
      setErrorMessage('API configuration is missing. Check environment variables.');
      setStep('error');
      return;
    }

    setStep('generating');
    setErrorMessage(null);
    setCartAdded(false);

    try {
      const activeSuggestionList = suggestions.filter((s) => activeSuggestionIds.has(s.id));
      const suggestionImgs = activeSuggestionList.filter((s) => s.image !== null);

      const [userImg, blazerImg, ...suggImgs] = await Promise.all([
        toBase64(userPhoto),
        fetchAsBase64(product.image),
        ...suggestionImgs.map((s) => fetchAsBase64(s.image!)),
      ]);

      const outfitItems = [
        `"${product.name}" — a ${product.colors[0]?.name ?? 'professional'} blazer`,
        ...activeSuggestionList.map((s) => s.promptAddition),
      ];
      const outfitDesc =
        outfitItems.length === 1
          ? outfitItems[0]
          : outfitItems.slice(0, -1).join(', ') + ', and ' + outfitItems.at(-1);

      const prompt =
        `Fashion retail catalog image. ` +
        `A model wearing the following clothing: ${outfitDesc}. ` +
        `Garments fit naturally with realistic drape and correct proportions. ` +
        `Clean studio background, professional lighting, full-body shot. Photorealistic.`;

      const inputContent = [
        { text: prompt, type: 'text' as const },
        { data: userImg.data, type: 'image' as const, mime_type: 'image/png' },
        { data: blazerImg.data, type: 'image' as const, mime_type: 'image/png' },
        ...suggImgs.map((s) => ({ data: s.data, type: 'image' as const, mime_type: 'image/png' })),
      ];

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const interaction = await ai.interactions.create({
        model: 'models/gemini-3.1-flash-lite-image',
        input: inputContent as any,
        generation_config: {
          temperature: 1,
          max_output_tokens: 65536,
          top_p: 0.95,
          thinking_level: 'minimal',
        } as any,
        response_modalities: ['image', 'text'],
      });

      if (interaction.steps) {
        for (const step of interaction.steps) {
          if (step.type === 'model_output' && step.content) {
            for (const part of step.content as any[]) {
              if (part.type === 'image' && part.data) {
                setGeneratedImage(`data:image/png;base64,${part.data}`);
                setStep('result');
                return;
              }
            }
          }
        }
      }

      throw new Error('No image returned. Please try again.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate try-on image.');
      setStep('error');
    }
  };

  const handleInitialGenerate = () => runGeneration(new Set());

  const handleSuggestedTryOn = () => runGeneration(selectedSuggestions);

  // ─── Suggestion toggle ─────────────────────────────────────────────────────

  const toggleSuggestion = (id: string) => {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ─── Add to Cart ───────────────────────────────────────────────────────────

  const handleAddToCart = () => {
    const cartItems = [
      { id: product.id, name: product.name, image: product.image, price: product.price },
      ...suggestions
        .filter((s) => selectedSuggestions.has(s.id))
        .map((s) => ({ id: `sugg-${s.id}`, name: s.name, image: s.image })),
    ];
    addItems(cartItems);
    setCartAdded(true);
    // Reset success indicator after 3s
    setTimeout(() => setCartAdded(false), 3000);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `virtual-tryon-${product.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!isFullSizeOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullSizeOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullSizeOpen]);

  const reset = () => {
    setIsFullSizeOpen(false);
    setUserPhoto(null);
    setGeneratedImage(null);
    setErrorMessage(null);
    setSelectedSuggestions(new Set());
    setCartAdded(false);
    closeCamera();
    setStep('select');
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100">
          <div>
            <h2 className="font-display text-xl font-bold text-primary-900">Virtual Try-On</h2>
            <p className="text-sm text-neutral-500">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5 text-primary-700" />
          </button>
        </div>

        <div className="p-6 space-y-0">

          {/* ── Select ── */}
          {step === 'select' && (
            <div className="space-y-6">
              <p className="text-sm text-neutral-600 text-center">
                Upload a photo or take one with your camera to see how this blazer looks on you.
              </p>
              <div className="flex justify-center">
                <div className="w-32 h-40 rounded-xl overflow-hidden bg-neutral-100 shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-neutral-300 rounded-xl hover:border-accent-500 hover:bg-accent-50/50 transition-all group"
                >
                  <Upload className="w-10 h-10 text-neutral-400 group-hover:text-accent-600 transition-colors" />
                  <div className="text-center">
                    <p className="font-semibold text-primary-900">Upload Photo</p>
                    <p className="text-xs text-neutral-500 mt-1">From your device gallery</p>
                  </div>
                </button>
                <button
                  onClick={openCamera}
                  className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-neutral-300 rounded-xl hover:border-accent-500 hover:bg-accent-50/50 transition-all group"
                >
                  <Camera className="w-10 h-10 text-neutral-400 group-hover:text-accent-600 transition-colors" />
                  <div className="text-center">
                    <p className="font-semibold text-primary-900">Take Photo</p>
                    <p className="text-xs text-neutral-500 mt-1">Use device camera</p>
                  </div>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          )}

          {/* ── Preview ── */}
          {step === 'preview' && userPhoto && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">Your Photo</p>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 shadow-sm">
                    <img src={userPhoto} alt="Your photo" className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold tracking-wider uppercase text-neutral-400 mb-2">Selected Blazer</p>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={reset} className="px-6 py-3 text-sm font-semibold text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors">
                  Choose Different Photo
                </button>
                <button onClick={handleInitialGenerate} className="px-6 py-3 text-sm font-bold text-white bg-[#003B7A] rounded-xl hover:bg-[#002b5c] transition-colors shadow-lg">
                  Generate Virtual Try-On
                </button>
              </div>
            </div>
          )}

          {/* ── Generating ── */}
          {step === 'generating' && (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-accent-600 animate-spin mx-auto" />
              <div>
                <p className="font-semibold text-primary-900">Generating your virtual try-on…</p>
                <p className="text-sm text-neutral-500 mt-1">This may take up to 30 seconds</p>
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {step === 'result' && generatedImage && (
            <div className="space-y-5">
              {/* Label */}
              <div className="text-center">
                <p className="text-xs font-semibold tracking-wider uppercase text-success-600 mb-0.5">Try-On Complete</p>
                <p className="text-sm text-neutral-500">
                  {product.name}
                  {selectedSuggestions.size > 0 && ` + ${selectedSuggestions.size} item${selectedSuggestions.size > 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Generated image */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => setIsFullSizeOpen(true)}
                    className="group block w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 shadow-xl ring-1 ring-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003B7A]"
                    aria-label="View try-on image full size"
                  >
                    <img src={generatedImage} alt="Virtual try-on result — click to view full size" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-primary-900/80 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Full size
                    </span>
                  </button>
                  <div className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-white rounded-full shadow-lg text-xs font-semibold text-primary-900 border border-neutral-100 pointer-events-none">
                    {product.name}
                  </div>
                </div>
              </div>

              {/* ── Suggestion cards ── */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary-900">Complete the Look</span>
                  <span className="text-xs text-neutral-400 ml-auto">Select items, then tap Try-On</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {suggestions.map((s) => {
                    const active = selectedSuggestions.has(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                          active
                            ? 'border-[#003B7A] shadow-md shadow-blue-100'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                        onClick={() => toggleSuggestion(s.id)}
                      >
                        {/* +/- badge */}
                        <div
                          className={`absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                            active ? 'bg-[#003B7A] text-white' : 'bg-white text-neutral-600 border border-neutral-300'
                          }`}
                        >
                          {active ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </div>

                        {/* Image */}
                        <div className="aspect-square bg-neutral-50 overflow-hidden">
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={s.name}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                              <span className="text-2xl">👔</span>
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <div className={`px-1.5 py-1.5 transition-colors ${active ? 'bg-blue-50' : 'bg-white'}`}>
                          <p className="text-[10px] font-semibold text-primary-900 leading-tight line-clamp-2">
                            {s.name}
                          </p>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-wide mt-0.5">{s.category}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Action buttons ── */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {/* Suggested Try-On Now */}
                <button
                  onClick={handleSuggestedTryOn}
                  disabled={selectedSuggestions.size === 0}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all shadow-sm ${
                    selectedSuggestions.size > 0
                      ? 'bg-[#003B7A] text-white hover:bg-[#002b5c] shadow-blue-200'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Suggested Try-On Now
                  {selectedSuggestions.size > 0 && (
                    <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {selectedSuggestions.size}
                    </span>
                  )}
                </button>

                {/* Download */}
                <button
                  onClick={downloadImage}
                  className="inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
                    cartAdded
                      ? 'bg-success-600 text-white'
                      : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200'
                  }`}
                >
                  {cartAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Cart added summary */}
              {cartAdded && (
                <div className="text-center text-xs text-success-700 bg-success-50 rounded-lg py-2 px-3">
                  <span className="font-semibold">{product.name}</span>
                  {selectedSuggestions.size > 0 && (
                    <> + {selectedSuggestions.size} suggestion{selectedSuggestions.size > 1 ? 's' : ''}</>
                  )} added to your bag.
                </div>
              )}

              {/* Start over */}
              <div className="flex justify-center pt-1">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Another Photo
                </button>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {step === 'error' && (
            <div className="py-10 text-center space-y-5">
              <AlertCircle className="w-12 h-12 text-error-500 mx-auto" />
              <div>
                <p className="font-semibold text-primary-900">Generation Failed</p>
                <p className="text-sm text-neutral-600 mt-1 max-w-sm mx-auto leading-relaxed break-words">
                  {errorMessage}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 text-left max-w-xs mx-auto">
                <p className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">Tips for better results</p>
                <ul className="text-xs text-neutral-600 space-y-1 list-disc list-inside">
                  <li>Use a well-lit, clear photo</li>
                  <li>Plain or simple background works best</li>
                  <li>Stand facing the camera</li>
                  <li>Avoid group photos</li>
                </ul>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={reset} className="px-6 py-3 text-sm font-semibold text-white bg-error-500 rounded-xl hover:bg-error-600 transition-colors">
                  Try Again
                </button>
                {userPhoto && (
                  <button
                    onClick={() => { setStep('preview'); setErrorMessage(null); }}
                    className="px-6 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    Use Same Photo
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Full-screen camera overlay ── */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 to-transparent absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Take Your Photo</p>
                <p className="text-white/50 text-xs mt-0.5">Position your face clearly in the frame</p>
              </div>
            </div>
            <button
              onClick={closeCamera}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video feed — full screen */}
          <div className="relative flex-1 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${mirrored ? 'scale-x-[-1]' : ''}`}
            />

            {/* Loading indicator while stream starts */}
            {!cameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                <Loader2 className="w-10 h-10 text-white/60 animate-spin" />
                <p className="text-white/50 text-sm">Starting camera…</p>
              </div>
            )}

            {/* Face guide overlay */}
            {cameraReady && (
              <>
                {/* Oval face guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="border-2 border-white/40 rounded-[50%]"
                    style={{ width: 'min(38vw, 220px)', height: 'min(52vw, 300px)' }}
                  />
                </div>
                {/* Corner rule lines for full-body framing hint */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <p className="text-white/60 text-xs font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Face visible · Stand back for full-body
                  </p>
                </div>
              </>
            )}

            {/* Blazer thumbnail overlay — bottom left */}
            <div className="absolute bottom-28 left-5 flex items-center gap-2.5 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 pointer-events-none">
              <div className="w-10 h-12 rounded-lg overflow-hidden bg-white/10">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Trying on</p>
                <p className="text-xs text-white font-semibold leading-tight max-w-[120px] line-clamp-1">{product.name}</p>
              </div>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="bg-gradient-to-t from-black to-transparent pt-8 pb-8 px-6 flex items-center justify-between">

            {/* Mirror toggle */}
            <button
              onClick={() => setMirrored((m) => !m)}
              className="flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <FlipHorizontal className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">Flip</span>
            </button>

            {/* Shutter button */}
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="relative w-20 h-20 flex items-center justify-center group"
            >
              <span className="absolute inset-0 rounded-full border-4 border-white/50 group-hover:border-white transition-colors" />
              <span className={`w-14 h-14 rounded-full transition-all duration-150 ${cameraReady ? 'bg-white group-active:scale-90' : 'bg-white/30'}`} />
            </button>

            {/* Zoom hint / spacer */}
            <button
              className="flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors"
              onClick={() => {}}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ZoomIn className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium">Frame</span>
            </button>
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
      {isFullSizeOpen && generatedImage && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-primary-900/90 p-4 sm:p-8 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Full-size virtual try-on image"
          onClick={() => setIsFullSizeOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullSizeOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close full-size image"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={generatedImage}
            alt="Virtual try-on result full size"
            className="max-h-[calc(100vh-2rem)] max-w-full rounded-xl object-contain shadow-2xl sm:max-h-[calc(100vh-4rem)]"
            onClick={(event: React.MouseEvent<HTMLImageElement>) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
