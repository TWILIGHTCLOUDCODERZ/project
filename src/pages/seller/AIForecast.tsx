import { TrendingUp, Bot, Zap } from 'lucide-react';
import { forecastData, monthlyRevenue, products, formatRM } from '../../data/sellerData';

export default function AIForecast() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#001845] to-[#003B7A] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Bot className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white">AI Forecasting Engine</h2>
            <p className="text-sm text-white/50">Predictive sales forecasting powered by historical & current signals</p>
          </div>
        </div>
      </div>

      {/* Forecast cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecastData.map((f, idx) => (
          <div key={f.period} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-primary-900">{f.period}</p>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                idx === 0 ? 'bg-success-100 text-success-700' :
                idx === 1 ? 'bg-accent-100 text-accent-700' :
                'bg-warning-100 text-warning-700'
              }`}>{f.confidence}% confidence</span>
            </div>
            <p className="text-3xl font-bold text-primary-900">{formatRM(f.forecast)}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-4 h-4 text-success-600" />
              <span className="text-sm font-semibold text-success-600">Expected growth: +{f.growth}%</span>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Main Drivers</p>
              <ul className="space-y-1.5">
                {f.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <Zap className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* AI Explanation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-accent-600" />
          <h3 className="font-display text-lg font-bold text-primary-900">AI Forecast Explanation</h3>
        </div>
        <div className="bg-accent-50/50 rounded-xl p-5 border border-accent-100">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <span className="font-bold text-primary-900">AI Forecast: {formatRM(forecastData[0].forecast)}</span>
            <br />
            <span className="text-success-600 font-semibold">Expected growth: +{forecastData[0].growth}%</span>
            <br /><br />
            <span className="font-semibold text-primary-900">Main drivers:</span> {forecastData[0].drivers.join(', ')}.
            <br /><br />
            The forecast model weighs the following signals: previous sales trends, seasonality patterns, product demand shifts, customer buying patterns, active promotions, discount levels, regional demand distribution, current inventory levels, open sales pipeline, and competitor market signals.
          </p>
        </div>
      </div>

      {/* Forecast signals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Forecast Input Signals</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Previous Sales', weight: 28, trend: 'up' },
            { label: 'Seasonality', weight: 18, trend: 'up' },
            { label: 'Product Demand', weight: 16, trend: 'up' },
            { label: 'Customer Patterns', weight: 12, trend: 'up' },
            { label: 'Promotions', weight: 8, trend: 'flat' },
            { label: 'Regional Demand', weight: 7, trend: 'up' },
            { label: 'Inventory Levels', weight: 6, trend: 'down' },
            { label: 'Competitor Signals', weight: 5, trend: 'down' },
          ].map((sig) => (
            <div key={sig.label} className="bg-neutral-50 rounded-lg p-3 border border-neutral-100">
              <p className="text-xs font-medium text-neutral-600 mb-1">{sig.label}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-900">{sig.weight}%</span>
                <span className={`text-xs font-semibold ${
                  sig.trend === 'up' ? 'text-success-600' : sig.trend === 'down' ? 'text-error-600' : 'text-neutral-400'
                }`}>
                  {sig.trend === 'up' ? '↑' : sig.trend === 'down' ? '↓' : '—'}
                </span>
              </div>
              <div className="mt-1.5 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full" style={{ width: `${sig.weight * 3}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical context */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Historical Revenue (9 months)</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {monthlyRevenue.map((d) => {
            const max = Math.max(...monthlyRevenue.map((m) => Math.max(m.revenue, m.target)));
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div className="w-1/2 max-w-[24px] bg-accent-500 rounded-t-md hover:bg-accent-600 transition-colors relative group" style={{ height: `${(d.revenue / max) * 100}%` }}>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-accent-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatRM(d.revenue)}
                    </span>
                  </div>
                  <div className="w-1/2 max-w-[24px] bg-neutral-200 rounded-t-md" style={{ height: `${(d.target / max) * 100}%` }} />
                </div>
                <span className="text-xs text-neutral-400">{d.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500"><span className="w-3 h-3 bg-accent-500 rounded" /> Actual Revenue</span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-500"><span className="w-3 h-3 bg-neutral-200 rounded" /> Target</span>
        </div>
      </div>

      {/* Per-product forecast */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <h3 className="font-display text-lg font-bold text-primary-900 mb-4">Per-Product Forecast (30-day)</h3>
        <div className="space-y-3">
          {products.map((p) => {
            const projected = Math.round(p.revenue * 1.12);
            return (
              <div key={p.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-400">Current: {formatRM(p.revenue)}</span>
                    <span className="text-xs text-neutral-300">→</span>
                    <span className="text-xs font-semibold text-success-600">Forecast: {formatRM(projected)}</span>
                  </div>
                </div>
                <div className="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-gradient-to-r from-accent-400 to-success-500 rounded-full" style={{ width: `${Math.min((projected / p.revenue) * 80, 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-success-600 w-12 text-right">+12%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
