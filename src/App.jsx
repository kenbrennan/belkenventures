import { useState } from 'react'

const BRAND_BLUE = '#3b63f7'
const BRAND_BLUE_LIGHT = '#608bfb'

function BelKenLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="BelKen AI logo">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#608bfb" />
          <stop offset="100%" stopColor="#3b63f7" />
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path d="M24 3 L42 11 L42 26 C42 35 34 42.5 24 46 C14 42.5 6 35 6 26 L6 11 Z" fill="url(#logoGrad)" />
      {/* Bolt */}
      <path d="M26 14 L18 26 H24 L22 34 L30 22 H24 Z" fill="white" />
    </svg>
  )
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BelKenLogo size={32} />
          <span className="text-white font-bold text-lg tracking-tight">
            Belken<span style={{ color: BRAND_BLUE_LIGHT }}>AI</span>
          </span>
        </div>
        <a
          href="mailto:info@belkenventures.com"
          className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
        >
          info@belkenventures.com
        </a>
      </div>
    </nav>
  )
}

function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('info@belkenventures.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${BRAND_BLUE}22 0%, transparent 70%)` }}
      />

      {/* Logo */}
      <div className="mb-8 animate-fade-in" style={{ animationDelay: '0ms' }}>
        <BelKenLogo size={72} />
      </div>

      {/* Wordmark */}
      <div className="mb-4 animate-fade-in" style={{ animationDelay: '80ms' }}>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
          Belken<span style={{ color: BRAND_BLUE_LIGHT }}>AI</span>
        </h1>
      </div>

      {/* Positioning line */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: '160ms' }}>
        <p className="text-xl sm:text-2xl font-medium" style={{ color: BRAND_BLUE_LIGHT }}>
          AI COO-as-a-Service
        </p>
      </div>

      {/* Value prop */}
      <div className="max-w-xl mb-10 animate-fade-in" style={{ animationDelay: '240ms' }}>
        <p className="text-base sm:text-lg text-white/60 leading-relaxed">
          We build AI-powered operating systems for growing businesses — automating operations,
          content, outreach, and scheduling so you can focus on what actually moves the needle.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: '320ms' }}>
        <a
          href="mailto:info@belkenventures.com?subject=I'm interested in BelKenAI"
          className="px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black"
          style={{ background: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${BRAND_BLUE_LIGHT} 100%)`, focusRingColor: BRAND_BLUE }}
        >
          Book a Strategy Call →
        </a>
        <button
          onClick={handleCopy}
          className="px-8 py-3.5 rounded-xl font-semibold text-white/70 text-sm border border-white/10 hover:border-white/30 hover:text-white transition-all duration-200 focus:outline-none"
        >
          {copied ? '✓ Copied!' : 'info@belkenventures.com'}
        </button>
      </div>

      {/* Pill badge */}
      <div className="mt-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border"
          style={{ borderColor: `${BRAND_BLUE}44`, color: BRAND_BLUE_LIGHT, background: `${BRAND_BLUE}11` }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: BRAND_BLUE_LIGHT }} />
          Now accepting new clients — limited capacity
        </div>
      </div>
    </section>
  )
}

function Features() {
  const items = [
    {
      icon: '⚡',
      title: 'Autonomous Operations',
      desc: 'AI agents handle scheduling, follow-ups, content creation, and reporting — around the clock.',
    },
    {
      icon: '📈',
      title: 'Revenue Automation',
      desc: 'Lead reactivation, outreach sequences, and sales pipelines that run without your attention.',
    },
    {
      icon: '🔧',
      title: 'Built on Your Stack',
      desc: 'We deploy inside your existing tools — not another dashboard to manage.',
    },
  ]
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-6">
          {items.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-300"
              style={{ background: '#0f0f1a' }}
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
        <div className="flex items-center gap-2">
          <BelKenLogo size={18} />
          <span>© 2026 Belken Ventures Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://www.linkedin.com/company/belken-ventures"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:info@belkenventures.com"
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0f', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Nav />
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}
