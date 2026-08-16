import type { Language, AriesCustomer } from '../data/ariesCustomers';
import { recommendationProductMap } from '../data/ariesCustomers';

export interface AriesCard {
  name: string;
  productId?: string;
}

export interface AriesResponse {
  text: string;
  cards?: AriesCard[];
}

const INTENTS = {
  orderStatus: {
    en: ['order', 'status', 'track', 'delivery', 'where', 'ship', 'my order'],
    zh: ['订单', '状态', '物流', '快递', '到哪', '发货', '我的订单'],
    ms: ['pesanan', 'status', 'jejakan', 'penghantaran', 'di mana', 'hantar', 'pesanan saya'],
  },
  recommendations: {
    en: ['recommend', 'suggest', 'what should', 'product', 'buy', 'style', 'outfit', 'shop'],
    zh: ['推荐', '建议', '买什么', '搭配', '风格', '购物'],
    ms: ['cadangan', 'syor', 'produk', 'beli', 'gaya', 'pakaian', 'membeli'],
  },
  greeting: {
    en: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
    zh: ['你好', '嗨', '哈喽', '早上好', '下午好', '晚上好'],
    ms: ['hai', 'hello', 'selamat', 'apa khabar'],
  },
  help: {
    en: ['help', 'support', 'assist', 'contact', 'customer service', 'faq'],
    zh: ['帮助', '客服', '协助', '联系', '常见问题'],
    ms: ['bantuan', 'sokongan', 'hubungi', 'servis pelanggan'],
  },
  language: {
    en: ['language', 'english', 'chinese', 'malay', 'bahasa'],
    zh: ['语言', '英文', '中文', '马来文'],
    ms: ['bahasa', 'inggeris', 'cina', 'melayu'],
  },
} as const;

type IntentKey = keyof typeof INTENTS;

function detectIntent(message: string, lang: Language): IntentKey | null {
  const lower = message.toLowerCase();
  const scores: Record<IntentKey, number> = {
    orderStatus: 0,
    recommendations: 0,
    greeting: 0,
    help: 0,
    language: 0,
  };

  (Object.keys(INTENTS) as IntentKey[]).forEach((key) => {
    (Object.keys(INTENTS[key]) as Language[]).forEach((l) => {
      INTENTS[key][l].forEach((word) => {
        if (lower.includes(word.toLowerCase())) {
          scores[key]++;
        }
      });
    });
  });

  let best: IntentKey | null = null;
  let bestScore = 0;
  (Object.keys(scores) as IntentKey[]).forEach((key) => {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      best = key;
    }
  });

  return best;
}

function buildOrderText(customer: AriesCustomer, lang: Language): string {
  const o = customer.lastOrder;
  const templates: Record<Language, string> = {
    en: `Hi ${customer.name}! Here's your latest order:\n\n• Order ID: ${o.orderId}\n• Item: ${o.itemName}\n• Status: ${o.status}\n• Expected Delivery: ${o.expectedDelivery}\n\nIs there anything else I can help you with?`,
    zh: `嗨 ${customer.name}！这是您的最新订单：\n\n• 订单号：${o.orderId}\n• 商品：${o.itemName}\n• 状态：${o.status}\n• 预计送达：${o.expectedDelivery}\n\n还有什么我可以帮您的吗？`,
    ms: `Hai ${customer.name}! Inilah pesanan terkini anda:\n\n• ID Pesanan: ${o.orderId}\n• Item: ${o.itemName}\n• Status: ${o.status}\n• Jangka Penghantaran: ${o.expectedDelivery}\n\nAdakah ada lagi yang saya boleh bantu?`,
  };
  return templates[lang];
}

export function generateAriesResponse(
  message: string,
  lang: Language,
  customer: AriesCustomer | null
): AriesResponse {
  const intent = detectIntent(message, lang);

  if (intent === 'greeting') {
    return { text: getWelcomeMessage(lang, customer) };
  }

  if (intent === 'help') {
    const helpText: Record<Language, string> = {
      en: `I'm Aries, your AI shopping assistant! I can help you with:\n\n• Track your order status and delivery\n• Recommend personalized products\n• Answer customer support questions\n• Support English, Chinese, and Bahasa Melayu\n\nWhat would you like help with? You can ask me to "track my order" or "recommend products"!`,
      zh: `我是 Aries，您的 AI 购物助手！我可以帮您：\n\n• 追踪您的订单状态和配送\n• 推荐个性化产品\n• 解答客户支持问题\n• 支持英文、中文和马来文\n\n您需要什么帮助？您可以让我"追踪我的订单"或"推荐产品"！`,
      ms: `Saya Aries, pembantu beli-belah AI anda! Saya boleh membantu anda dengan:\n\n• Jejaki status pesanan dan penghantaran anda\n• Cadangkan produk peribadi\n• Jawab soalan sokongan pelanggan\n• Menyokong Inggeris, Cina, dan Bahasa Melayu\n\nApa yang anda mahu bantu? Anda boleh minta saya "jejak pesanan saya" atau "cadang produk"!`,
    };
    return { text: helpText[lang] };
  }

  if (intent === 'language') {
    const langText: Record<Language, string> = {
      en: 'I support three languages: English, Chinese (中文), and Bahasa Melayu. You can switch anytime using the globe icon in the header!',
      zh: '我支持三种语言：英文、中文和马来文。您可以随时使用顶部的地球图标切换！',
      ms: 'Saya menyokong tiga bahasa: Inggeris, Cina (中文), dan Bahasa Melayu. Anda boleh bertukar pada bila-bila masa menggunakan ikon glob di header!',
    };
    return { text: langText[lang] };
  }

  if (intent === 'orderStatus') {
    if (!customer) {
      const notLoggedIn: Record<Language, string> = {
        en: "Please sign in to your account first, and I'll be happy to show you your order details and personalized recommendations.",
        zh: '请先登录您的账户，我很乐意为您显示订单详情和个性化推荐。',
        ms: 'Sila log masuk ke akaun anda dahulu, dan saya akan gembira menunjukkan butiran pesanan dan cadangan peribadi anda.',
      };
      return { text: notLoggedIn[lang] };
    }
    return { text: buildOrderText(customer, lang) };
  }

  if (intent === 'recommendations') {
    if (!customer) {
      const notLoggedIn: Record<Language, string> = {
        en: "Please sign in to your account first, and I'll be happy to show you your order details and personalized recommendations.",
        zh: '请先登录您的账户，我很乐意为您显示订单详情和个性化推荐。',
        ms: 'Sila log masuk ke akaun anda dahulu, dan saya akan gembira menunjukkan butiran pesanan dan cadangan peribadi anda.',
      };
      return { text: notLoggedIn[lang] };
    }
    const recText: Record<Language, string> = {
      en: `Hi ${customer.name}! Based on your previous purchase of "${customer.previousPurchase}", here are my personalized recommendations for you. Tap any item to view details!`,
      zh: `嗨 ${customer.name}！根据您之前购买的"${customer.previousPurchase}"，以下是我的个性化推荐。点击任意商品查看详情！`,
      ms: `Hai ${customer.name}! Berdasarkan pembelian terdahulu anda "${customer.previousPurchase}", inilah cadangan peribadi saya untuk anda. Ketik mana-mana item untuk melihat butiran!`,
    };
    return {
      text: recText[lang],
      cards: customer.recommendations.map((name) => ({
        name,
        productId: recommendationProductMap[name],
      })),
    };
  }

  const noMatch: Record<Language, string> = {
    en: "I'm not sure I understood that. I can help you with: tracking your order, product recommendations, or general customer support. Try asking me about your order status or for style suggestions!",
    zh: '我不太确定我理解了。我可以帮您：追踪订单、获取产品推荐或一般客户支持。试试问我关于您的订单状态或风格建议！',
    ms: 'Saya tidak pasti saya faham. Saya boleh membantu anda dengan: menjejaki pesanan, cadangan produk, atau sokongan pelanggan. Cuba tanya saya tentang status pesanan atau cadangan gaya!',
  };
  return { text: noMatch[lang] };
}

export function getWelcomeMessage(lang: Language, customer: AriesCustomer | null): string {
  if (customer) {
    const o = customer.lastOrder;
    const welcome: Record<Language, string> = {
      en: `Hello ${customer.name}! I'm Aries, your AI shopping assistant.\n\nYour latest order:\n• Order ID: ${o.orderId}\n• Item: ${o.itemName}\n• Status: ${o.status}\n• Expected Delivery: ${o.expectedDelivery}\n\nHow can I help you today? You can ask me to track your order, recommend products, or anything else!`,
      zh: `你好 ${customer.name}！我是 Aries，您的 AI 购物助手。\n\n您的最新订单：\n• 订单号：${o.orderId}\n• 商品：${o.itemName}\n• 状态：${o.status}\n• 预计送达：${o.expectedDelivery}\n\n今天我能为您做什么？您可以让我追踪订单、推荐产品或其他任何问题！`,
      ms: `Hai ${customer.name}! Saya Aries, pembantu beli-belah AI anda.\n\nPesanan terkini anda:\n• ID Pesanan: ${o.orderId}\n• Item: ${o.itemName}\n• Status: ${o.status}\n• Jangka Penghantaran: ${o.expectedDelivery}\n\nApa yang boleh saya bantu hari ini? Anda boleh tanya saya untuk menjejaki pesanan, cadangkan produk, atau apa-apa sahaja!`,
    };
    return welcome[lang];
  }
  const guest: Record<Language, string> = {
    en: "Hello! I'm Aries, your AI shopping assistant. I can help you track orders, get product recommendations, and answer your questions. Please sign in to access your order details. How can I help you today?",
    zh: '你好！我是 Aries，您的 AI 购物助手。我可以帮您追踪订单、获取产品推荐和解答问题。请登录以访问您的订单详情。今天我能为您做什么？',
    ms: 'Hai! Saya Aries, pembantu beli-belah AI anda. Saya boleh membantu anda menjejaki pesanan, mendapatkan cadangan produk, dan menjawab soalan anda. Sila log masuk untuk mengakses butiran pesanan anda. Apa yang boleh saya bantu hari ini?',
  };
  return guest[lang];
}
