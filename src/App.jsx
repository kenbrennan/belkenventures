import { useState, useEffect, useRef } from 'react'
import {
  Zap, Calendar, Users, FileText, Settings, ArrowRight,
  Check, ChevronDown, Menu, X, Mail, Phone, MapPin,
  TrendingUp, Clock, Shield, Star, Play
} from 'lucide-react'

// ── Intersection Observer hook ─────────────────────────────────────────────
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

// ── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = ['What Lucy Does', 'How It Works', 'Pricing', 'FAQ']
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-white">Belken</span>
          <span className="text-gradient"> Enterprise</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200">
              {l}
            </a>
          ))}
          <a href="#cta" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105">
            Book a Call
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-black/95 border-b border-white/5 px-6 pb-6">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/60 hover:text-white border-b border-white/5 transition-colors">
              {l}
            </a>
          ))}
          <a href="#cta" onClick={() => setOpen(false)}
            className="mt-4 block text-center px-4 py-3 bg-brand-500 text-white text-sm font-medium rounded-lg">
            Book a Call
          </a>
        </div>
      )}
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────
const TAGLINES = [
  "Your Business Needs a COO. You Can't Afford One. We Fixed That.",
  "This Isn't a Demo. It's Running My Business Right Now.",
  "Stop Paying $27K a Year for Work an AI Can Do for $500/Month.",
]

function Hero() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  const switchTo = (next) => {
    setFading(true)
    setTimeout(() => { setIdx(next); setFading(false) }, 300)
  }

  useEffect(() => {
    const t = setInterval(() => switchTo((idx + 1) % TAGLINES.length), 5000)
    return () => clearInterval(t)
  }, [idx])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[100px] animate-glow-pulse animate-delay-200" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-white/50 mb-8 font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live in production
        </div>

        <div className="h-32 sm:h-24 flex items-center justify-center mb-6">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight transition-all duration-300 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <span className="text-gradient">{TAGLINES[idx]}</span>
          </h1>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {TAGLINES.map((_, i) => (
            <button key={i} onClick={() => switchTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === idx ? 'bg-brand-400 w-6' : 'bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Meet Lucy — your AI-powered Chief Operating Officer. She handles lead reactivation, 
          scheduling, client follow-up, content, and operations. 24/7. No salary. No PTO.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="#cta" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25 flex items-center gap-2">
            Book a Free Call <ArrowRight size={18} />
          </a>
          <a href="#what-lucy-does" className="px-8 py-4 glass text-white/70 hover:text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/10 flex items-center gap-2">
            <Play size={16} /> See what she does
          </a>
        </div>

        {/* Social proof bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/30 text-sm">
          {['24/7 Operations', 'No Long-Term Contracts', 'Live in 14 Days', 'US-Based Support'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <Check size={14} className="text-green-400" /> {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── What Lucy Does ─────────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    icon: <Users size={24} />,
    title: 'Lead Reactivation',
    desc: 'Lucy monitors your cold leads and dormant contacts. She reaches out at the right moment, re-engages prospects, and books them back onto your calendar — automatically.',
    stat: '3x', statLabel: 'more leads re-engaged'
  },
  {
    icon: <Calendar size={24} />,
    title: 'Scheduling & Follow-Up',
    desc: 'Never chase a prospect again. Lucy handles appointment setting, sends reminders, follows up after no-shows, and keeps your pipeline clean and moving.',
    stat: '90%', statLabel: 'reduction in no-shows'
  },
  {
    icon: <FileText size={24} />,
    title: 'Content Operations',
    desc: 'From social posts to email campaigns, Lucy drafts, schedules, and publishes content that sounds like you — consistently, without the burnout.',
    stat: '10x', statLabel: 'content output'
  },
  {
    icon: <Settings size={24} />,
    title: 'Business Automation',
    desc: 'Onboarding sequences, contract delivery, invoice reminders, reporting — Lucy handles the operational layer so you can stay in your zone of genius.',
    stat: '40hrs', statLabel: 'saved per month'
  },
]

function WhatLucyDoes() {
  const [ref, inView] = useInView()
  return (
    <section id="what-lucy-does" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">AI Chief Operating Officer</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Lucy Does</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            One AI. Four operational pillars. Fully managed. Deployed in your business, not some demo environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <div key={cap.title}
              className={`glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all duration-500 group ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors flex-shrink-0">
                  {cap.icon}
                </div>
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

// ── How It Works ──────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'We Learn Your Business',
    desc: 'We spend two weeks with you — mapping your workflows, importing your contacts, understanding your voice and offers. Lucy learns how you operate before she touches anything.',
    icon: <Shield size={20} />
  },
  {
    num: '02',
    title: 'Deploy Your AI COO',
    desc: 'Lucy goes live across your stack. She connects to your CRM, calendar, email, and social channels. We monitor everything in week one to ensure perfect calibration.',
    icon: <Zap size={20} />
  },
  {
    num: '03',
    title: 'You Focus on Growth',
    desc: 'Lucy handles the operations. You handle the vision. Monthly strategy calls keep everything aligned, and you can adjust priorities any time via a simple dashboard.',
    icon: <TrendingUp size={20} />
  },
]

function HowItWorks() {
  const [ref, inView] = useInView()
  return (
    <section id="how-it-works" className="py-32 px-6 bg-surface-1">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">The Process</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From first call to full deployment in 14 days. No chaos. No onboarding headaches.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden sm:block" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.num}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="md:w-1/2 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-glow-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-surface-3 border border-brand-500/30 flex items-center justify-center text-brand-400">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="text-brand-400/50 font-mono text-sm mb-2">{step.num}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Pricing ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Starter',
    setup: '$2,500',
    monthly: '$1,500',
    desc: 'Perfect for solo operators and small teams ready to automate their operations.',
    features: ['Lucy AI COO deployment', 'Lead reactivation campaigns', 'Scheduling automation', '1 content channel', 'Monthly strategy call', 'Email support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    setup: '$5,000',
    monthly: '$3,000',
    desc: 'For growing businesses that need full operational coverage and multi-channel execution.',
    features: ['Everything in Starter', 'Full ops automation', 'Client onboarding flows', '3 content channels', 'Weekly strategy calls', 'Priority Slack support', 'Custom integrations', 'Revenue reporting dashboard'],
    cta: 'Book a Call',
    highlight: true,
  },
  {
    name: 'Enterprise',
    setup: 'Custom',
    monthly: 'Custom',
    desc: 'Multi-location, high-volume, or white-label deployments for agencies and franchises.',
    features: ['Dedicated Lucy instance', 'Multi-location support', 'White-label available', 'Custom integrations', 'SLA guarantees', 'Dedicated account team', 'On-site onboarding', 'Quarterly business reviews'],
    cta: 'Contact Us',
    highlight: false,
  },
]

function Pricing() {
  const [ref, inView] = useInView()
  return (
    <section id="pricing" className="py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent. Simple. Worth It.</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            A full-time COO costs $150K+/year. A part-time one costs $60K. Lucy costs a fraction — and works harder than both.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <div key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-700 ${plan.highlight ? 'bg-brand-500/10 border border-brand-500/40 glow-blue scale-[1.02]' : 'glass'} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-500 text-white text-xs font-bold rounded-full tracking-wider">
                  MOST POPULAR
                </div>
              )}
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
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <Check size={15} className="text-green-400 mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <a href="#cta"
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 ${plan.highlight ? 'bg-brand-500 hover:bg-brand-600 text-white' : 'glass hover:bg-white/10 text-white/80 hover:text-white'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-white/30 text-sm mt-8">No long-term contracts. Month-to-month after initial setup. Cancel anytime.</p>
      </div>
    </section>
  )
}

// ── Case Studies ───────────────────────────────────────────────────────────
function CaseStudies() {
  const [ref, inView] = useInView()
  return (
    <section id="case-studies" className="py-32 px-6 bg-surface-1">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-4">Proof</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h2>
        </div>

        <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Live case study: Belken itself */}
          <div className="glass rounded-2xl p-8 md:p-12 mb-6 border border-brand-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <div className="text-xs text-brand-400 font-mono tracking-widest uppercase mb-1">Live Right Now</div>
                <h3 className="text-2xl font-bold">Belken Enterprise</h3>
                <p className="text-white/40 text-sm">AI Consulting & Automation</p>
              </div>
            </div>
            <blockquote className="text-white/70 text-lg leading-relaxed mb-6 italic border-l-2 border-brand-500/40 pl-6">
              "We built Lucy to run our own business first. She handles every piece of our operations — 
              from lead follow-up to content publishing to client onboarding. We're proof it works 
              because we're living it right now."
            </blockquote>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
              {[['40hrs', 'saved per week'], ['3x', 'lead conversion'], ['14 days', 'to full deployment']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-gradient">{n}</div>
                  <div className="text-white/40 text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming soon cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {['Healthcare Practice', 'Real Estate Agency'].map(name => (
              <div key={name} className="glass rounded-2xl p-8 flex items-center justify-center min-h-[160px] border border-white/5">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Clock size={18} className="text-white/20" />
                  </div>
                  <div className="text-white/20 font-medium">{name}</div>
                  <div className="text-white/10 text-sm mt-1">Case study coming soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Is Lucy actually AI, or are there humans involved?", a: "Lucy is a purpose-built AI system powered by large language models and custom automation workflows. There's a human team behind Belken Enterprise who configures, monitors, and improves Lucy — but your daily operations are handled autonomously by the AI." },
  { q: "How long does it take to get up and running?", a: "Most clients are fully deployed within 14 days. The first week is onboarding and configuration. Week two is soft launch with close monitoring. By day 14, Lucy is running independently." },
  { q: "What tools and software does Lucy integrate with?", a: "Lucy integrates with most major CRMs (HubSpot, GoHighLevel, Salesforce), email platforms (Gmail, Outlook), calendar apps, social media, and more. We'll confirm compatibility during your discovery call." },
  { q: "Do I have to sign a long-term contract?", a: "No. After your initial setup, you're month-to-month. We believe in earning your business every month, not locking you in. Setup fees are non-refundable, but ongoing service can be paused or cancelled with 30 days' notice." },
  { q: "What makes this different from hiring a VA or using Zapier?", a: "A VA has limited hours, takes PTO, and needs constant management. Zapier automates simple linear tasks. Lucy handles complex, judgment-based operations — she decides when to follow up, what to say, and how to prioritize — continuously, at scale, without oversight." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. We never train AI models on your business data. You retain full ownership of everything. We're happy to sign a custom NDA before any engagement begins." },
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
            <div key={i}
              className={`glass rounded-xl overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 60}ms` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors">
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

// ── CTA ────────────────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [ref, inView] = useInView()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section id="cta" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/15 blur-[100px] animate-glow-pulse" />
      </div>
      <div className={`relative max-w-3xl mx-auto text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-brand-400 text-sm font-mono tracking-widest uppercase mb-6">Get Started</div>
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Ready to Stop Doing<br /><span className="text-gradient">Everything Yourself?</span>
        </h2>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
          Book a free 30-minute call. We'll map out exactly how Lucy can take operations off your plate — no pitch decks, no BS.
        </p>

        <div className="glass rounded-2xl p-8 mb-8">
          {submitted ? (
            <div className="py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green-400" />
              </div>
              <div className="text-white font-semibold text-lg mb-2">You're on the list.</div>
              <div className="text-white/50 text-sm">We'll reach out within 24 hours to schedule your call.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <button type="submit"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 whitespace-nowrap text-sm">
                Book a Call
              </button>
            </form>
          )}
        </div>

        <p className="text-white/30 text-sm">
          Or email us directly: <a href="mailto:info@belkenventures.com" className="text-brand-400 hover:underline">info@belkenventures.com</a>
        </p>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-xl font-bold mb-3">
              <span className="text-white">Belken</span>
              <span className="text-gradient"> Enterprise</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-4">
              AI-powered Chief Operating Officer for businesses that are serious about scaling without burning out.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <Mail size={14} /> info@belkenventures.com
              </div>
              <div className="flex items-start gap-2 text-white/30 text-sm">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" /> United States
              </div>
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm font-semibold mb-4 tracking-wider uppercase">Product</div>
            <ul className="space-y-3 text-white/30 text-sm">
              {['What Lucy Does', 'How It Works', 'Pricing', 'Case Studies', 'FAQ'].map(l => (
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

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <Hero />
      <WhatLucyDoes />
      <HowItWorks />
      <Pricing />
      <CaseStudies />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
