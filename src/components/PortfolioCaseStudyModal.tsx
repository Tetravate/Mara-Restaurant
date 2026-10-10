import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, Zap } from 'lucide-react';

interface PortfolioCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioCaseStudyModal: React.FC<PortfolioCaseStudyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ux' | 'visual' | 'tech'>('overview');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-sand-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-charcoal-950 text-sand-50 p-6 sm:p-8 border-b border-charcoal-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-terracotta-500/20 text-terracotta-400 border border-terracotta-500/40 text-[10px] font-bold uppercase tracking-wider">
                Self-Initiated Concept · 2026
              </span>
              <span className="text-xs text-sand-400">
                Tetravate Studio Case Study
              </span>
            </div>
            <h2 id="case-study-title" className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 tracking-tight">
              Restaurant Digital Experience
            </h2>
            <p className="text-xs sm:text-sm text-sand-300 mt-1 max-w-2xl">
              Designing a restaurant website that makes discovering food, understanding the atmosphere, and requesting a table effortless.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-sand-400 hover:text-sand-50 rounded-full hover:bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            aria-label="Close Case Study"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-sand-100 border-b border-sand-200 px-6 flex items-center gap-4 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Executive Overview & Problem' },
            { id: 'ux', label: '2. UX Strategy & The 8–80 Principle' },
            { id: 'visual', label: '3. Brand Identity & Design System' },
            { id: 'tech', label: '4. Tech Stack & Accessibility' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === tab.id
                  ? 'border-terracotta-500 text-terracotta-600 font-bold'
                  : 'border-transparent text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-charcoal-800 text-sm leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                  The Problem with Traditional Restaurant Websites
                </h3>
                <p className="text-charcoal-700">
                  Most restaurant websites fall into two extremes: either generic templates cluttered with heavy animations, neon gradients, and slow PDF downloads, or overly complex booking software that intimidates first-time visitors. Users struggle to find basic facts: <em>When are you open? What food do you serve? What are the prices? How do I get there?</em>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-red-50/70 border border-red-200 p-4 rounded-lg">
                  <p className="font-bold text-red-900 text-xs uppercase tracking-wider mb-1">Common Pitfalls</p>
                  <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                    <li>Unreadable multi-megabyte PDF menus on mobile</li>
                    <li>Hidden opening hours and confusing locations</li>
                    <li>Deceptive "instant booking" claims without real confirmation</li>
                    <li>Flashy animations that slow page load and drain battery</li>
                  </ul>
                </div>

                <div className="bg-sage-50/70 border border-sage-200 p-4 rounded-lg">
                  <p className="font-bold text-sage-900 text-xs uppercase tracking-wider mb-1">The MĀRA Solution</p>
                  <ul className="list-disc list-inside text-xs text-sage-800 space-y-1">
                    <li>Instant live web menu with search and dietary filters</li>
                    <li>Essential hours & location placed immediately in the viewport</li>
                    <li>Honest, transparent "Reservation Request" with WhatsApp handoff</li>
                    <li>Subtle editorial motion adhering to accessibility standards</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-900 mb-2">
                  The Visitor Journey Architecture
                </h3>
                <p className="text-xs text-charcoal-600 mb-3">
                  The UX follows a strictly structured decision funnel:
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-sand-100 p-3.5 rounded-lg border border-sand-200">
                  <span className="font-bold text-charcoal-900">Discover</span>
                  <span className="text-charcoal-400">→</span>
                  <span className="font-bold text-charcoal-900">Explore (Menu & Finder)</span>
                  <span className="text-charcoal-400">→</span>
                  <span className="font-bold text-charcoal-900">Desire (Atmosphere & Story)</span>
                  <span className="text-charcoal-400">→</span>
                  <span className="font-bold text-charcoal-900">Decide</span>
                  <span className="text-charcoal-400">→</span>
                  <span className="font-bold text-terracotta-600">Reserve / WhatsApp</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ux' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                  The 8-to-80 UX Principle
                </h3>
                <p className="text-charcoal-700">
                  If an 8-year-old can intuitively browse the signature dishes and an 80-year-old can comfortably read the typography, tap buttons with ease, and find opening hours without frustration, the user experience is a success.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                  <Zap className="w-5 h-5 text-terracotta-600 mb-2" />
                  <h4 className="font-bold text-charcoal-900 text-xs mb-1">Find Your Dish</h4>
                  <p className="text-xs text-charcoal-600">
                    A distinctive preference tool allowing users to combine moods (e.g. Vegetarian + Comfort + Under ₹400) with instant, non-AI rule transparency.
                  </p>
                </div>

                <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                  <Smartphone className="w-5 h-5 text-terracotta-600 mb-2" />
                  <h4 className="font-bold text-charcoal-900 text-xs mb-1">WhatsApp Contextual Bridge</h4>
                  <p className="text-xs text-charcoal-600">
                    Pre-fills deep-links for general questions, specific dish inquiries, private dining, or reservation handoff without manual typing.
                  </p>
                </div>

                <div className="bg-sand-50 p-4 rounded-lg border border-sand-200">
                  <CheckCircle className="w-5 h-5 text-terracotta-600 mb-2" />
                  <h4 className="font-bold text-charcoal-900 text-xs mb-1">Honest Reservation Model</h4>
                  <p className="text-xs text-charcoal-600">
                    Avoids deceptive "confirmed" states when no backend PMS is integrated. Sets truthful expectations while speeding up host communication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                  Quiet Confidence: Visual Identity & Typography
                </h3>
                <p className="text-charcoal-700">
                  Rather than copying Tetravate's studio colors or generic five-star hotel tropes, MĀRA was given its own bespoke visual voice inspired by the soil, spices, and brass cookware of the Kongu region.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Color System</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
                    <div className="w-full h-8 rounded bg-[#FAF8F5] border border-sand-300 mb-2" />
                    <strong className="block text-charcoal-900">Warm Sand</strong>
                    <span className="text-charcoal-500">#FAF8F5 (Canvas)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
                    <div className="w-full h-8 rounded bg-[#1B1714] mb-2" />
                    <strong className="block text-charcoal-900">Charcoal Clove</strong>
                    <span className="text-charcoal-500">#1B1714 (Type/Dark)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
                    <div className="w-full h-8 rounded bg-[#C45B28] mb-2" />
                    <strong className="block text-charcoal-900">Sunlit Terracotta</strong>
                    <span className="text-charcoal-500">#C45B28 (Primary CTA)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
                    <div className="w-full h-8 rounded bg-[#D49B44] mb-2" />
                    <strong className="block text-charcoal-900">Muted Saffron</strong>
                    <span className="text-charcoal-500">#D49B44 (Accent)</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">Typography Hierarchy</p>
                <p className="text-xs text-charcoal-600">
                  <strong>Playfair Display & Cormorant:</strong> Editorial serif for headings communicating heritage and quiet luxury.<br />
                  <strong>Plus Jakarta Sans:</strong> Humanist, geometric sans-serif for UI, prices, navigation, and effortless legibility across all screen sizes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                  Technical Architecture & Accessibility
                </h3>
                <p className="text-charcoal-700">
                  Built as a blazing-fast, semantic single-page application with zero bloatware or heavy framework overhead.
                </p>
              </div>

              <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Core:</strong> React 18 + TypeScript</div>
                  <div><strong>Styling:</strong> Tailwind CSS + Design Tokens</div>
                  <div><strong>Build Tool:</strong> Vite 6 (sub-second HMR)</div>
                  <div><strong>Icons:</strong> Lucide React (accessible SVG)</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider mb-2">
                  Accessibility & SEO Checklist
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>Semantic HTML5 (`main`, `header`, `section`, `nav`)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>WCAG AA compliant contrast (4.5:1 minimum)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>Full keyboard navigation & visible focus rings</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>Schema.org Local Restaurant JSON-LD metadata</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>Respects `prefers-reduced-motion`</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-sage-600" />
                    <span>Responsive from 320px to 2560px ultra-wide</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-sand-100 p-4 sm:p-6 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-charcoal-900">TETRAVATE</span>
            <span className="text-charcoal-400">•</span>
            <span className="text-charcoal-600">From Thought to Thing.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-sand-50 font-semibold rounded text-xs transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
