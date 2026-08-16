export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  badge?: string;
}

export const womenProducts: Product[] = [
  {
    id: 'w-blazer-1',
    name: 'Executive Noir Blazer',
    price: 289,
    originalPrice: 349,
    image: '/Women/Women_Black_Blazer.png',
    images: ['/Women/Women_Black_Blazer.png'],
    category: 'women',
    subcategory: 'blazers',
    description:
      'A timeless black blazer crafted from premium Italian wool. Features a structured silhouette with satin lapel details, perfect for boardroom meetings and evening events.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
    ],
    badge: 'Best Seller',
  },
  {
    id: 'w-blazer-2',
    name: 'Heritage Brown Blazer Coat',
    price: 325,
    image: '/Women/Women_Brown_Blazer_coat.png',
    images: ['/Women/Women_Brown_Blazer_coat.png'],
    category: 'women',
    subcategory: 'blazers',
    description:
      'An elegant brown blazer coat with a tailored fit. Double-breasted design with gold-tone buttons adds a touch of sophistication to any ensemble.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Cognac', hex: '#9a4e2c' },
      { name: 'Chocolate', hex: '#3c1414' },
    ],
  },
  {
    id: 'w-blazer-3',
    name: 'Sandals & Blazer Set',
    price: 345,
    originalPrice: 415,
    image: '/Women/WOMEN_SANDALS_BLAZER.png',
    images: ['/Women/WOMEN_SANDALS_BLAZER.png'],
    category: 'women',
    subcategory: 'blazers',
    description:
      'A curated matching set featuring a structured blazer with coordinating sandals. Effortless coordination for the woman who values polished head-to-toe style.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sand', hex: '#c2b280' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
    badge: 'New Arrival',
  },
  {
    id: 'w-vest-1',
    name: 'Ivory Heritage Vest',
    price: 195,
    image: '/Women/Vest_Women_white.png',
    images: ['/Women/Vest_Women_white.png', '/Women/White_Vest_Women.png'],
    category: 'women',
    subcategory: 'blazers',
    description:
      'An elegant ivory vest with a modern cropped fit. Single-breasted design with satin lapel creates a refined layering piece for professional settings.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#fffff0' },
      { name: 'Champagne', hex: '#f7e7ce' },
    ],
  },
  {
    id: 'w-vest-2',
    name: 'Classic White Vest',
    price: 185,
    image: '/Women/White_Vest_Women.png',
    images: ['/Women/White_Vest_Women.png', '/Women/Vest_Women_white.png'],
    category: 'women',
    subcategory: 'blazers',
    description:
      'A pristine white vest with clean lines and a structured silhouette. Pairs beautifully with both formal trousers and business casual skirts.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Off-White', hex: '#fafafa' },
    ],
    badge: "Editor's Pick",
  },
  {
    id: 'w-pant-1',
    name: 'Midnight Formal Trouser',
    price: 179,
    originalPrice: 219,
    image: '/Women/women_black_formal_pant.png',
    images: ['/Women/women_black_formal_pant.png'],
    category: 'women',
    subcategory: 'formal-pants',
    description:
      'High-waisted formal trousers with a straight-leg cut. Premium stretch fabric ensures all-day comfort while maintaining a polished look.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Charcoal', hex: '#36454f' },
    ],
    badge: 'Best Seller',
  },
  {
    id: 'w-pant-2',
    name: 'Caramel Formal Trouser',
    price: 189,
    image: '/Women/Women_Brown_Formal_Pant.png',
    images: ['/Women/Women_Brown_Formal_Pant.png'],
    category: 'women',
    subcategory: 'formal-pants',
    description:
      'Sophisticated brown formal trousers with a tapered leg. Rich caramel hue adds warmth to your professional wardrobe while maintaining impeccable tailoring.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Caramel', hex: '#c68c3c' },
      { name: 'Espresso', hex: '#3c1414' },
    ],
    badge: 'New Arrival',
  },
  {
    id: 'w-handbag-1',
    name: 'Luxe Structured Handbag',
    price: 425,
    originalPrice: 499,
    image: '/Women/women_hand_bag.png',
    images: ['/Women/women_hand_bag.png'],
    category: 'women',
    subcategory: 'handbags',
    description:
      'A structured leather handbag with gold hardware accents. Spacious interior with organizational pockets, seamlessly transitioning from office to evening.',
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Cognac', hex: '#9a4e2c' },
    ],
    badge: 'Premium',
  },
];

export const menProducts: Product[] = [
  {
    id: 'm-blazer-1',
    name: 'Navy Heritage Blazer',
    price: 345,
    originalPrice: 415,
    image: '/Men/blue_blazer/Blazer_Blue_Men_Front.png',
    images: [
      '/Men/blue_blazer/Blazer_Blue_Men_Front.png',
      '/Men/blue_blazer/Blazer_Blue_Men_Back.png',
      '/Men/blue_blazer/Blazer_Blue_Men_Pant.png',
    ],
    category: 'men',
    subcategory: 'blazers',
    description:
      'A distinguished navy blazer constructed from Super 120s wool. Features peak lapels and a half-canvas construction for a refined drape.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Charcoal', hex: '#36454f' },
    ],
    badge: 'Best Seller',
  },
  {
    id: 'm-blazer-2',
    name: 'Navy Suit Blazer & Trouser',
    price: 425,
    image: '/Men/blue_blazer/Blazer_Blue_Men_Pant.png',
    images: [
      '/Men/blue_blazer/Blazer_Blue_Men_Pant.png',
      '/Men/blue_blazer/Blazer_Blue_Men_Front.png',
      '/Men/blue_blazer/Blazer_Blue_Men_Back.png',
    ],
    category: 'men',
    subcategory: 'blazers',
    description:
      'A versatile navy suit blazer paired with matching trousers. Notch lapels, dual interior pockets, and working cuff buttonholes reflect meticulous craftsmanship.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
  },
  {
    id: 'm-blazer-3',
    name: 'Blue Vest Ensemble',
    price: 265,
    image: '/Men/blue_blazer/Blazer_Blue_Vest.png',
    images: [
      '/Men/blue_blazer/Blazer_Blue_Vest.png',
      '/Men/blue_blazer/Blazer_Blue_Men_Front.png',
    ],
    category: 'men',
    subcategory: 'blazers',
    description:
      'A sophisticated blue vest that completes the three-piece look. Fine wool blend with a pointed hem and adjustable back strap for a custom fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Steel Blue', hex: '#4682b4' },
    ],
    badge: 'New Arrival',
  },
  {
    id: 'm-blazer-4',
    name: 'Brown Executive Blazer',
    price: 355,
    originalPrice: 429,
    image: '/Men/brown_blazer/Brown_Blazer_front_view.png',
    images: [
      '/Men/brown_blazer/Brown_Blazer_front_view.png',
      '/Men/brown_blazer/Brown_Blazer_Men_Back_Side.png',
      '/Men/brown_blazer/Brown_Blazer_pant_Men.png',
    ],
    category: 'men',
    subcategory: 'blazers',
    description:
      'A commanding brown blazer in premium herringbone wool. Patch pockets and a soft shoulder construction create an authoritative yet approachable silhouette.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Cognac', hex: '#9a4e2c' },
      { name: 'Walnut', hex: '#5c3317' },
    ],
    badge: 'Premium',
  },
  {
    id: 'm-trouser-1',
    name: 'Brown Formal Trouser',
    price: 195,
    image: '/Men/brown_blazer/Brown_Blazer_pant_Men.png',
    images: [
      '/Men/brown_blazer/Brown_Blazer_pant_Men.png',
      '/Men/brown_blazer/Brown_Blazer_front_view.png',
    ],
    category: 'men',
    subcategory: 'formal-trousers',
    description:
      'Premium wool-blend trousers with a flat-front design. The comfort-stretch waistband and precision-cut leg create an impeccable silhouette in warm earth tones.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Cognac', hex: '#9a4e2c' },
      { name: 'Charcoal', hex: '#36454f' },
    ],
  },
  {
    id: 'm-vest-1',
    name: 'Brown Formal Vest',
    price: 175,
    image: '/Men/brown_blazer/Brown_vest_men.png',
    images: [
      '/Men/brown_blazer/Brown_vest_men.png',
      '/Men/brown_blazer/Brown_Blazer_front_view.png',
    ],
    category: 'men',
    subcategory: 'formal-trousers',
    description:
      'A distinguished brown vest for layering under blazers or wearing solo. Features a V-neck cut with pointed hem and six-button front for classic styling.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cognac', hex: '#9a4e2c' },
      { name: 'Espresso', hex: '#3c1414' },
    ],
    badge: "Editor's Pick",
  },
  {
    id: 'm-shoe-1',
    name: 'Brown Oxford Shoes',
    price: 245,
    originalPrice: 295,
    image: '/Men/shoe_brown/Brown_Shoe_Men_Front.png',
    images: [
      '/Men/shoe_brown/Brown_Shoe_Men_Front.png',
      '/Men/shoe_brown/Brown_Shoe_Men_Side.png',
      '/Men/shoe_brown/Brown_Shoe_Men_Back.png',
    ],
    category: 'men',
    subcategory: 'business-wear',
    description:
      'Handcrafted brown Oxford shoes in full-grain leather. Goodyear welt construction ensures durability while the cap-toe design exudes boardroom authority.',
    sizes: ['8', '9', '10', '11', '12'],
    colors: [
      { name: 'Cognac', hex: '#9a4e2c' },
      { name: 'Dark Brown', hex: '#3c1414' },
    ],
    badge: 'Best Seller',
  },
];

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export const womenCategories: Category[] = [
  { id: 'blazers', name: 'Blazers', description: 'Structured sophistication for the modern woman', image: '/Women/Women_Black_Blazer.png', productCount: 5 },
  { id: 'formal-pants', name: 'Formal Pants', description: 'Tailored precision for impeccable style', image: '/Women/women_black_formal_pant.png', productCount: 2 },
  { id: 'handbags', name: 'Handbags', description: 'Luxury accessories that define elegance', image: '/Women/women_hand_bag.png', productCount: 1 },
];

export const menCategories: Category[] = [
  { id: 'blazers', name: 'Blazers', description: 'Commanding presence in every thread', image: '/Men/blue_blazer/Blazer_Blue_Men_Front.png', productCount: 4 },
  { id: 'formal-trousers', name: 'Formal Trousers', description: 'Precision-cut for the discerning gentleman', image: '/Men/brown_blazer/Brown_Blazer_pant_Men.png', productCount: 2 },
  { id: 'business-wear', name: 'Business Wear', description: 'Professional excellence from sole to shoulder', image: '/Men/shoe_brown/Brown_Shoe_Men_Front.png', productCount: 1 },
];
