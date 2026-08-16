import {
  DollarSign, Target, TrendingUp, Package, ShoppingCart, BarChart3,
  AlertCircle, ArrowUpRight, ArrowDownRight, Bot, ChevronRight,
} from 'lucide-react';
import {
  executiveSummary, aiRecommendations, topSellingProducts, slowMovingProducts,
  forecastData, monthlyRevenue, formatRM,
} from '../../data/sellerData';
import { useNavigate } from 'react-router-dom';

export default function SellerHome() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Revenue', value: formatRM(executiveSummary.totalRevenue), icon: DollarSign, trend: '+14%', trendUp: true, color: 'accent' },
    { label: 'Units Sold', value: executiveSummary.unitsSold.toLocaleString(), icon: Package, trend: '+8%', trendUp: true, color: 'primary' },
    { label: 'Orders Closed', value: executiveSummary.ordersClosed.toString(), icon: ShoppingCart, trend: '+12%', trendUp: true, color: 'success' },
    { label: 'Avg. Selling Price', value: formatRM(executiveSummary.avgSellingPrice), icon: BarChart3, trend: '+3%', trendUp: true, color: 'gold' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero summary */}
      <div className="bg-gradient-to-br from-[#001845] to-[#003B7A] rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm text-white/60 mb-1">Welcome back, Tyson</p>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Executive Overview</h2>
            <p className="text-sm text-white/50 max-w-md">Your AI-powered command center for real-time sales visibility, forecasting, and actionable recommendations.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/60 mb-1">Target vs Actual</p>
              <p className="text-2xl font-bold text-white">{executiveSummary.achievement}%</p>
              <p className="text-xs text-gold-300 mt-1">{formatRM(executiveSummary.totalRevenue)} / {formatRM(executiveSummary.totalTarget)}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/60 mb-1">Forecast</p>
              <p className="text-2xl font-bold text-white">{formatRM(executiveSummary.forecast)}</p>
              <p className="text-xs text-gold-300 mt-1">Confidence: {executiveSummary.forecastConfidence}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-50`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.trendUp ? 'text-success-600' : 'text-error-600'}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-primary-900">{stat.value}</p>
              <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Margin & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-accent-600" />
            <p className="text-sm font-semibold text-primary-900">Gross Margin</p>
          </div>
          <p className="text-3xl font-bold text-primary-900">{executiveSummary.margin}%</p>
          <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-success-500 rounded-full" style={{ width: `${executiveSummary.margin * 2}%` }} />
          </div>
          <p className="text-xs text-neutral-400 mt-2">Target: 30%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-accent-600" />
            <p className="text-sm font-semibold text-primary-900">Pipeline Value</p>
          </div>
          <p className="text-3xl font-bold text-primary-900">{formatRM(executiveSummary.pipelineValue)}</p>
          <p className="text-xs text-neutral-400 mt-2">{executiveSummary.openOpportunities} open opportunities</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-accent-600" />
            <p className="text-sm font-semibold text-primary-900">AI Forecast (30-day)</p>
          </div>
          <p className="text-3xl font-bold text-primary-900">{formatRM(forecastData[0].forecast)}</p>
          <p className="text-xs text-success-600 mt-2">+{forecastData[0].growth}% expected growth</p>
        </div>
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-primary-900">Revenue vs Target Trend</h3>
          <button onClick={() => navigate('/seller/dashboard/performance')} className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <RevenueChart />
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
            <Bot className="w-4 h-4 text-accent-600" />
          </div>
          <h3 className="font-display text-lg font-bold text-primary-900">AI Recommendation Center</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-3 pr-4">AI Insight</th>
                <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-3 pr-4">Business Impact</th>
                <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-3 pr-4">Recommended Action</th>
                <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider pb-3">Priority</th>
              </tr>
            </thead>
            <tbody>
              {aiRecommendations.map((rec) => (
                <tr key={rec.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="text-sm text-primary-900 py-3.5 pr-4">{rec.insight}</td>
                  <td className="text-sm text-neutral-600 py-3.5 pr-4">{rec.impact}</td>
                  <td className="text-sm text-accent-700 font-medium py-3.5 pr-4">{rec.action}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      rec.priority === 'High' ? 'bg-error-100 text-error-700' :
                      rec.priority === 'Medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {rec.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top & Slow products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-4 h-4 text-success-600" />
            <h3 className="font-display text-base font-bold text-primary-900">Top-Selling Products</h3>
          </div>
          <div className="space-y-3">
            {topSellingProducts.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-success-100 text-success-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.unitsSold} units · {p.salesVelocity.toFixed(1)}/wk velocity</p>
                </div>
                <p className="text-sm font-bold text-primary-900">{formatRM(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-error-500" />
            <h3 className="font-display text-base font-bold text-primary-900">Slow-Moving Products</h3>
          </div>
          <div className="space-y-3">
            {slowMovingProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-error-100 text-error-600 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">{p.name}</p>
                  <p className="text-xs text-neutral-400">{p.unitsSold} units · {p.salesVelocity.toFixed(1)}/wk velocity · {p.inventory} in stock</p>
                </div>
                <p className="text-sm font-bold text-error-600">{formatRM(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...monthlyRevenue.map((d) => Math.max(d.revenue, d.target)));
  return (
    <div className="flex items-end justify-between gap-2 h-48">
      {monthlyRevenue.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-end justify-center gap-1 h-40">
            <div
              className="w-1/2 max-w-[20px] bg-accent-500 rounded-t-md transition-all hover:bg-accent-600 relative group"
              style={{ height: `${(d.revenue / max) * 100}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-accent-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatRM(d.revenue)}
              </span>
            </div>
            <div
              className="w-1/2 max-w-[20px] bg-neutral-200 rounded-t-md transition-all"
              style={{ height: `${(d.target / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-neutral-400">{d.month}</span>
        </div>
      ))}
    </div>
  );
}
