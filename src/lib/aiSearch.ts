import { womenProducts, menProducts, type Product } from '../data/products';

const allProducts: Product[] = [...womenProducts, ...menProducts];

export interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  products: Product[];
}

interface Intent {
  occasion: string | null;
  gender: 'men' | 'women' | null;
  category: string | null;
  color: string | null;
  wantsCompleteOutfit: boolean;
  wantsBest: boolean;
  keywords: string[];
}

const OCCASION_MAP: Record<string, string[]> = {
  conference: ['conference', 'meeting', 'boardroom', 'presentation', 'summit', 'keynote'],
  office: ['office', 'work', 'business', 'professional', 'corporate'],
  formal: ['formal', 'gala', 'black-tie', 'evening', 'event', 'ceremony'],
  party: ['party', 'celebration', 'cocktail', 'social', 'gathering'],
  casual: ['casual', 'weekend', 'everyday', 'relaxed', 'smart-casual'],
  interview: ['interview', 'job', 'hiring'],
};

const CATEGORY_MAP: Record<string, string[]> = {
  blazers: ['blazer', 'suit', 'jacket', 'coat'],
  'formal-pants': ['pant', 'trouser', 'pants', 'trousers', 'bottoms'],
  'formal-trousers': ['pant', 'trouser', 'pants', 'trousers', 'bottoms'],
  handbags: ['handbag', 'bag', 'purse', 'accessory'],
  'business-wear': ['shoe', 'shoes', 'oxford', 'footwear', 'business-wear'],
};

const COLOR_MAP: Record<string, string[]> = {
  navy: ['navy', 'blue'],
  brown: ['brown', 'cognac', 'chocolate', 'walnut', 'espresso', 'caramel'],
  black: ['black', 'noir', 'midnight'],
  white: ['white', 'ivory', 'champagne', 'off-white'],
  charcoal: ['charcoal', 'grey', 'gray', 'steel'],
};

const OUTFIT_TEMPLATES: Record<string, { title: string; description: string; productIds: string[] }> = {
  'men-conference': {
    title: 'Conference-Ready Power Suit',
    description: 'A complete conference outfit featuring a navy blazer, matching trousers, a coordinating vest, and premium Oxford shoes.',
    productIds: ['m-blazer-1', 'm-blazer-2', 'm-blazer-3', 'm-shoe-1'],
  },
  'men-brown-conference': {
    title: 'Executive Brown Ensemble',
    description: 'A commanding brown blazer paired with matching trousers, a formal vest, and handcrafted Oxford shoes.',
    productIds: ['m-blazer-4', 'm-trouser-1', 'm-vest-1', 'm-shoe-1'],
  },
  'women-office': {
    title: 'Office-Ready Blazer Look',
    description: 'A polished blazer coat paired with formal trousers and a structured handbag for a complete office ensemble.',
    productIds: ['w-blazer-2', 'w-pant-2', 'w-handbag-1'],
  },
  'women-conference': {
    title: 'Conference Blazer Set',
    description: 'A matching blazer and sandals set, complemented by a premium handbag for a complete conference look.',
    productIds: ['w-blazer-3', 'w-handbag-1'],
  },
  'women-formal': {
    title: 'Formal Evening Ensemble',
    description: 'An executive noir blazer with midnight trousers and a structured handbag for a sophisticated formal look.',
    productIds: ['w-blazer-1', 'w-pant-1', 'w-handbag-1'],
  },
};

function parseIntent(query: string): Intent {
  const lower = query.toLowerCase();

  let occasion: string | null = null;
  for (const [key, synonyms] of Object.entries(OCCASION_MAP)) {
    if (synonyms.some((s) => lower.includes(s))) {
      occasion = key;
      break;
    }
  }

  let gender: 'men' | 'women' | null = null;
  if (/\b(men|man|guy|male|gentleman|him|his)\b/.test(lower)) gender = 'men';
  if (/\b(women|woman|girl|female|lady|her|she)\b/.test(lower)) gender = 'women';

  let category: string | null = null;
  for (const [key, synonyms] of Object.entries(CATEGORY_MAP)) {
    if (synonyms.some((s) => lower.includes(s))) {
      category = key;
      break;
    }
  }

  let color: string | null = null;
  for (const [key, synonyms] of Object.entries(COLOR_MAP)) {
    if (synonyms.some((s) => lower.includes(s))) {
      color = key;
      break;
    }
  }

  const wantsCompleteOutfit = /\b(outfit|look|set|ensemble|complete|full|head.to.toe|whole|coord|match)\b/.test(lower);
  const wantsBest = /\b(best|top|premium|finest|ideal|perfect|ultimate)\b/.test(lower);

  const keywords = lower
    .split(/[\s,.!?]+/)
    .filter((w) => w.length > 2 && !['the', 'and', 'for', 'with', 'want', 'need', 'looking', 'show', 'find', 'get', 'have', 'would', 'like', 'please', 'recommend', 'suggest'].includes(w));

  return { occasion, gender, category, color, wantsCompleteOutfit, wantsBest, keywords };
}

function scoreProduct(product: Product, intent: Intent): number {
  let score = 0;
  const searchable = `${product.name} ${product.description} ${product.subcategory} ${product.category} ${product.colors.map((c) => c.name).join(' ')}`.toLowerCase();

  if (intent.occasion) {
    if (intent.occasion === 'conference' || intent.occasion === 'office' || intent.occasion === 'interview') {
      if (/boardroom|meeting|professional|office|business/.test(product.description.toLowerCase())) score += 3;
      if (product.subcategory === 'blazers') score += 2;
      if (product.subcategory === 'business-wear') score += 2;
    }
    if (intent.occasion === 'formal' || intent.occasion === 'party') {
      if (/evening|formal|gala|sophisticat|elegan/.test(product.description.toLowerCase())) score += 3;
    }
  }

  if (intent.gender && product.category === intent.gender) score += 4;

  if (intent.category && product.subcategory === intent.category) score += 5;

  if (intent.color) {
    const colorSynonyms = COLOR_MAP[intent.color] || [];
    if (product.colors.some((c) => colorSynonyms.some((s) => c.name.toLowerCase().includes(s)))) score += 4;
    if (colorSynonyms.some((s) => searchable.includes(s))) score += 2;
  }

  if (intent.wantsBest && product.badge === 'Best Seller') score += 3;
  if (intent.wantsBest && product.badge === 'Premium') score += 2;

  for (const keyword of intent.keywords) {
    if (searchable.includes(keyword)) score += 1;
  }

  return score;
}

export function searchProducts(query: string): { outfits: OutfitRecommendation[]; individualProducts: Product[] } {
  if (!query.trim()) return { outfits: [], individualProducts: [] };

  const intent = parseIntent(query);

  // Build outfit recommendations
  const outfits: OutfitRecommendation[] = [];

  if (intent.wantsCompleteOutfit || intent.occasion === 'conference' || intent.occasion === 'office' || intent.occasion === 'interview' || intent.occasion === 'formal') {
    let templateKey: string | null = null;

    if (intent.gender === 'men' || (!intent.gender && (intent.occasion === 'conference' || intent.occasion === 'office'))) {
      if (intent.color === 'brown') {
        templateKey = 'men-brown-conference';
      } else {
        templateKey = 'men-conference';
      }
    }

    if (intent.gender === 'women') {
      if (intent.occasion === 'formal' || intent.occasion === 'party') {
        templateKey = 'women-formal';
      } else if (intent.occasion === 'conference' && intent.wantsCompleteOutfit) {
        templateKey = 'women-conference';
      } else {
        templateKey = 'women-office';
      }
    }

    if (!intent.gender && intent.occasion === 'formal') {
      templateKey = 'women-formal';
    }

    if (templateKey) {
      const template = OUTFIT_TEMPLATES[templateKey];
      const products = template.productIds
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== undefined);

      if (products.length > 0) {
        outfits.push({
          id: templateKey,
          title: template.title,
          description: template.description,
          products,
        });
      }
    }
  }

  // Score individual products
  const scored = allProducts
    .map((product) => ({ product, score: scoreProduct(product, intent) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const individualProducts = scored.slice(0, 6).map((item) => item.product);

  // If no outfits matched but we have products, build a dynamic outfit from top results
  if (outfits.length === 0 && individualProducts.length >= 2 && (intent.wantsCompleteOutfit || intent.occasion)) {
    const outfitProducts = individualProducts.slice(0, 4);
    outfits.push({
      id: 'dynamic',
      title: 'AI-Curated Complete Look',
      description: `A complementary outfit assembled based on your search for "${query.trim()}".`,
      products: outfitProducts,
    });
  }

  // If nothing scored, return all products as fallback
  if (outfits.length === 0 && individualProducts.length === 0) {
    return { outfits: [], individualProducts: allProducts.slice(0, 6) };
  }

  return { outfits, individualProducts };
}
