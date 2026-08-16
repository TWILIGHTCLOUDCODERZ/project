import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';
import { products, customerOpportunities, executiveSummary, forecastData, formatRM } from '../../data/sellerData';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const suggestedQuestions = [
  'What should I focus on today?',
  'Which products are likely to miss target?',
  'Why did sales drop this month?',
  'Which customers should I contact?',
  'What price should I offer Customer Sarah Chen?',
  'Show me products with declining demand.',
  'What is my expected revenue at month end?',
  'Which deals are at risk?',
];

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hi Tyson! I'm your AI Seller Copilot. I can analyze your sales data, forecast trends, recommend pricing, and suggest actions. Ask me anything, or pick a suggested question below.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('focus on today') || q.includes('priority') || q.includes('priorities')) {
      return `Here are your 3 priorities for today:\n\n1. **Product A (Blue Blazer — Executive)** is trending 18% above forecast — increase inventory allocation. Current stock is at 48 units, which will run out in ~4 days at current velocity.\n\n2. **Customer Sarah Chen** (Alpha Retail Group) has a high 82% probability of purchasing Blue Blazer — follow up today. Deal value: ${formatRM(250000)}.\n\n3. **Product C (Women Sandals — Blazer Combo)** is 14% below forecast — consider a 5% promotional discount to boost velocity. Current inventory is 180 units.`;
    }

    if (q.includes('miss target') || q.includes('below forecast')) {
      const slow = products.filter((p) => p.salesVelocity < 7);
      return `Based on current trends, ${slow.length} products are likely to miss their targets this period:\n\n${slow.map((p) => `• **${p.name}**: Velocity ${p.salesVelocity.toFixed(1)}/wk, demand ${p.customerDemand}, trend declining. Revenue: ${formatRM(p.revenue)}.`).join('\n\n')}\n\n**Recommended actions:**\n• Review discount structure for slow movers\n• Launch targeted promotions\n• Consider price adjustments to match competitor levels`;
    }

    if (q.includes('sales drop') || q.includes('why did sales') || q.includes('decline')) {
      return `Sales analysis for this month shows a mixed picture:\n\n**Key factors:**\n• Johor region is down 3% — competitor opened new store, drawing foot traffic away\n• Brown Formal Pant (Men) demand dropped 14% — seasonal shift away from formal wear\n• Women Sandals declining 14% — end-of-season effect\n\n**Offsetting positives:**\n• Klang Valley up 14% — strong retail partnerships\n• Sabah up 22% — new market entry gaining traction\n• Blue Blazer demand up 18% — premium segment growing\n\n**Recommendation:** Focus on Johor recovery with targeted promotions and shift slow-moving inventory with a 5-10% discount campaign.`;
    }

    if (q.includes('which customer') || q.includes('contact') || q.includes('customers should')) {
      const sorted = [...customerOpportunities].sort((a, b) => b.probability - a.probability);
      return `Here are the customers you should contact, ranked by deal probability:\n\n${sorted.map((c, i) => `${i + 1}. **${c.name}** (${c.company}) — ${c.probability}% probability, ${formatRM(c.dealValue)} deal value, status: ${c.status}. Last contact: ${c.lastContact}. Interested in: ${c.product}.`).join('\n\n')}\n\n**Priority:** Contact Sarah Chen today — highest probability (82%) and largest deal value (${formatRM(250000)}).`;
    }

    if (q.includes('price') && (q.includes('sarah') || q.includes('customer'))) {
      return `**Pricing recommendation for Sarah Chen (Alpha Retail Group):**\n\n• Product: Blue Blazer — Executive\n• Current price: RM 1,000\n• Recommended price: RM 1,080\n• Competitor average: RM 1,100\n\n**Rationale:** Sarah's company is a high-volume repeat buyer with 82% close probability. Offering RM 1,050 (mid-point) balances margin improvement (+3%) with relationship value. This captures additional margin while remaining below competitor pricing.\n\n**Expected outcome:** Deal closes at RM 1,050, margin improves from 22% to 25%, and customer perceives value vs competitor at RM 1,100.`;
    }

    if (q.includes('declining demand') || q.includes('declining')) {
      const declining = products.filter((p) => p.trend[p.trend.length - 1] < p.trend[0]);
      return `Products with declining demand:\n\n${declining.map((p) => `• **${p.name}**: Trend ${p.trend[0]} → ${p.trend[p.trend.length - 1]} (${(((p.trend[p.trend.length - 1] - p.trend[0]) / p.trend[0]) * 100).toFixed(0)}% change). Current discount: ${p.discount}%, inventory: ${p.inventory} units.`).join('\n\n')}\n\n**Suggested actions:** Launch promotional campaigns, review pricing against competitors, and consider bundling with high-demand products.`;
    }

    if (q.includes('expected revenue') || q.includes('month end') || q.includes('forecast')) {
      return `**Expected revenue at month end:**\n\n• 30-day forecast: ${formatRM(forecastData[0].forecast)} (confidence: ${forecastData[0].confidence}%)\n• Expected growth: +${forecastData[0].growth}%\n• Current achievement: ${executiveSummary.achievement}% of target\n\n**Key drivers:**\n${forecastData[0].drivers.map((d) => `• ${d}`).join('\n')}\n\nTo hit your target of ${formatRM(executiveSummary.totalTarget)}, you need to close ${formatRM(executiveSummary.totalTarget - executiveSummary.totalRevenue)} in remaining deals. Your pipeline of ${formatRM(executiveSummary.pipelineValue)} provides ${Math.round((executiveSummary.pipelineValue / (executiveSummary.totalTarget - executiveSummary.totalRevenue)) * 100)}% coverage.`;
    }

    if (q.includes('deals at risk') || q.includes('risk')) {
      const risk = customerOpportunities.filter((c) => c.probability < 70 || c.status === 'Open');
      return `**Deals at risk:**\n\n${risk.map((c) => `• **${c.name}** (${c.company}) — ${c.probability}% probability, ${formatRM(c.dealValue)} value, status: ${c.status}. Last contact: ${c.lastContact}.`).join('\n\n')}\n\n**Recommendations:**\n• Prioritize follow-ups with deals below 70% probability\n• Tan Wei (60%) has a large deal value (${formatRM(120000)}) — schedule a call this week\n• Lim Chee (45%) hasn't been contacted in 1 week — urgent follow-up needed`;
    }

    return `I can help you analyze sales performance, forecast trends, recommend pricing, and identify opportunities. Try asking about:\n\n• Daily priorities and focus areas\n• Products at risk of missing targets\n• Customer follow-up recommendations\n• Pricing recommendations for specific customers\n• Revenue forecasts and pipeline analysis\n• Deals at risk\n\nWhat would you like to know?`;
  };

  const handleSend = (text?: string) => {
    const question = text || input;
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = generateResponse(question);
      setMessages((prev) => [...prev, { role: 'ai', content: response }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001845] to-[#003B7A] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Bot className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">AI Seller Copilot</h2>
            <p className="text-sm text-white/50">Your intelligent sales assistant for data-driven decisions</p>
          </div>
        </div>
      </div>

      {/* Chat interface */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' ? 'bg-accent-100' : 'bg-primary-100'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4 text-accent-600" /> : <User className="w-4 h-4 text-primary-600" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'ai' ? 'bg-neutral-50 text-neutral-700' : 'bg-[#003B7A] text-white'
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent-600" />
              </div>
              <div className="bg-neutral-50 rounded-2xl px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-700 bg-accent-50 border border-accent-200 rounded-full hover:bg-accent-100 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-neutral-100 p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about sales, forecasts, pricing, customers..."
            className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-12 h-12 flex items-center justify-center bg-[#003B7A] text-white rounded-xl hover:bg-[#002b5c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
