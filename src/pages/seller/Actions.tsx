import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Phone, Mail, Tag, DollarSign, Check, X } from 'lucide-react';
import { aiRecommendations, customerOpportunities, products, formatRM } from '../../data/sellerData';

type ActionStatus = 'pending' | 'done' | 'dismissed';

export default function Actions() {
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>({});

  const updateStatus = (id: string, status: ActionStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const pendingCount = aiRecommendations.length - Object.values(statuses).filter((s) => s !== 'pending').length;
  const doneCount = Object.values(statuses).filter((s) => s === 'done').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001845] to-[#003B7A] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Action Center</h2>
              <p className="text-sm text-white/50">Follow-ups, pricing approvals, promotions & customer actions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10 text-center">
              <p className="text-xl font-bold text-white">{pendingCount}</p>
              <p className="text-xs text-white/50">Pending</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/10 text-center">
              <p className="text-xl font-bold text-success-400">{doneCount}</p>
              <p className="text-xs text-white/50">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations as Actions */}
      <div>
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">AI-Recommended Actions</h3>
        <div className="space-y-3">
          {aiRecommendations.map((rec) => {
            const status = statuses[rec.id] || 'pending';
            return (
              <div
                key={rec.id}
                className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${
                  status === 'done' ? 'border-success-200 opacity-60' :
                  status === 'dismissed' ? 'border-neutral-100 opacity-40' :
                  'border-neutral-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        rec.priority === 'High' ? 'bg-error-100 text-error-700' :
                        rec.priority === 'Medium' ? 'bg-warning-100 text-warning-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>{rec.priority}</span>
                      <span className="text-xs text-neutral-400">{rec.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-primary-900">{rec.insight}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      <span className="font-medium">Impact:</span> {rec.impact} · <span className="font-medium">Action:</span> <span className="text-accent-700">{rec.action}</span>
                    </p>
                  </div>
                  {status === 'pending' ? (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateStatus(rec.id, 'done')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-success-600 text-white text-xs font-bold rounded-lg hover:bg-success-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Done
                      </button>
                      <button
                        onClick={() => updateStatus(rec.id, 'dismissed')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white text-neutral-500 text-xs font-bold rounded-lg border border-neutral-200 hover:border-error-400 hover:text-error-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      {status === 'done' && (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-success-600">
                          <CheckCircle2 className="w-4 h-4" /> Completed
                        </span>
                      )}
                      {status === 'dismissed' && (
                        <button onClick={() => updateStatus(rec.id, 'pending')} className="text-xs text-neutral-400 hover:text-accent-600 underline">
                          Undo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer follow-ups */}
      <div>
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Customer Follow-Ups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customerOpportunities.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-primary-900">{c.name}</p>
                  <p className="text-xs text-neutral-400">{c.company} · {c.region}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  c.status === 'Closing' ? 'bg-success-100 text-success-700' :
                  c.status === 'Negotiation' ? 'bg-warning-100 text-warning-700' :
                  'bg-neutral-100 text-neutral-600'
                }`}>{c.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                <span>Product: {c.product}</span>
                <span>Deal: {formatRM(c.dealValue)}</span>
                <span>Prob: {c.probability}%</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-[#003B7A] text-white text-xs font-bold rounded-lg hover:bg-[#002b5c] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white text-primary-700 text-xs font-bold rounded-lg border border-neutral-200 hover:border-accent-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <span className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400">
                  <Clock className="w-3.5 h-3.5" /> {c.lastContact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing approvals */}
      <div>
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Pricing Approvals Pending</h3>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Current</th>
                  <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Recommended</th>
                  <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Expected Margin</th>
                  <th className="text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.filter((p) => p.recommendedPrice !== p.currentPrice).map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-primary-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-sm text-neutral-600 text-right">RM {p.currentPrice.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-accent-700 text-right">RM {p.recommendedPrice.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-success-600 font-semibold text-right">{p.expectedMargin}%</td>
                    <td className="px-5 py-3.5 text-center">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-600 text-white text-xs font-bold rounded-lg hover:bg-success-700 transition-colors">
                        <DollarSign className="w-3.5 h-3.5" /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active promotions */}
      <div>
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Active & Suggested Promotions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-xl p-5 border border-accent-200">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-accent-600" />
              <p className="text-sm font-bold text-accent-800">5% Promo — Women Sandals</p>
            </div>
            <p className="text-xs text-neutral-600">Boost declining demand. Expected +12% sales velocity.</p>
            <button className="mt-3 w-full py-2 bg-accent-600 text-white text-xs font-bold rounded-lg hover:bg-accent-700 transition-colors">Launch</button>
          </div>
          <div className="bg-gradient-to-br from-success-50 to-success-100/50 rounded-xl p-5 border border-success-200">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-success-600" />
              <p className="text-sm font-bold text-success-800">Bundle — Blazer + Belt</p>
            </div>
            <p className="text-xs text-neutral-600">Cross-sell opportunity. 23% attach rate expected.</p>
            <button className="mt-3 w-full py-2 bg-success-600 text-white text-xs font-bold rounded-lg hover:bg-success-700 transition-colors">Launch</button>
          </div>
          <div className="bg-gradient-to-br from-warning-50 to-warning-100/50 rounded-xl p-5 border border-warning-200">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-warning-600" />
              <p className="text-sm font-bold text-warning-800">10% Off — Brown Formal Pant</p>
            </div>
            <p className="text-xs text-neutral-600">Clear excess inventory (210 units). Competitor priced lower.</p>
            <button className="mt-3 w-full py-2 bg-warning-600 text-white text-xs font-bold rounded-lg hover:bg-warning-700 transition-colors">Launch</button>
          </div>
        </div>
      </div>
    </div>
  );
}
