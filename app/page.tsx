"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Lenis from "lenis";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#story" },
  { label: "Events", href: "#events" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
];

const upcomingEvents = [
  { date: "14 AUG", title: "Hawks Open Chess Championship", type: "Competition" },
  { date: "24 AUG", title: "Interclub Cricket League", type: "League" },
  { date: "07 SEP", title: "Move Lab: Speed & Agility", type: "Workshop" },
];

const posts = [
  { number: "01", title: "Training beyond the scoreboard", tag: "Club journal" },
  { number: "02", title: "How we turn practice into purpose", tag: "Coaching" },
  { number: "03", title: "A field guide to showing up", tag: "Community" },
];

export default function Home() {
  const lenis = useRef<Lenis | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const smoothScroll = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      respectReducedMotion: true,
    });
    let rafId = 0;
    const raf = (time: number) => {
      smoothScroll.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    lenis.current = smoothScroll;
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      smoothScroll.destroy();
      lenis.current = null;
    };
  }, []);

  const scrollTo = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    lenis.current?.scrollTo(target, { duration: 1.15, offset: -18 });
    setMenuOpen(false);
  };

  return (
    <main>
      <section className="hero" id="home">
        <header className="site-header">
          <a className="site-logo" href="#home" onClick={scrollTo} aria-label="Hawks Sports Club home">
            <img src="/images/hawks-logo-transparent.png" alt="Hawks Sports Club" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a href={item.href} onClick={scrollTo} key={item.label}>{item.label}</a>
            ))}
          </nav>
          <a className="header-cta" href="#pricing" onClick={scrollTo}>Join the club</a>
          <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={23} />}
          </button>
        </header>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a href={item.href} onClick={scrollTo} key={item.label}>{item.label}</a>
            ))}
          </nav>
        )}

        <div className="hero-title" aria-label="Unlock next level performance">
          <span>Where</span>
          <span>Champions</span>
          <span>Are Made</span>
        </div>

        <div className="hero-intro">
          <p>Hawks Sports Club is built for young people ready to move with focus, purpose and confidence.</p>
          <p>Find your team, challenge your limits and make your next move count.</p>
        </div>

        <a className="hero-cta" href="#events" onClick={scrollTo}>
          <span>Unlock your potential</span>
          <ArrowUpRight size={22} strokeWidth={1.75} />
        </a>
      </section>

      <section className="story-section" id="story">
        <p className="section-kicker">01 — Who we are</p>
        <div className="story-grid">
          <h2>Built for the<br /><em>next move.</em></h2>
          <div className="story-copy">
            <p>We are a youth sports club for the players, makers and leaders who know progress is something you practise.</p>
            <a href="#events" onClick={scrollTo}>Discover Hawks <ArrowUpRight size={18} /></a>
          </div>
        </div>
        <div className="story-stats">
          <div><strong>08</strong><span>Sports<br />to explore</span></div>
          <div><strong>01</strong><span>Club<br />for everyone</span></div>
          <div><strong>∞</strong><span>Ways to<br />move forward</span></div>
        </div>
      </section>

      <section className="events-section" id="events">
        <div className="section-heading">
          <p className="section-kicker">02 — On the calendar</p>
          <h2>Make your<br /><em>move.</em></h2>
        </div>
        <div className="event-list">
          {upcomingEvents.map((event) => (
            <article className="event-row" key={event.title}>
              <span className="event-date">{event.date}</span>
              <h3>{event.title}</h3>
              <span className="event-type">{event.type}</span>
              <a href="#pricing" onClick={scrollTo} aria-label={`Learn more about ${event.title}`}><ArrowUpRight size={24} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <p className="section-kicker">03 — Your starting line</p>
        <div className="pricing-content">
          <h2>Every great<br /><em>run begins here.</em></h2>
          <div>
            <p>One club membership. Every reason to show up.</p>
            <a href="mailto:hello@hawksclub.in" className="dark-cta">Become a Hawk <ArrowUpRight size={20} /></a>
          </div>
        </div>
      </section>

      <section className="blog-section" id="blog">
        <div className="section-heading">
          <p className="section-kicker">04 — From the club</p>
          <h2>Keep<br /><em>moving.</em></h2>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <article className="post" key={post.number}>
              <span>{post.number}</span>
              <p>{post.tag}</p>
              <h3>{post.title}</h3>
              <a href="mailto:hello@hawksclub.in">Read story <ArrowUpRight size={17} /></a>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <a className="footer-logo" href="#home" onClick={scrollTo} aria-label="Back to the top"><img src="/images/hawks-logo-transparent.png" alt="Hawks Sports Club" /></a>
        <p>Hawks Sports Club<br />Bhagalpur, Bihar</p>
        <a href="mailto:hello@hawksclub.in">hello@hawksclub.in</a>
      </footer>
    </main>
  );
}
