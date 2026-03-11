import { useState, useEffect, useRef } from 'react'
import {
  Zap, Calendar, Users, FileText, Settings, ArrowRight,
  Check, ChevronDown, Menu, X, Mail, MapPin,
  TrendingUp, Shield, Play, Twitter, Youtube, Package, Wrench, ShoppingBag
} from 'lucide-react'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}



function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = ['What Lucy Does', 'How It Works', 'Products', 'Pricing', 'FAQ']
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1a]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-white">Belken</span>
          <span className="text-gradient"> Enterprise</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200">{l}</a>
          ))}
          <a href="#cta" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105">Book a Call</a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0a0f1a]/95 border-b border-white/5 px-6 pb-6">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setOpen(false)}
              className="block py-3 text-white/60 hover:text-white border-b border-white/5 transition-colors">{l}</a>
          ))}
          <a href="#cta" onClick={() => setOpen(false)} className="mt-4 block text-center px-4 py-3 bg-brand-500 text-white text-sm font-medium rounded-lg">Book a Call</a>
        </div>
      )}
    </nav>
  )
}

function DashboardMockup() {
  const [count, setCount] = useState(12801)
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3)), 2000)
    return () => clearInterval(t)
  }, [])
  const bars = [35, 52, 41, 67, 58, 80, 73, 91, 85, 100, 94, 100]
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0" style={{ animation: 'dashFloat 4s ease-in-out infinite' }}>
      <style>{`
        @keyframes dashFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes tickerScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-track { animation: tickerScroll 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-3xl scale-110 pointer-events-none" />
      <div className="relative glass rounded-2xl p-5 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <div className="text-white/30 text-xs font-mono">Lucy Operations Dashboard</div>
          <div className="flex items-center gap-1 text-green-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />LIVE
          </div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 mb-3 border border-white/5">
          <div className="text-white/40 text-xs font-mono mb-1">Tasks Completed Today</div>
          <div className="text-3xl font-bold text-white tabular-nums">{count.toLocaleString()}</div>
          <div className="text-green-400 text-xs mt-1 font-mono">↑ +2.3% vs yesterday</div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-4 mb-3 border border-white/5">
          <div className="text-white/40 text-xs font-mono mb-3">Monthly Growth</div>
          <div className="flex items-end gap-1 h-12">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{
                height: `${h}%`,
                background: i === bars.length-1 ? 'linear-gradient(180deg,#3b63f7,#608bfb)' : i >= bars.length-3 ? 'rgba(59,99,247,0.6)' : 'rgba(255,255,255,0.1)',
                transition: 'height 0.5s ease'
              }} />
            ))}
          </div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 mb-3 border border-white/5 space-y-2">
          {[{label:'Lucy',status:'Active',color:'bg-green-400'},{label:'Lead Engine',status:'Processing',color:'bg-brand-400'},{label:'Content',status:'Scheduled',color:'bg-purple-400'}].map(({label,status,color}) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-white/50 font-mono">{label}</span>
              <span className="flex items-center gap-1.5 text-white/70">
                <span className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />{status}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Check size={12} className="text-green-400" />
          </div>
          <div>
            <div className="text-green-400 text-xs font-semibold">3 appointments booked while you slept</div>
            <div className="text-white/30 text-xs font-mono">09:47 AM — via Lead Engine</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TAGLINES = [
  "Your Business Needs a COO. You Can't Afford One. We Fixed That.",
  "This Isn't a Demo. It's Running My Business Right Now.",
  "Stop Paying $27K a Year for Work an AI Can Do for $500/Month.",
]

function Hero() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const switchTo = (next) => { setFading(true); setTimeout(() => { setIdx(next); setFading(false) }, 300) }
  useEffect(() => {
    const t = setInterval(() => switchTo((idx + 1) % TAGLINES.length), 5000)
    return () => clearInterval(t)
  }, [idx])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] animate-glow-pulse animate-delay-200" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-white/50 mb-8 font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Live in production
            </div>
            <div className="h-36 sm:h-28 flex items-center justify-center lg:justify-start mb-6">
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight transition-all duration-300 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <span className="text-gradient">{TAGLINES[idx]}</span>
              </h1>
            </div>
            <div className="flex justify-center lg:justify-start gap-2 mb-8">
              {TAGLINES.map((_, i) => (
                <button key={i} onClick={() => switchTo(i)} className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'bg-brand-400 w-6' : 'bg-white/20 hover:bg-white/40 w-2'}`} />
              ))}
            </div>
            <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
              <img src="/lucy-avatar.jpg" alt="Lucy — AI COO" className="w-16 h-16 rounded-full object-cover border-2 border-brand-500/40 shadow-lg shadow-brand-500/20 flex-shrink-0" />
              <p className="text-lg text-white/50 leading-relaxed">
                Meet Lucy — your AI-powered Chief Operating Officer. She handles lead reactivation, scheduling, client follow-up, content, and operations. 24/7. No salary. No PTO.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <a href="#cta" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25 flex items-center gap-2">
                Book a Free Call <ArrowRight size={18} />
              </a>
              <a href="#what-lucy-does" className="px-8 py-4 glass text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/10 flex items-center gap-2">
                <Play size={16} /> See what she does
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-white/30 text-sm">
              {['24/7 Operations', 'No Long-Term Contracts', 'Live in 14 Days', 'US-Based Support'].map(s => (
                <div key={s} className="flex items-center gap-2"><Check size={14} className="text-green-400" /> {s}</div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full lg:max-w-md"><DashboardMockup /></div>
        </div>
      </div>
    </section>
  )
}

const TICKER_ITEMS = [
  'Lead reactivated → $2,400 deal closed',
  'Patient no-show prevented → appointment rescheduled',
  'Content published → 3 platforms → 847 impressions',
  'Invoice sent → payment received in 4 hours',
  'CRM updated → 47 contacts enriched',
  'Cold lead converted → $8,500 contract signed',
  '3 follow-up sequences launched → 12 responses',
  '6 appointments confirmed → zero no-shows today',
]

function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="relative py-4 bg-white/[0.02] border-y border-white/5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0f1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0f1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 flex items-center z-20 pl-4">
        <span className="hidden sm:flex items-center gap-2 text-xs font-mono text-brand-400 tracking-widest uppercase whitespace-nowrap bg-[#0a0f1a] pr-4 border-r border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" /> Live Ops
        </span>
      </div>
      <div className="ticker-track flex items-center gap-0 pl-36 sm:pl-40" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} className="whitespace-nowrap text-sm text-white/50 hover:text-white/80 transition-colors px-8 border-r border-white/5 font-mono">{item}</span>
        ))}
      </div>
    </div>
  )
}

const STATS = [
  { label: '14+ Agent Stack', sublabel: 'Deployed AI agents running production ops' },
  { label: '24/7 Operations', sublabel: 'Always on. Always working.' },
  { label: 'Live in 14 Days', sublabel: 'From first call to full deployment' },
  { label: 'US-Based Support', sublabel: 'Real humans behind every deployment' },
]

function StatsSection() {
  const [ref, inView] = useInView(0.3)
  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-10 glow-blue border border-brand-500/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">{stat.label}</div>
                <div className="text-white/40 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const CAPABILITIES = [
  { icon: <Users size={24} />, title: 'Lead Reactivation', desc: 'Lucy monitors your cold leads and dormant contacts. She reaches out at the right moment, re-engages prospects, and books them back onto your calendar — automatically.', stat: '3x', statLabel: 'more leads re-engaged' },
  { icon: <Calendar size={24} />, title: 'Scheduling & Follow-Up', desc: 'Never chase a prospect again. Lucy handles appointment setting, sends reminders, follows up after no-shows, and keeps your pipeline clean and moving.', stat: '90%', statLabel: 'reduction in no-shows' },
  { icon: <FileText size={24} />, title: 'Content Operations', desc: 'From social posts to email campaigns, Lucy drafts, schedules, and publishes content that sounds like you — consistently, without the burnout.', stat: '10x', statLabel: 'content output' },
  { icon: <Settings size={24} />, title: 'Business Automation', desc: 'Onboarding sequences, contract delivery, invoice reminders, reporting — Lucy handles the operational layer so you can stay in your zone of genius.', stat: '40hrs', statLabel: 'saved per month' },
]

function WhatLucyDoes() {
  const [ref, inView] = useInView()
  return (
    <section id="what-lucy-does" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">AI Chief Operating Officer</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Lucy Does</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">One AI. Four operational pillars. Fully managed. Deployed in your business, not some demo environment.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <div key={cap.title} className={`glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-500 group ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors flex-shrink-0">{cap.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{cap.title}</h3>
                  <p className="text-white/50 leading-relaxed mb-4">{cap.desc}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gradient">{cap.stat}</span>
                    <span className="text-white/40 text-sm">{cap.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [ref, inView] = useInView()
  const withoutItems = [
    { text: '6am alarm — scrambling to follow up' },
    { text: 'Manual data entry in 3 different tools' },
    { text: 'Missed leads because you were too busy' },
    { text: '60-hour weeks, still behind' },
    { text: '$0 recovered from dead leads' },
    { text: 'Nights and weekends: still working' },
  ]
  const withItems = [
    { text: 'Wake up to booked appointments' },
    { text: 'Everything automated, zero manual entry' },
    { text: 'Every lead captured and followed up' },
    { text: '20-hour weeks — and growing faster' },
    { text: '$47K recovered from cold database' },
    { text: 'Lucy runs ops while you sleep' },
  ]
  return (
    <section className="py-32 px-6 bg-surface-1" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">The Difference</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Before vs. After Lucy</h2>
          <p className="text-white/50 text-lg">Two realities. You choose which one you want to live in.</p>
        </div>
        <div className={`grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-white/10 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-red-950/30 border-r border-white/10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><X size={18} className="text-red-400" /></div>
              <div>
                <div className="text-xs font-mono text-red-400/70 uppercase tracking-widest mb-0.5">Without Lucy</div>
                <div className="text-xl font-bold text-white/80">Running on Empty</div>
              </div>
            </div>
            <ul className="space-y-4">
              {withoutItems.map(({ text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-red-400/60 mt-0.5 flex-shrink-0"><X size={14} /></span>
                  <span className="text-white/50 text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-red-500/10">
              <div className="text-red-400/80 text-sm font-mono">Average: 60hr/wk · $0 recovered · burnout inevitable</div>
            </div>
          </div>
          <div className="bg-brand-500/5 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center"><Zap size={18} className="text-brand-400" /></div>
              <div>
                <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-0.5">With Lucy</div>
                <div className="text-xl font-bold text-white">Running at Full Power</div>
              </div>
            </div>
            <ul className="space-y-4">
              {withItems.map(({ text }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="text-green-400 mt-0.5 flex-shrink-0"><Check size={14} /></span>
                  <span className="text-white/80 text-sm leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-brand-500/20">
              <div className="text-brand-400 text-sm font-mono">Average: 20hr/wk · $47K recovered · scaling on autopilot</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ROICalculator() {
  const [ref, inView] = useInView()
  const [leads, setLeads] = useState(500)
  const [dealValue, setDealValue] = useState(2500)
  const recovered = Math.round(leads * 0.08 * dealValue)
  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">ROI Calculator</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How Much Is Lucy Worth to You?</h2>
          <p className="text-white/50 text-lg">Adjust the numbers. See what is sitting in your dead lead database right now.</p>
        </div>
        <div className={`glass rounded-2xl p-8 md:p-10 glow-blue border border-brand-500/10 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-white/60 text-sm font-mono">Leads per month</label>
                <span className="text-2xl font-bold text-white tabular-nums">{leads.toLocaleString()}</span>
              </div>
              <input type="range" min="50" max="5000" step="50" value={leads}
                onChange={e => setLeads(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, #3b63f7 ${(leads-50)/4950*100}%, rgba(255,255,255,0.1) ${(leads-50)/4950*100}%)` }}
              />
              <div className="flex justify-between text-white/20 text-xs font-mono mt-1"><span>50</span><span>5,000</span></div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label className="text-white/60 text-sm font-mono">Average deal value</label>
                <span className="text-2xl font-bold text-white tabular-nums">${dealValue.toLocaleString()}</span>
              </div>
              <input type="range" min="500" max="25000" step="500" value={dealValue}
                onChange={e => setDealValue(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, #3b63f7 ${(dealValue-500)/24500*100}%, rgba(255,255,255,0.1) ${(dealValue-500)/24500*100}%)` }}
              />
              <div className="flex justify-between text-white/20 text-xs font-mono mt-1"><span>$500</span><span>$25,000</span></div>
            </div>
          </div>
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-6 text-center" style={{ transition: 'all 0.3s ease' }}>
            <div className="text-white/50 text-sm font-mono mb-2">Lucy could recover per month from dead leads alone</div>
            <div className="text-5xl md:text-6xl font-bold text-gradient tabular-nums mb-2" style={{ transition: 'all 0.2s ease' }}>
              ${recovered.toLocaleString()}
            </div>
            <div className="text-white/30 text-xs font-mono">{leads.toLocaleString()} leads x 8% reactivation x ${dealValue.toLocaleString()} avg deal</div>
            <div className="mt-4 pt-4 border-t border-brand-500/10 flex flex-col sm:flex-row justify-center gap-6 text-sm">
              <div className="text-white/50"><span className="text-white font-semibold">{Math.round(leads * 0.08)}</span> leads reactivated</div>
              <div className="text-white/50"><span className="text-green-400 font-semibold">{Math.round(recovered / 3000 * 100)}%</span> ROI at Pro tier</div>
              <div className="text-white/50">Payback in <span className="text-brand-400 font-semibold">{Math.ceil(3000 / (recovered / 30))} days</span></div>
            </div>
          </div>
          <div className="text-center mt-6">
            <a href="#cta" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105">
              Recover That Revenue <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const ACTIVITY_FEED = [
  { time: '09:47 AM', event: 'Reactivated 12 cold leads from Q3 database', type: 'lead' },
  { time: '10:15 AM', event: 'Drafted and sent 3 follow-up sequences', type: 'content' },
  { time: '11:02 AM', event: 'Booked appointment: Sarah M. (HVAC inspection)', type: 'booking' },
  { time: '12:30 PM', event: 'Published blog post across 3 platforms', type: 'content' },
  { time: '01:45 PM', event: 'Qualified 7 inbound leads, routed 2 to sales', type: 'lead' },
  { time: '03:20 PM', event: 'Sent invoice #1847, payment received by 4:15 PM', type: 'revenue' },
  { time: '05:00 PM', event: 'Generated weekly performance report', type: 'ops' },
]
const TYPE_COLOR = { lead: 'text-brand-400', content: 'text-purple-400', booking: 'text-green-400', revenue: 'text-yellow-400', ops: 'text-white/50' }
const TYPE_DOT = { lead: 'bg-brand-400', content: 'bg-purple-400', booking: 'bg-green-400', revenue: 'bg-yellow-400', ops: 'bg-white/30' }

function ActivityFeed() {
  const [ref, inView] = useInView()
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (!inView) return
    let i = 0
    const t = setInterval(() => { i++; setVisible(i); if (i >= ACTIVITY_FEED.length) clearInterval(t) }, 300)
    return () => clearInterval(t)
  }, [inView])
  return (
    <section className="py-32 px-6 bg-surface-1" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Real-Time Operations</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Lucy Did Today</h2>
          <p className="text-white/50 text-lg">While you were focused on growth, she handled everything else.</p>
        </div>
        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-white/[0.03] border-b border-white/5 px-5 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="text-white/30 text-xs font-mono flex-1 text-center">lucy@belken-enterprise — ops-log — today</div>
            <div className="flex items-center gap-1.5 text-green-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />running
            </div>
          </div>
          <div className="p-6 space-y-1 font-mono text-sm">
            <div className="text-white/20 mb-4 text-xs">$ tail -f /var/log/lucy/operations.log</div>
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className={`flex items-start gap-4 py-2 px-3 rounded-lg transition-all duration-500 hover:bg-white/[0.03] ${i < visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: `${i * 50}ms` }}>
                <span className="text-white/25 text-xs whitespace-nowrap mt-0.5">{item.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${TYPE_DOT[item.type]} animate-pulse`} />
                <span className={`${TYPE_COLOR[item.type]} leading-relaxed`}>{item.event}</span>
              </div>
            ))}
            {inView && (
              <div className="flex items-center gap-2 py-2 px-3 text-white/20 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>Processing next task...</span>
                <span className="inline-block animate-pulse ml-1">_</span>
              </div>
            )}
          </div>
          <div className="border-t border-white/5 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{n:'7',label:'Actions taken'},{n:'$8,500',label:'Revenue touched'},{n:'0',label:'Hours you spent'},{n:'24/7',label:'Always running'}].map(({n,label}) => (
              <div key={label} className="text-center">
                <div className="text-lg font-bold text-brand-400 font-mono">{n}</div>
                <div className="text-white/30 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { num: '01', title: 'We Learn Your Business', desc: 'We spend two weeks with you — mapping your workflows, importing your contacts, understanding your voice and offers. Lucy learns how you operate before she touches anything.', icon: <Shield size={20} /> },
  { num: '02', title: 'Deploy Your AI COO', desc: 'Lucy goes live across your stack. She connects to your CRM, calendar, email, and social channels. We monitor everything in week one to ensure perfect calibration.', icon: <Zap size={20} /> },
  { num: '03', title: 'You Focus on Growth', desc: 'Lucy handles the operations. You handle the vision. Monthly strategy calls keep everything aligned, and you can adjust priorities any time via a simple dashboard.', icon: <TrendingUp size={20} /> },
]

function HowItWorks() {
  const [ref, inView] = useInView()
  return (
    <section id="how-it-works" className="py-32 px-6 relative" style={{
      backgroundColor: '#f8fafc',
      backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(248,250,252,0) 0%, rgba(248,250,252,0.8) 100%)' }} />
      <div className="max-w-5xl mx-auto relative" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">The Process</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#0f172a' }}>How It Works</h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#475569' }}>From first call to full deployment in 14 days. No chaos. No onboarding headaches.</p>
        </div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden sm:block" />
          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-glow-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-surface-3 border border-brand-500/30 flex items-center justify-center text-brand-400">{step.icon}</div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="text-brand-400 font-mono text-sm mb-2">{step.num}</div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#0f172a' }}>{step.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#475569' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PLANS = [
  { name: 'Starter', setup: '$2,500', monthly: '$1,500', desc: 'Perfect for solo operators and small teams ready to automate their operations.', features: ['Lucy AI COO deployment', 'Lead reactivation campaigns', 'Scheduling automation', '1 content channel', 'Monthly strategy call', 'Email support'], cta: 'Get Started', highlight: false },
  { name: 'Pro', setup: '$5,000', monthly: '$3,000', desc: 'For growing businesses that need full operational coverage and multi-channel execution.', features: ['Everything in Starter', 'Full ops automation', 'Client onboarding flows', '3 content channels', 'Weekly strategy calls', 'Priority Slack support', 'Custom integrations', 'Revenue reporting dashboard'], cta: 'Book a Call', highlight: true },
  { name: 'Enterprise', setup: 'Custom', monthly: 'Custom', desc: 'Multi-location, high-volume, or white-label deployments for agencies and franchises.', features: ['Dedicated Lucy instance', 'Multi-location support', 'White-label available', 'Custom integrations', 'SLA guarantees', 'Dedicated account team', 'On-site onboarding', 'Quarterly business reviews'], cta: 'Contact Us', highlight: false },
]

function Pricing() {
  const [ref, inView] = useInView()
  return (
    <section id="pricing" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent. Simple. Worth It.</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">A full-time COO costs $150K+/year. A part-time one costs $60K. Lucy costs a fraction — and works harder than both.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`relative rounded-2xl p-8 flex flex-col transition-all duration-700 ${plan.highlight ? 'bg-brand-500/10 border border-brand-500/40 glow-blue scale-[1.02]' : 'glass'} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
              {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-bold rounded-full tracking-wider">MOST POPULAR</div>}
              <div className="mb-6">
                <div className="text-white/40 text-sm font-medium mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold">{plan.monthly}</span>
                  {plan.monthly !== 'Custom' && <span className="text-white/40">/mo</span>}
                </div>
                <div className="text-white/30 text-sm mb-4">{plan.setup !== 'Custom' ? `+ ${plan.setup} setup` : 'Custom setup'}</div>
                <p className="text-white/50 text-sm leading-relaxed">{plan.desc}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70"><Check size={15} className="text-green-400 mt-0.5 flex-shrink-0" /> {f}</li>
                ))}
              </ul>
              <a href="#cta" className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 ${plan.highlight ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'glass hover:bg-white/10 text-white/80 hover:text-white'}`}>{plan.cta}</a>
            </div>
          ))}
        </div>
        <p className="text-center text-white/30 text-sm mt-8">No long-term contracts. Month-to-month after initial setup. Cancel anytime.</p>
      </div>
    </section>
  )
}

function CaseStudies() {
  const [ref, inView] = useInView()
  return (
    <section id="case-studies" className="py-32 px-6 bg-surface-1">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Proof</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Real Results. Real Clients.</h2>
        </div>
        <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="glass rounded-2xl p-10 md:p-14 border border-white/10 text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-400 mx-auto mb-6">
              <Zap size={26} />
            </div>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              We're in early deployment. Case studies from our first clients are being documented now.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Want to be featured? Book a call — early clients get priority placement.
            </p>
            <a href="#cta" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 text-sm">
              Book a Call <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Products() {
  const [ref, inView] = useInView()
  return (
    <section id="products" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Tools & Services</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Products</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Real systems built in production — available for you to use right now.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">

          {/* Vibe Coding Prompt Pack */}
          <div className={`glass rounded-2xl p-8 border border-white/10 flex flex-col transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-4">
              <Package size={24} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">Digital Download</div>
              <h3 className="text-xl font-bold mb-2">Vibe Coding Agent Prompt Pack</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">6 battle-tested prompts for AI-powered app development. Scaffold, build, debug, and ship with precision — no rewrites, no drift. Works with Claude, GPT-4, Cursor, Windsurf.</p>
              <ul className="space-y-2 mb-6">
                {['Core System Prompt', 'App Scaffolding Prompt', 'Debugging Templates (4 modes)', 'Client Handoff Prompt', 'Prompt Chaining Guide', 'Quick Start Guide'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={13} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">$29</span>
                <span className="text-white/40 text-sm">one-time · instant download</span>
              </div>
              <a href="https://belken.gumroad.com/l/vibe-coding-agent-prompt-pack" target="_blank" rel="noopener noreferrer"
                className="block text-center py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 text-sm">
                Get It on Gumroad →
              </a>
            </div>
          </div>

          {/* Setup-as-a-Service */}
          <div className={`relative glass rounded-2xl p-8 border border-brand-500/40 bg-brand-500/5 flex flex-col transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-bold rounded-full tracking-wider">MOST POPULAR</div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 w-fit mb-4">
              <Wrench size={24} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-2">Done-for-You Service</div>
              <h3 className="text-xl font-bold mb-2">OpenClaw Setup-as-a-Service</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">Don't want to deal with Docker, API keys, and agent wiring? We set up your full OpenClaw AI stack — configured, personalized, and handed to you running. Flat rate. No surprises.</p>
              <ul className="space-y-2 mb-6">
                {['Full OpenClaw installation', 'Custom AI persona setup', 'Discord / Telegram integration', 'Skills configured for your use case', 'Cron jobs & automations wired', '1 week post-setup support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <Check size={13} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">$800</span>
                <span className="text-white/40 text-sm">flat rate · no hidden fees</span>
              </div>
              <a href="mailto:info@belken.ai?subject=OpenClaw Setup Service — Book a Call"
                className="block text-center py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 text-sm">
                Book Setup Call →
              </a>
            </div>
          </div>

          {/* More Coming Soon */}
          <div className={`glass rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center text-center transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="p-4 rounded-2xl bg-white/[0.03] text-white/20 w-fit mb-5 mx-auto">
              <ShoppingBag size={28} />
            </div>
            <div className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Coming Soon</div>
            <h3 className="text-xl font-bold mb-3 text-white/60">More Products Dropping</h3>
            <p className="text-white/30 text-sm leading-relaxed mb-6">AI Agency Starter Kit · OpenClaw Self-Hosting Guide · Competitor Intelligence Playbook · Agent Factory Templates. Follow us for every drop.</p>
            <a href="https://x.com/LucyBelkenAI" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 glass border border-white/10 text-white/50 hover:text-white text-sm rounded-xl transition-all hover:bg-white/10">
              <Twitter size={15} /> Follow @LucyBelkenAI
            </a>
          </div>

        </div>
        <p className="text-center text-white/30 text-sm mt-8 font-mono">All digital products are instant download · Setup service includes a free 20-min discovery call before purchase</p>
      </div>
    </section>
  )
}

const FAQS = [
  { q: "Is Lucy actually AI, or are there humans involved?", a: "Lucy is a purpose-built AI system powered by large language models and custom automation workflows. There's a human team behind Belken Enterprise who configures, monitors, and improves Lucy — but your daily operations are handled autonomously by the AI." },
  { q: "How long does it take to get up and running?", a: "Most clients are fully deployed within 14 days. The first week is onboarding and configuration. Week two is soft launch with close monitoring. By day 14, Lucy is running independently." },
  { q: "What tools and software does Lucy integrate with?", a: "Lucy integrates with most major CRMs (HubSpot, GoHighLevel, Salesforce), email platforms (Gmail, Outlook), calendar apps, social media, and more. We'll confirm compatibility during your discovery call." },
  { q: "Do I have to sign a long-term contract?", a: "No. After your initial setup, you're month-to-month. We believe in earning your business every month, not locking you in. Setup fees are non-refundable, but ongoing service can be paused or cancelled with 30 days' notice." },
  { q: "What makes this different from hiring a VA or using Zapier?", a: "A VA has limited hours, takes PTO, and needs constant management. Zapier automates simple linear tasks. Lucy handles complex, judgment-based operations — she decides when to follow up, what to say, and how to prioritize — continuously, at scale, without oversight." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. We never train AI models on your business data. You retain full ownership of everything. We are happy to sign a custom NDA before any engagement begins." },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  const [ref, inView] = useInView()
  return (
    <section id="faq" className="py-32 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Questions?</h2>
          <p className="text-white/50">The ones we get asked every week.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className={`glass rounded-xl overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 60}ms` }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors">
                <span className="font-medium text-white/90 text-sm">{faq.q}</span>
                <ChevronDown size={18} className={`text-white/30 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [ref, inView] = useInView()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      window.location.href = `mailto:info@belken.ai?subject=Book a Call — Belken Enterprise&body=Hi, I'd like to book a free call. My email is: ${email}%0A%0ATell us a bit about your business so we can prepare:`
      setSubmitted(true)
    }
  }
  return (
    <section id="cta" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[100px] animate-glow-pulse" />
      </div>
      <div className={`relative max-w-3xl mx-auto text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-6">Get Started</div>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Ready to Stop Doing<br /><span className="text-gradient">Everything Yourself?</span></h2>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">Book a free 30-minute call. We'll map out exactly how Lucy can take operations off your plate — no pitch decks, no BS.</p>
        <div className="glass rounded-2xl p-8 mb-8">
          {submitted ? (
            <div className="py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-green-400" /></div>
              <div className="text-white font-semibold text-lg mb-2">You're on the list.</div>
              <div className="text-white/50 text-sm">We'll reach out within 24 hours to schedule your call.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500/50 transition-colors" />
              <button type="submit" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 whitespace-nowrap text-sm">Book a Call</button>
            </form>
          )}
        </div>
        <p className="text-white/30 text-sm">Or email us directly: <a href="mailto:info@belken.ai" className="text-brand-400 hover:underline">info@belken.ai</a></p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-xl font-bold mb-3"><span className="text-white">Belken</span><span className="text-gradient"> Enterprise</span></div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-4">AI-powered Chief Operating Officer for businesses that are serious about scaling without burning out.</p>
            <div className="space-y-2 mb-5">
              <a href="mailto:info@belken.ai" className="flex items-center gap-2 text-white/30 text-sm hover:text-white/60 transition-colors"><Mail size={14} /> info@belken.ai</a>
              <div className="flex items-start gap-2 text-white/30 text-sm"><MapPin size={14} className="mt-0.5 flex-shrink-0" /> Remote — Nationwide</div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://x.com/LucyBelkenAI" target="_blank" rel="noopener noreferrer" aria-label="Twitter @LucyBelkenAI"
                className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-500/50 transition-all duration-200">
                <Twitter size={16} />
              </a>
              <a href="https://youtube.com/@LucyBelKenAI" target="_blank" rel="noopener noreferrer" aria-label="YouTube LucyBelKenAI"
                className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all duration-200">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm font-semibold mb-4 tracking-wider uppercase">Product</div>
            <ul className="space-y-3 text-white/30 text-sm">
              {['What Lucy Does', 'How It Works', 'Products', 'Pricing', 'FAQ'].map(l => (
                <li key={l}><a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-white/60 text-sm font-semibold mb-4 tracking-wider uppercase">Legal</div>
            <ul className="space-y-3 text-white/30 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'].map(l => (
                <li key={l}><a href="#" className="hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs">
          <div>© {new Date().getFullYear()} Belken Enterprise LLC. All rights reserved.</div>
          <div>AI-Powered Operations</div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Nav />
      <Hero />
      <LiveTicker />
      <StatsSection />
      <WhatLucyDoes />
      <BeforeAfter />
      <ROICalculator />
      <ActivityFeed />
      <HowItWorks />
      <Pricing />
      <CaseStudies />
      <Products />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
