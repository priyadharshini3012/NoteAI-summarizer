import React, { useEffect, useRef } from 'react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>),
    title: 'Text & PDF Input',
    desc: 'Paste raw notes or upload PDF documents directly. Our AI processes both with the same precision.',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
    title: 'Instant Results',
    desc: 'Get accurate summaries in seconds. Choose short, medium, or long output to match your needs.',
    gradient: 'linear-gradient(135deg,#22d3ee,#6366f1)',
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
    title: 'Two Output Formats',
    desc: 'Switch between clean paragraphs or scannable bullet points — whatever fits your workflow.',
    gradient: 'linear-gradient(135deg,#10b981,#22d3ee)',
  },
  {
    icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
    title: 'One-Click Copy',
    desc: 'Copy your summary to clipboard instantly and paste it anywhere — notes, emails, or docs.',
    gradient: 'linear-gradient(135deg,#f59e0b,#ec4899)',
  },
];

const STATS = [
  { value: '10×', label: 'Faster Notes Review' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '3', label: 'Summary Lengths' },
  { value: '∞', label: 'Pages Supported' },
];

const STEPS = [
  { num: '01', title: 'Input Content', desc: 'Paste text or upload a PDF into the dashboard.' },
  { num: '02', title: 'Choose Style', desc: 'Pick summary length and format to your preference.' },
  { num: '03', title: 'Get Summary', desc: 'Click summarize and receive a polished result instantly.' },
];

const LandingPage = ({ setCurrentPage }) => {
  const heroRef = useRef(null);
  const g1Ref  = useRef(null);
  const g2Ref  = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / width;
      const y = (e.clientY - top  - height / 2) / height;
      if (g1Ref.current) g1Ref.current.style.transform = `translate(${x * 35}px, ${y * 35}px)`;
      if (g2Ref.current) g2Ref.current.style.transform = `translate(${-x * 25}px, ${-y * 25}px)`;
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef} id="hero">
        <div className="hero__bg">
          <div className="hero__grid" />
          <div className="hero__glow-1" ref={g1Ref} />
          <div className="hero__glow-2" ref={g2Ref} />
          <div className="hero__glow-3" />
        </div>

        <div className="hero__container">
          {/* Eyebrow badge */}
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            <span className="hero__eyebrow-text">AI-Powered Summarization</span>
          </div>

          {/* Headline */}
          <h1 className="hero__title">
            Transform Your Notes into<br />
            <span className="hero__title-accent">Crystal Clarity</span>
          </h1>

          <p className="hero__desc">
            Paste text or upload a PDF and let our AI distill the essence in seconds.
            Perfect for students, researchers, and professionals who value their time.
          </p>

          {/* CTAs */}
          <div className="hero__ctas">
            <button id="hero-get-started" className="btn btn--primary btn--lg" onClick={() => setCurrentPage('dashboard')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Start Summarizing Free
            </button>
            <button id="hero-see-how" className="btn btn--ghost btn--lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </button>
          </div>

          {/* Mock app window */}
          <div className="hero__preview">
            <div className="hero__preview-card">
              <div className="hero__preview-titlebar">
                <div className="hero__window-dots">
                  <div className="hero__window-dot" />
                  <div className="hero__window-dot" />
                  <div className="hero__window-dot" />
                </div>
                <span className="hero__preview-title">noteai.app/dashboard</span>
                <div className="hero__preview-status">Live</div>
              </div>

              <div className="hero__preview-body">
                {/* Input side */}
                <div>
                  <div className="hero__preview-section-label">📄 Input — 3 pages</div>
                  <div className="hero__preview-lines">
                    {[92, 78, 85, 65, 88, 55].map((w, i) => (
                      <div key={i} className="hero__preview-line" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hero__preview-divider">
                  <div className="hero__preview-arrow-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div className="hero__preview-arrow-label">AI</div>
                </div>

                {/* Output side */}
                <div>
                  <div className="hero__preview-section-label">✅ Summary — 3 sec</div>
                  <ul className="hero__preview-bullets">
                    <li className="hero__preview-bullet">Self-confidence reflects acceptance of your strengths and limits.</li>
                    <li className="hero__preview-bullet">Low confidence often stems from flawed perceptions, not ability.</li>
                    <li className="hero__preview-bullet">Confidence varies by situation — academics vs. relationships.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats" id="stats">
        <div className="stats__container">
          {STATS.map((s, i) => (
            <div key={i} className="stats__item">
              <span className="stats__value">{s.value}</span>
              <span className="stats__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="features__container">
          <div className="section__header">
            <span className="section__tag">Features</span>
            <h2 className="section__title">Built for speed,<br /><span className="gradient-text">designed for clarity</span></h2>
            <p className="section__subtitle">Everything you need to extract key insights from any text — fast and accurately.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-card__icon-wrap" style={{ background: f.gradient }}>
                  {f.icon}
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works" id="how-it-works">
        <div className="hiw__container">
          <div className="section__header">
            <span className="section__tag">Process</span>
            <h2 className="section__title">Three steps to<br /><span className="gradient-text">brilliant brevity</span></h2>
          </div>
          <div className="hiw__steps">
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <div className="hiw__step">
                  <div className="hiw__step-num">
                    <div className="hiw__step-num-bg" />
                    {step.num}
                  </div>
                  <h3 className="hiw__step-title">{step.title}</h3>
                  <p className="hiw__step-desc">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hiw__arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" id="cta">
        <div className="cta-banner__container">
          <div className="cta-banner__card">
            <div className="cta-banner__bg">
              <div className="cta-banner__glow" />
            </div>
            <h2 className="cta-banner__title">Ready to read 10× faster?</h2>
            <p className="cta-banner__subtitle">Start summarizing text and PDFs in seconds — no sign-up required.</p>
            <button id="cta-start-btn" className="btn btn--primary btn--lg" onClick={() => setCurrentPage('dashboard')} style={{ position: 'relative', zIndex: 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Launch Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__brand">
            <div className="footer__logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span className="footer__logo-text">NoteAI</span>
          </div>
          <p className="footer__copy">© 2026 NoteAI · Built with AI + ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
