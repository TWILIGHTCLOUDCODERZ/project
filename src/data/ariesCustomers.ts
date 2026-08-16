export type Language = 'en' | 'zh' | 'ms';

export interface AriesOrder {
  orderId: string;
  itemName: string;
  status: string;
  expectedDelivery: string;
}

export interface AriesCustomer {
  customerId: string;
  name: string;
  email: string;
  preferredLanguage: Language;
  lastOrder: AriesOrder;
  previousPurchase: string;
  recommendations: string[];
}

export const ariesCustomers: Record<string, AriesCustomer> = {
  'deepanrey@gmail.com': {
    customerId: 'CUST-1001',
    name: 'Deepanrey',
    email: 'deepanrey@gmail.com',
    preferredLanguage: 'en',
    lastOrder: {
      orderId: 'ORD-10001',
      itemName: 'Heritage Brown Blazer Coat',
      status: 'Out for Delivery',
      expectedDelivery: '18 Aug 2026',
    },
    previousPurchase: 'Navy Formal Shirt',
    recommendations: [
      'Navy Suit Blazer & Trouser',
      'Brown Oxford Shoes',
      'Luxe Structured Handbag',
    ],
  },
  'tessa@gmail.com': {
    customerId: 'CUST-1002',
    name: 'Tessa',
    email: 'tessa@gmail.com',
    preferredLanguage: 'ms',
    lastOrder: {
      orderId: 'ORD-10002',
      itemName: 'Navy Heritage Blazer',
      status: 'Shipped',
      expectedDelivery: '19 Aug 2026',
    },
    previousPurchase: 'Blue Vest Ensemble',
    recommendations: [
      'Sandals & Blazer Set',
      'Luxe Structured Handbag',
      'Heritage Brown Blazer Coat',
    ],
  },
};

export const recommendationProductMap: Record<string, string> = {
  'Navy Suit Blazer & Trouser': 'm-blazer-2',
  'Brown Oxford Shoes': 'm-shoe-1',
  'Luxe Structured Handbag': 'w-handbag-1',
  'Sandals & Blazer Set': 'w-blazer-3',
  'Heritage Brown Blazer Coat': 'w-blazer-2',
};

export function getAriesCustomer(email: string | null | undefined): AriesCustomer | null {
  if (!email) return null;
  return ariesCustomers[email.toLowerCase()] ?? null;
}
