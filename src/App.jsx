import { useState, useEffect, useRef } from 'react'

function useInView() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target) }
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, isVisible]
}

function Section({ children, className = '' }) {
  const [ref, isVisible] = useInView()
  return (
    <section ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </section>
  )
}

const services = [
  { icon: '🔄', title: 'Lead Reactivation', desc: 'AI voice agents call your dead customer lists and book appointments. Turn forgotten leads into revenue — automatically.' },
  { icon: '📅', title: 'Scheduling & Intake', desc: 'Automated booking, patient intake, client onboarding. No more phone tag, no more missed appointments.' },
  { icon: '✍️', title: 'Content Engine', desc: 'Daily social posts, YouTube videos, blog articles — all AI-generated, brand-consistent, scheduled and posted.' },
  { icon: '📊', title: 'Operations Dashboard', desc: 'Real-time visibility into your business. Revenue tracking, task management, agent monitoring — one screen.' },
  { icon: '🤖', title: 'Multi-Agent Teams', desc: 'Specialized AI agents for research, sales, content, DevOps, and finance. Working 24/7 while you sleep.' },
  { icon: '🔒', title: 'Self-Hosted & Private', desc: 'Your data stays on your hardware. No cloud dependencies. Enterprise-grade security on your own infrastructure.' },
]

const products = [
  { name: 'AI Agency Starter Kit', price: '$49', url: 'https://belken.gumroad.com/l/nbkfs' },
  { name: 'AI COO Complete Bundle', price: '$97', url: 'https://belken.gumroad.com/l/tfoje' },
  { name: 'Self-Hosting Blueprint', price: '$49', url: 'https://belken.gumroad.com/l/eagzvz' },
  { name: 'AI Automation Engineer Kit', price: '$67', url: 'https://belken.gumroad.com/l/fbmcqy' },
  { name: 'Docker Deploy Kit', price: '$49', url: 'https://belken.gumroad.com/l/hxmuxf' },
  { name: 'n8n Workflow Pack', price: '$39', url: 'https://belken.gumroad.com/l/ycugwh' },
]

const results = [
  { metric: '24/7', label: 'Always On' },
  { metric: '$170', label: 'Per 10K Calls' },
  { metric: '14', label: 'AI Agents' },
  { metric: '5 min', label: 'Deploy Time' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold tracking-tight">Belken<span className="text-blue-400">AI</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#products" className="hover:text-white transition">Products</a>
            <a href="#book" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition">Book a Call</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[300px] bg-purple-600/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600/10 text-blue-400 border border-blue-600/20">
            AI-Powered Operations • Self-Hosted • Always On
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Your AI Chief Operating Officer.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Running 24/7.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Lead reactivation, scheduling, content, DevOps, and financial tracking — all automated by AI agents that never sleep. Built on your infrastructure. Under your control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#book" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105">
              Book a Free Discovery Call
            </a>
            <a href="https://belken.gumroad.com" target="_blank" rel="noopener" className="px-8 py-4 border border-white/10 hover:border-white/30 text-white font-semibold rounded-xl text-lg transition-all hover:scale-105">
              Browse Products →
            </a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <Section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((r, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">{r.metric}</div>
              <div className="text-sm text-gray-500">{r.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What We Automate</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Enterprise-grade AI operations, deployed on your hardware, managed by agents that learn your business.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-600/30 transition-all duration-300">
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-8">
          {[
            { step: '01', title: 'Discovery Call', desc: 'We learn your business, identify automation opportunities, and map your current pain points. 30 minutes. Free.' },
            { step: '02', title: 'Custom Build', desc: 'We deploy your AI COO — tailored agents, workflows, and dashboards built specifically for your operations.' },
            { step: '03', title: 'Launch & Scale', desc: 'Your AI team goes live. We monitor, optimize, and scale as your business grows. Monthly retainer keeps everything humming.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-6 items-start p-6 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-bold text-blue-600/40 shrink-0">{s.step}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PRODUCTS */}
      <Section id="products" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">DIY? Grab Our Toolkits</h2>
        <p className="text-gray-400 text-center mb-12">Production-ready systems you can deploy yourself. Same tools we use with our clients.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener" className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-600/30 hover:bg-white/[0.04] transition-all duration-300">
              <span className="font-medium">{p.name}</span>
              <span className="text-blue-400 font-bold">{p.price}</span>
            </a>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="https://belken.gumroad.com" target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 transition text-sm">
            View all products on Gumroad →
          </a>
        </div>
      </Section>

      {/* BOOK A CALL */}
      <Section id="book" className="max-w-4xl mx-auto px-6 py-20">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-600/20 p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Automate?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Book a free 30-minute discovery call. We'll map your automation opportunities and show you exactly what's possible.</p>
          <a href="https://calendly.com/belkenbot/free-30-min-discovery-call" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xl transition-all hover:scale-105">
            Book Your Free Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
          <p className="mt-4 text-sm text-gray-500">No commitment. No pressure. Just clarity.</p>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚡</span>
                <span className="font-bold">Belken<span className="text-blue-400">AI</span></span>
              </div>
              <p className="text-sm text-gray-500">AI COO-as-a-Service.<br />Built for businesses that want to scale without hiring.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="https://belken.gumroad.com" target="_blank" rel="noopener" className="block hover:text-white transition">Gumroad Store</a>
                <a href="https://calendly.com/belkenbot/free-30-min-discovery-call" target="_blank" rel="noopener" className="block hover:text-white transition">Book a Call</a>
                <a href="mailto:info@belkenventures.com" className="block hover:text-white transition">info@belkenventures.com</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="https://x.com/LucyBelkenAI" target="_blank" rel="noopener" className="block hover:text-white transition">𝕏 @LucyBelkenAI</a>
                <a href="https://linkedin.com/company/belken-enterprise" target="_blank" rel="noopener" className="block hover:text-white transition">LinkedIn</a>
                <a href="https://youtube.com/@LucyBelKenAI" target="_blank" rel="noopener" className="block hover:text-white transition">YouTube</a>
                <a href="https://tiktok.com/@lucybelkenai" target="_blank" rel="noopener" className="block hover:text-white transition">TikTok</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
            © 2026 Belken Ventures Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Bottom spacer for mobile sticky CTA */}
      <div className="h-20 md:hidden" />

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-[60] p-4 bg-[#0a0a0f]/95 backdrop-blur-lg border-t border-white/5">
        <a href="https://calendly.com/belkenbot/free-30-min-discovery-call" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-blue-600 active:bg-blue-700 text-white font-bold rounded-xl text-center text-lg touch-manipulation">
          Book Free Discovery Call
        </a>
      </div>
    </div>
  )
}
