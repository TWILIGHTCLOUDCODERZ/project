export interface ProductSales {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  avgSellingPrice: number;
  discount: number;
  margin: number;
  inventory: number;
  salesVelocity: number;
  trend: number[];
  customerDemand: 'High' | 'Medium' | 'Low';
  competitorPrice: number;
  currentPrice: number;
  recommendedPrice: number;
  priceReason: string;
  expectedMargin: number;
  expectedSalesImpact: number;
}

export interface CustomerOpportunity {
  id: string;
  name: string;
  company: string;
  region: string;
  product: string;
  probability: number;
  dealValue: number;
  lastContact: string;
  status: 'Open' | 'Negotiation' | 'Closing';
}

export interface AIRecommendation {
  id: string;
  insight: string;
  impact: string;
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Inventory' | 'Pricing' | 'Customer' | 'Promotion' | 'Competition';
}

export interface ForecastData {
  period: string;
  forecast: number;
  confidence: number;
  growth: number;
  drivers: string[];
}

export interface SalesByRegion {
  region: string;
  revenue: number;
  units: number;
  growth: number;
  target: number;
}

export const executiveSummary = {
  totalRevenue: 2400000,
  totalTarget: 2700000,
  achievement: 89,
  forecast: 2900000,
  forecastConfidence: 87,
  margin: 24.6,
  unitsSold: 1842,
  ordersClosed: 312,
  avgSellingPrice: 1303,
  pipelineValue: 1850000,
  openOpportunities: 24,
};

export const products: ProductSales[] = [
  {
    id: 'p1',
    name: 'Blue Blazer — Executive',
    category: 'Blazers',
    unitsSold: 342,
    revenue: 342000,
    avgSellingPrice: 1000,
    discount: 5,
    margin: 22,
    inventory: 48,
    salesVelocity: 11.4,
    trend: [180, 220, 260, 290, 320, 342],
    customerDemand: 'High',
    competitorPrice: 1100,
    currentPrice: 1000,
    recommendedPrice: 1080,
    priceReason: 'Demand ↑ 17%, Inventory ↓ 22%, Competitor avg RM 1,100. Current margin 18% → expected 24%.',
    expectedMargin: 24,
    expectedSalesImpact: -2,
  },
  {
    id: 'p2',
    name: 'Brown Blazer — Classic',
    category: 'Blazers',
    unitsSold: 268,
    revenue: 214400,
    avgSellingPrice: 800,
    discount: 8,
    margin: 18,
    inventory: 120,
    salesVelocity: 8.9,
    trend: [200, 210, 240, 250, 260, 268],
    customerDemand: 'Medium',
    competitorPrice: 850,
    currentPrice: 800,
    recommendedPrice: 830,
    priceReason: 'Demand stable, inventory healthy. Slight increase aligns with competitor average RM 850.',
    expectedMargin: 21,
    expectedSalesImpact: -1,
  },
  {
    id: 'p3',
    name: 'Black Formal Pant — Women',
    category: 'Pants',
    unitsSold: 410,
    revenue: 164000,
    avgSellingPrice: 400,
    discount: 3,
    margin: 28,
    inventory: 65,
    salesVelocity: 13.7,
    trend: [300, 340, 370, 390, 400, 410],
    customerDemand: 'High',
    competitorPrice: 420,
    currentPrice: 400,
    recommendedPrice: 420,
    priceReason: 'High demand and low discount. Competitor avg RM 420. Increase to capture margin.',
    expectedMargin: 31,
    expectedSalesImpact: -3,
  },
  {
    id: 'p4',
    name: 'Brown Formal Pant — Men',
    category: 'Pants',
    unitsSold: 195,
    revenue: 78000,
    avgSellingPrice: 400,
    discount: 10,
    margin: 14,
    inventory: 210,
    salesVelocity: 6.5,
    trend: [220, 210, 205, 200, 198, 195],
    customerDemand: 'Low',
    competitorPrice: 380,
    currentPrice: 400,
    recommendedPrice: 380,
    priceReason: 'Demand ↓ 14%, inventory high, competitor priced lower at RM 380. Reduce to stay competitive.',
    expectedMargin: 12,
    expectedSalesImpact: 8,
  },
  {
    id: 'p5',
    name: 'Leather Watch — Stainless',
    category: 'Watches',
    unitsSold: 128,
    revenue: 192000,
    avgSellingPrice: 1500,
    discount: 0,
    margin: 35,
    inventory: 22,
    salesVelocity: 4.3,
    trend: [80, 95, 110, 118, 125, 128],
    customerDemand: 'High',
    competitorPrice: 1600,
    currentPrice: 1500,
    recommendedPrice: 1580,
    priceReason: 'Premium product, zero discount, competitor avg RM 1,600. Increase to RM 1,580 for margin uplift.',
    expectedMargin: 38,
    expectedSalesImpact: -1,
  },
  {
    id: 'p6',
    name: 'Brown Leather Belt',
    category: 'Accessories',
    unitsSold: 298,
    revenue: 44700,
    avgSellingPrice: 150,
    discount: 12,
    margin: 20,
    inventory: 340,
    salesVelocity: 9.9,
    trend: [260, 270, 280, 290, 295, 298],
    customerDemand: 'Medium',
    competitorPrice: 145,
    currentPrice: 150,
    recommendedPrice: 145,
    priceReason: 'Inventory high, competitor slightly lower at RM 145. Match competitor to increase velocity.',
    expectedMargin: 18,
    expectedSalesImpact: 5,
  },
  {
    id: 'p7',
    name: 'Women Hand Bag — Premium',
    category: 'Accessories',
    unitsSold: 87,
    revenue: 130500,
    avgSellingPrice: 1500,
    discount: 5,
    margin: 30,
    inventory: 15,
    salesVelocity: 2.9,
    trend: [60, 65, 72, 78, 83, 87],
    customerDemand: 'High',
    competitorPrice: 1550,
    currentPrice: 1500,
    recommendedPrice: 1550,
    priceReason: 'Stock-out risk (15 units left), demand rising. Increase to competitor level RM 1,550.',
    expectedMargin: 33,
    expectedSalesImpact: -2,
  },
  {
    id: 'p8',
    name: 'Women Sandals — Blazer Combo',
    category: 'Footwear',
    unitsSold: 114,
    revenue: 45600,
    avgSellingPrice: 400,
    discount: 15,
    margin: 12,
    inventory: 180,
    salesVelocity: 3.8,
    trend: [140, 130, 125, 120, 117, 114],
    customerDemand: 'Low',
    competitorPrice: 380,
    currentPrice: 400,
    recommendedPrice: 370,
    priceReason: 'Demand declining, high discount already, inventory high. Reduce to RM 370 with 5% promo.',
    expectedMargin: 10,
    expectedSalesImpact: 12,
  },
];

export const customerOpportunities: CustomerOpportunity[] = [
  { id: 'c1', name: 'Sarah Chen', company: 'Alpha Retail Group', region: 'Klang Valley', product: 'Blue Blazer — Executive', probability: 82, dealValue: 250000, lastContact: '2 days ago', status: 'Negotiation' },
  { id: 'c2', name: 'James Wong', company: 'Metro Holdings', region: 'Penang', product: 'Leather Watch — Stainless', probability: 68, dealValue: 180000, lastContact: '5 days ago', status: 'Open' },
  { id: 'c3', name: 'Priya Nair', company: 'Nair Department Store', region: 'Johor', product: 'Brown Blazer — Classic', probability: 75, dealValue: 96000, lastContact: '1 day ago', status: 'Closing' },
  { id: 'c4', name: 'Tan Wei', company: 'Urban Fashion Co', region: 'Klang Valley', product: 'Women Hand Bag — Premium', probability: 60, dealValue: 120000, lastContact: '3 days ago', status: 'Open' },
  { id: 'c5', name: 'Lim Chee', company: 'Pacific Retail', region: 'Sabah', product: 'Black Formal Pant — Women', probability: 45, dealValue: 64000, lastContact: '1 week ago', status: 'Open' },
];

export const aiRecommendations: AIRecommendation[] = [
  { id: 'r1', insight: 'Product A (Blue Blazer) demand ↑ 18%', impact: 'Stock-out risk', action: 'Increase inventory allocation', priority: 'High', category: 'Inventory' },
  { id: 'r2', insight: 'Product B (Brown Formal Pant) margin ↓ 6%', impact: 'Profitability risk', action: 'Review discount structure', priority: 'High', category: 'Pricing' },
  { id: 'r3', insight: 'Customer Sarah Chen likely to buy', impact: 'RM 250K opportunity', action: 'Contact customer today', priority: 'High', category: 'Customer' },
  { id: 'r4', insight: 'Product C (Women Sandals) declining 14%', impact: 'Revenue risk', action: 'Launch 5% promotional discount', priority: 'Medium', category: 'Promotion' },
  { id: 'r5', insight: 'Competitor price ↓ 8% on belts', impact: 'Competitive risk', action: 'Review belt pricing strategy', priority: 'Medium', category: 'Competition' },
  { id: 'r6', insight: 'Hand Bag inventory at 15 units', impact: 'Stock-out within 5 days', action: 'Reorder premium hand bags', priority: 'High', category: 'Inventory' },
];

export const forecastData: ForecastData[] = [
  {
    period: '30-Day Forecast',
    forecast: 3200000,
    confidence: 92,
    growth: 12,
    drivers: ['Product A demand increased 18%', 'Repeat customers increased 9%', 'Current pipeline is strong at RM 1.85M'],
  },
  {
    period: '60-Day Forecast',
    forecast: 6100000,
    confidence: 85,
    growth: 15,
    drivers: ['Seasonal uptick expected in formal wear', '2 large deals in negotiation stage', 'Promotion on declining products expected to recover 8%'],
  },
  {
    period: '90-Day Forecast',
    forecast: 9200000,
    confidence: 78,
    growth: 18,
    drivers: ['New product launch pipeline', 'Regional expansion into Sabah showing early traction', 'Competitor supply constraints may shift demand to us'],
  },
];

export const salesByRegion: SalesByRegion[] = [
  { region: 'Klang Valley', revenue: 1080000, units: 830, growth: 14, target: 1200000 },
  { region: 'Penang', revenue: 540000, units: 412, growth: 8, target: 600000 },
  { region: 'Johor', revenue: 420000, units: 321, growth: -3, target: 500000 },
  { region: 'Sabah', revenue: 210000, units: 161, growth: 22, target: 250000 },
  { region: 'Sarawak', revenue: 150000, units: 118, growth: 5, target: 150000 },
];

export const topSellingProducts = products.slice().sort((a, b) => b.revenue - a.revenue).slice(0, 5);
export const slowMovingProducts = products.slice().sort((a, b) => a.salesVelocity - b.salesVelocity).slice(0, 3);

export const monthlyRevenue = [
  { month: 'Jan', revenue: 180000, target: 200000 },
  { month: 'Feb', revenue: 210000, target: 200000 },
  { month: 'Mar', revenue: 195000, target: 220000 },
  { month: 'Apr', revenue: 240000, target: 220000 },
  { month: 'May', revenue: 260000, target: 250000 },
  { month: 'Jun', revenue: 285000, target: 270000 },
  { month: 'Jul', revenue: 310000, target: 300000 },
  { month: 'Aug', revenue: 340000, target: 320000 },
  { month: 'Sep', revenue: 375000, target: 350000 },
];

export function formatRM(value: number): string {
  if (value >= 1000000) return `RM ${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `RM ${(value / 1000).toFixed(1)}K`;
  return `RM ${value.toLocaleString()}`;
}
