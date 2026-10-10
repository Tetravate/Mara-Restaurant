import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, Zap } from 'lucide-react';

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ux' | 'visual' | 'tech'>('overview');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-dark-950/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div className="relative w-full max-w-4xl bg-dark-900 rounded-3xl shadow-2xl border border-dark-700/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-dark-950 text-ivory-100 p-6 sm:p-8 border-b border-dark-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider font-mono">
                Self-Initiated Concept · 2026
              </span>
              <span className="text-xs text-stone-400">
                Tetravate Studio Case Study
              </span>
            </div>
            <h2 id="case-study-title" className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100 tracking-tight">
              MĀRA: Luxury Restaurant Experience
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
              Designing an art-directed, dark luxury digital experience that makes discovering food, exploring dining spaces, and requesting reservations effortless.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-ivory-100 rounded-xl hover:bg-dark-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close Case Study"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-dark-950/80 border-b border-dark-800 px-6 flex items-center gap-6 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'overview', label: '1. Executive Overview & Strategy' },
            { id: 'ux', label: '2. UX & The 8-to-80 Principle' },
            { id: 'visual', label: '3. Dark Luxury Design System' },
            { id: 'tech', label: '4. Tech Architecture & A11y' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400 font-bold'
                  : 'border-transparent text-stone-400 hover:text-ivory-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-stone-300 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory-100 mb-2">
                  The Problem with Traditional Restaurant Websites
                </h3>
                <p className="text-stone-300">
                  Most restaurant websites fall into two extremes: either generic single-page templates cluttered with heavy unoptimized animations and slow PDF downloads, or impersonal booking systems that intimidate first-time visitors. Users struggle to find basic facts: <em>When are you open? What food do you serve? What are the prices? How do I get there?</em>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-2xl">
                  <p className="font-bold text-red-400 text-xs uppercase tracking-wider mb-1.5 font-mono">[ Common Pitfalls ]</p>
                  <ul className="list-disc list-inside text-xs text-stone-400 space-y-1">
                    <li>Unreadable multi-megabyte PDF menus on mobile</li>
                    <li>Hidden opening hours and ambiguous locations</li>
                    <li>Deceptive instant booking claims without host verification</li>
                    <li>Generic bootstrap template aesthetics</li>
                  </ul>
                </div>

                <div className="bg-amber-950/30 border border-amber-900/60 p-4 rounded-2xl">
                  <p className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-1.5 font-mono">[ The MĀRA Solution ]</p>
                  <ul className="list-disc list-inside text-xs text-stone-400 space-y-1">
                    <li>Multi-page art-directed architecture with deep URLs</li>
                    <li>Instant live web menu with search and dietary filters</li>
                    <li>Transparent Reservation Request with WhatsApp verification</li>
                    <li>Dark luxury editorial composition with bracket motifs</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-ivory-100 mb-2">
                  The Decision Funnel Architecture
                </h3>
                <p className="text-xs text-stone-400 mb-3">
                  The UX follows a strictly structured decision funnel:
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-dark-950 p-4 rounded-2xl border border-dark-800 text-stone-300">
                  <span className="font-bold text-ivory-100">Discover</span>
                  <span className="text-amber-500">→</span>
                  <span className="font-bold text-ivory-100">Explore (Menu & Food)</span>
                  <span className="text-amber-500">→</span>
                  <span className="font-bold text-ivory-100">Desire (Atmosphere & Story)</span>
                  <span className="text-amber-500">→</span>
                  <span className="font-bold text-ivory-100">Decide</span>
                  <span className="text-amber-500">→</span>
                  <span className="font-bold text-amber-400">Reserve / WhatsApp</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ux' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory-100 mb-2">
                  The 8 to 80 UX Principle
                </h3>
                <p className="text-stone-300">
                  If an 8-year-old can intuitively browse the signature dishes and an 80-year-old can comfortably read the typography, tap buttons with ease, and find opening hours without frustration, the user experience is a success.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-2">
                  <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-amber-500 w-fit">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-ivory-100 text-xs">Editorial List Menu</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Structured rows with dietary badges, exact prices in ₹, key ingredients, and instant search instead of generic card grids.
                  </p>
                </div>

                <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-2">
                  <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-amber-500 w-fit">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-ivory-100 text-xs">WhatsApp Contextual Bridge</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Pre-fills deep-links for general questions, specific dish inquiries, private dining, or reservation handoff without manual typing.
                  </p>
                </div>

                <div className="bg-dark-950/80 p-5 rounded-2xl border border-dark-800 space-y-2">
                  <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700 text-amber-500 w-fit">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-ivory-100 text-xs">Honest Reservation Model</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Avoids deceptive "instant confirmation" claims when no live PMS is connected. Sets truthful expectations while speeding up host communication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory-100 mb-2">
                  Quiet Confidence: Dark Luxury Visual Identity
                </h3>
                <p className="text-stone-300">
                  Rather than copying Tetravate studio branding or generic hotel tropes, MĀRA was given its own bespoke visual voice inspired by the dark charcoal handis, warm spices, and glowing amber lamps of contemporary fine dining.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">[ Color Palette ]</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
                    <div className="w-full h-8 rounded-lg bg-[#0B0B0A] border border-dark-700 mb-2" />
                    <strong className="block text-ivory-100">Dark Charcoal</strong>
                    <span className="text-stone-500">#0B0B0A (Canvas)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
                    <div className="w-full h-8 rounded-lg bg-[#181816] border border-dark-700 mb-2" />
                    <strong className="block text-ivory-100">Card Surface</strong>
                    <span className="text-stone-500">#181816 (Surface)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
                    <div className="w-full h-8 rounded-lg bg-[#D8893E] mb-2 shadow-glow-amber" />
                    <strong className="block text-ivory-100">Warm Amber</strong>
                    <span className="text-stone-500">#D8893E (CTA & Glow)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800">
                    <div className="w-full h-8 rounded-lg bg-[#FAF8F5] mb-2" />
                    <strong className="block text-ivory-100">Warm Ivory</strong>
                    <span className="text-stone-500">#FAF8F5 (Headlines)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono mb-2">[ Typography Hierarchy ]</p>
                <p className="text-xs text-stone-400">
                  <strong className="text-ivory-100">Playfair Display:</strong> Editorial serif for headlines communicating culinary heritage and quiet luxury.<br />
                  <strong className="text-ivory-100">Plus Jakarta Sans:</strong> Humanist, geometric sans-serif for UI, prices, navigation, and effortless legibility.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ivory-100 mb-2">
                  Technical Architecture and Performance
                </h3>
                <p className="text-stone-300">
                  Built as a multi-page routed application using React 18, React Router v7, and TypeScript with zero unnecessary runtime overhead.
                </p>
              </div>

              <div className="bg-dark-950 p-5 rounded-2xl border border-dark-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 text-stone-300">
                  <div><strong className="text-ivory-100">Core:</strong> React 18 + React Router + TypeScript</div>
                  <div><strong className="text-ivory-100">Styling:</strong> Tailwind CSS + Custom Tokens</div>
                  <div><strong className="text-ivory-100">Build Tool:</strong> Vite 6 (sub-second HMR)</div>
                  <div><strong className="text-ivory-100">Icons:</strong> Lucide React (accessible SVG)</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-amber-500 text-xs uppercase tracking-wider mb-2 font-mono">
                  [ Accessibility and Best Practices ]
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Semantic HTML5 (main, header, section, nav)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>WCAG AA compliant contrast on dark canvas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Full keyboard navigation & lightbox controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Schema.org Local Restaurant JSON-LD metadata</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Strictly zero em-dashes across all copy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Responsive from 320px to 2560px ultra-wide</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-dark-950 p-4 sm:p-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-ivory-100">TETRAVATE</span>
            <span className="text-dark-700">•</span>
            <span className="text-stone-400">From Thought to Thing.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-xl text-xs transition-colors shadow-glow-amber"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
