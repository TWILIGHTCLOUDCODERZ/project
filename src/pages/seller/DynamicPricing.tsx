import { useState } from 'react';
import { DollarSign, Check, X, Edit3, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { products, formatRM } from '../../data/sellerData';

type Decision = 'pending' | 'accepted' | 'modified' | 'rejected';

export default function DynamicPricing() {
  const [decisions, setDecisions] = useState<Record<string, { decision: Decision; modifiedPrice?: number }>>({});

  const handleDecision = (productId: string, decision: Decision, modifiedPrice?: number) => {
    setDecisions((prev) => ({ ...prev, [productId]: { decision, modifiedPrice } }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001845] to-[#003B7A] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <DollarSign className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Dynamic Pricing Engine</h2>
            <p className="text-sm text-white/50">AI-recommended optimal pricing based on demand, inventory, margin & competition</p>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="space-y-4">
        {products.map((p) => {
          const state = decisions[p.id] || { decision: 'pending' as Decision };
          const priceDiff = p.recommendedPrice - p.currentPrice;
          const isIncrease = priceDiff > 0;

          return (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Product info */}
                <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-neutral-100">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{p.category}</p>
                  <h3 className="font-display text-base font-bold text-primary-900 mb-3">{p.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="Current Price" value={`RM ${p.currentPrice.toLocaleString()}`} />
                    <MiniStat label="Competitor Avg" value={`RM ${p.competitorPrice.toLocaleString()}`} />
                    <MiniStat label="Current Margin" value={`${p.margin}%`} />
                    <MiniStat label="Inventory" value={`${p.inventory} units`} highlight={p.inventory < 30} />
                  </div>
                </div>

                {/* AI recommendation */}
                <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-neutral-100 bg-accent-50/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-accent-600" />
                    <p className="text-xs font-semibold text-accent-700 uppercase tracking-wider">AI Recommendation</p>
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-3xl font-bold text-primary-900">RM {p.recommendedPrice.toLocaleString()}</p>
                    <span className={`flex items-center gap-0.5 text-sm font-semibold ${isIncrease ? 'text-success-600' : 'text-error-600'}`}>
                      {isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isIncrease ? '+' : ''}{priceDiff > 0 ? '+' : ''}{priceDiff}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-3">{p.priceReason}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-neutral-500">Expected margin: <span className="font-bold text-success-600">{p.expectedMargin}%</span></span>
                    <span className="text-neutral-500">Sales impact: <span className={`font-bold ${p.expectedSalesImpact >= 0 ? 'text-success-600' : 'text-error-600'}`}>{p.expectedSalesImpact > 0 ? '+' : ''}{p.expectedSalesImpact}%</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 flex flex-col justify-center gap-2">
                  {state.decision === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleDecision(p.id, 'accepted')}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-success-600 text-white text-sm font-bold rounded-lg hover:bg-success-700 transition-colors"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleDecision(p.id, 'modified')}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-primary-700 text-sm font-bold rounded-lg border border-neutral-200 hover:border-accent-400 hover:text-accent-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" /> Modify
                      </button>
                      <button
                        onClick={() => handleDecision(p.id, 'rejected')}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white text-neutral-500 text-sm font-bold rounded-lg border border-neutral-200 hover:border-error-400 hover:text-error-600 transition-colors"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : (
                    <DecisionBadge decision={state.decision} modifiedPrice={state.modifiedPrice} recommended={p.recommendedPrice} onReset={() => handleDecision(p.id, 'pending')} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-display text-base font-bold text-primary-900 mb-4">Pricing Decisions Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryStat label="Pending" count={Object.values(decisions).filter((d) => d.decision === 'pending').length || products.length - Object.keys(decisions).length} color="neutral" />
          <SummaryStat label="Accepted" count={Object.values(decisions).filter((d) => d.decision === 'accepted').length} color="success" />
          <SummaryStat label="Modified" count={Object.values(decisions).filter((d) => d.decision === 'modified').length} color="accent" />
          <SummaryStat label="Rejected" count={Object.values(decisions).filter((d) => d.decision === 'rejected').length} color="error" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-error-600' : 'text-primary-900'}`}>{value}</p>
    </div>
  );
}

function DecisionBadge({ decision, modifiedPrice, recommended, onReset }: {
  decision: Decision;
  modifiedPrice?: number;
  recommended: number;
  onReset: () => void;
}) {
  const config = {
    accepted: { label: 'Accepted', color: 'bg-success-100 text-success-700 border-success-200', price: recommended },
    modified: { label: 'Modified', color: 'bg-accent-100 text-accent-700 border-accent-200', price: modifiedPrice || recommended },
    rejected: { label: 'Rejected', color: 'bg-error-100 text-error-700 border-error-200', price: 0 },
    pending: { label: '', color: '', price: 0 },
  };
  const c = config[decision];
  return (
    <div className="text-center">
      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full border ${c.color}`}>{c.label}</span>
      {c.price > 0 && <p className="text-sm font-bold text-primary-900 mt-2">RM {c.price.toLocaleString()}</p>}
      <button onClick={onReset} className="text-xs text-neutral-400 hover:text-accent-600 mt-2 underline">Undo</button>
    </div>
  );
}

function SummaryStat({ label, count, color }: { label: string; count: number; color: string }) {
  const colorMap: Record<string, string> = {
    neutral: 'bg-neutral-50 text-neutral-600',
    success: 'bg-success-50 text-success-600',
    accent: 'bg-accent-50 text-accent-600',
    error: 'bg-error-50 text-error-600',
  };
  return (
    <div className={`rounded-lg p-4 ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-0.5">{label}</p>
    </div>
  );
}
