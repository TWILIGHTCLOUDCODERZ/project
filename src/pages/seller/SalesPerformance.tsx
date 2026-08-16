import { useState } from 'react';
import { ChevronRight, MapPin, Users, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { products, salesByRegion, customerOpportunities, formatRM } from '../../data/sellerData';

type DrillLevel = 'portfolio' | 'product' | 'region' | 'customer';

export default function SalesPerformance() {
  const [level, setLevel] = useState<DrillLevel>('portfolio');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    { label: 'Portfolio', onClick: () => { setLevel('portfolio'); setSelectedProduct(null); setSelectedRegion(null); } },
  ];
  if (level === 'product' || level === 'region' || level === 'customer') {
    if (selectedProduct) breadcrumbs.push({ label: products.find((p) => p.id === selectedProduct)?.name || 'Product', onClick: () => { setLevel('product'); setSelectedRegion(null); } });
    if (selectedRegion) breadcrumbs.push({ label: selectedRegion });
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((bc, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            {bc.onClick ? (
              <button onClick={bc.onClick} className="text-accent-600 hover:text-accent-700 font-medium">{bc.label}</button>
            ) : (
              <span className="text-neutral-600 font-medium">{bc.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />}
          </span>
        ))}
      </div>

      {/* Drill-down tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['portfolio', 'product', 'region', 'customer'] as DrillLevel[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => { setLevel(lvl); setSelectedProduct(null); setSelectedRegion(null); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              level === lvl ? 'bg-[#003B7A] text-white shadow-md' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {lvl === 'portfolio' ? 'Portfolio' : lvl === 'product' ? 'By Product' : lvl === 'region' ? 'By Region' : 'By Customer'}
          </button>
        ))}
      </div>

      {/* Portfolio view */}
      {level === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SummaryCard icon={Package} label="Total Products" value={products.length.toString()} />
          <SummaryCard icon={TrendingUp} label="Total Revenue" value={formatRM(products.reduce((s, p) => s + p.revenue, 0))} />
          <SummaryCard icon={Users} label="Active Customers" value={customerOpportunities.length.toString()} />
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Product</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Units</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Revenue</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Avg Price</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Disc.</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Margin</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Velocity</th>
                    <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Inventory</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => { setSelectedProduct(p.id); setLevel('product'); }}
                      className="border-b border-neutral-50 hover:bg-accent-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-primary-900">{p.name}</td>
                      <td className="px-5 py-3.5 text-sm text-neutral-600 text-right">{p.unitsSold}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-primary-900 text-right">{formatRM(p.revenue)}</td>
                      <td className="px-5 py-3.5 text-sm text-neutral-600 text-right">RM {p.avgSellingPrice.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-neutral-600 text-right">{p.discount}%</td>
                      <td className="px-5 py-3.5 text-sm text-right">
                        <span className={`font-semibold ${p.margin >= 20 ? 'text-success-600' : 'text-warning-600'}`}>{p.margin}%</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-neutral-600 text-right">{p.salesVelocity.toFixed(1)}/wk</td>
                      <td className="px-5 py-3.5 text-sm text-right">
                        <span className={p.inventory < 30 ? 'text-error-600 font-semibold' : 'text-neutral-600'}>{p.inventory}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product drill-down */}
      {level === 'product' && (
        <ProductDrillDown
          productId={selectedProduct}
          onSelectProduct={(id) => setSelectedProduct(id)}
          onSelectRegion={(region) => { setSelectedRegion(region); }}
        />
      )}

      {/* Region view */}
      {level === 'region' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salesByRegion.map((r) => (
              <div key={r.region} className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-accent-600" />
                  <p className="text-sm font-bold text-primary-900">{r.region}</p>
                </div>
                <p className="text-2xl font-bold text-primary-900">{formatRM(r.revenue)}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-neutral-400">{r.units} units</span>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${r.growth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {r.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {r.growth >= 0 ? '+' : ''}{r.growth}%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Target: {formatRM(r.target)}</span>
                    <span>{Math.round((r.revenue / r.target) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.revenue >= r.target ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: `${Math.min((r.revenue / r.target) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer view */}
      {level === 'customer' && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Region</th>
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Deal Value</th>
                  <th className="text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Probability</th>
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {customerOpportunities.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-primary-900">{c.name}</td>
                    <td className="px-5 py-3.5 text-sm text-neutral-600">{c.company}</td>
                    <td className="px-5 py-3.5 text-sm text-neutral-600">{c.region}</td>
                    <td className="px-5 py-3.5 text-sm text-neutral-600">{c.product}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-primary-900 text-right">{formatRM(c.dealValue)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-sm font-semibold ${c.probability >= 70 ? 'text-success-600' : c.probability >= 50 ? 'text-warning-600' : 'text-error-600'}`}>{c.probability}%</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        c.status === 'Closing' ? 'bg-success-100 text-success-700' :
                        c.status === 'Negotiation' ? 'bg-warning-100 text-warning-700' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-neutral-400">{c.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
      <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-accent-600" />
      </div>
      <p className="text-2xl font-bold text-primary-900">{value}</p>
      <p className="text-xs text-neutral-400 mt-1">{label}</p>
    </div>
  );
}

function ProductDrillDown({ productId, onSelectProduct, onSelectRegion }: {
  productId: string | null;
  onSelectProduct: (id: string) => void;
  onSelectRegion: (region: string) => void;
}) {
  const product = products.find((p) => p.id === productId) || products[0];
  const maxTrend = Math.max(...product.trend);

  return (
    <div className="space-y-4">
      {/* Product selector */}
      <div className="flex gap-2 flex-wrap">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProduct(p.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              product.id === p.id ? 'bg-accent-600 text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h3 className="font-display text-lg font-bold text-primary-900 mb-4">{product.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Units Sold" value={product.unitsSold.toString()} />
            <DetailItem label="Revenue" value={formatRM(product.revenue)} />
            <DetailItem label="Selling Price" value={`RM ${product.avgSellingPrice.toLocaleString()}`} />
            <DetailItem label="Discount" value={`${product.discount}%`} />
            <DetailItem label="Margin" value={`${product.margin}%`} />
            <DetailItem label="Inventory" value={`${product.inventory} units`} />
            <DetailItem label="Sales Velocity" value={`${product.salesVelocity.toFixed(1)}/wk`} />
            <DetailItem label="Customer Demand" value={product.customerDemand} />
            <DetailItem label="Competitor Price" value={`RM ${product.competitorPrice.toLocaleString()}`} />
            <DetailItem label="Current Price" value={`RM ${product.currentPrice.toLocaleString()}`} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
          <h3 className="font-display text-base font-bold text-primary-900 mb-4">Historical Trend (6 months)</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {product.trend.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full max-w-[28px] bg-accent-500 rounded-t-md hover:bg-accent-600 transition-colors relative group"
                  style={{ height: `${(val / maxTrend) * 100}%` }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-accent-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">M{idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 mb-2">Regional breakdown</p>
            <div className="space-y-2">
              {salesByRegion.slice(0, 3).map((r) => (
                <button
                  key={r.region}
                  onClick={() => onSelectRegion(r.region)}
                  className="w-full flex items-center justify-between text-sm hover:bg-neutral-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <span className="text-neutral-600">{r.region}</span>
                  <span className="font-semibold text-primary-900">{formatRM(r.revenue)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-primary-900">{value}</p>
    </div>
  );
}
