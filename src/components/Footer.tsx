import { Link } from 'react-router-dom';
import { Mail, MapPin, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#001233] text-white">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 rounded-full border-[1.5px] border-white/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gold-400" />
              </div>
              <div>
                <p className="text-[13px] font-bold tracking-tight text-white leading-none">TCC RAPTOR</p>
                <p className="text-[11px] font-light text-white/50 mt-0.5 leading-none">Try On Store</p>
              </div>
            </div>
            <p className="text-[13px] text-white/45 leading-relaxed">
              AI-powered fashion retail by TCC RAPTOR. Curated collections, intelligent styling.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-white/35">
              <Cpu className="w-3.5 h-3.5 text-gold-400/70 shrink-0" />
              <span>Gemini 3.1 Flash Lite Image</span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/40 mb-5">Collections</h4>
            <ul className="space-y-3.5">
              {[
                { to: '/women', label: 'Women' },
                { to: '/women?category=blazers', label: "Women's Blazers" },
                { to: '/women?category=formal-pants', label: 'Formal Pants' },
                { to: '/men', label: 'Men' },
                { to: '/men?category=blazers', label: "Men's Blazers" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/40 mb-5">Support</h4>
            <ul className="space-y-3.5">
              {['Size Guide', 'Returns & Exchanges', 'FAQ', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/40 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-400/60 shrink-0" />
                <span className="text-[13px] text-white/50 leading-relaxed">123 Fashion Avenue, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400/60 shrink-0" />
                <a href="mailto:care@tccraptortrystore.com" className="text-[13px] text-white/50 hover:text-white transition-colors">
                  care@tccraptortrystore.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[12px] text-white/30">
          &copy; {new Date().getFullYear()} TCC RAPTOR. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a href="#" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
