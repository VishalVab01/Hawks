"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Menu, MoveRight, Play, X } from "lucide-react";

const programs = [
  { no: "01", title: "Play", text: "Cricket, badminton, table tennis, chess, esports and more—competition with heart.", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=85" },
  { no: "02", title: "Create", text: "Debates, culture, photography and painting that make young voices visible.", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85" },
  { no: "03", title: "Lead", text: "Personality, entrepreneurship and social action for the leaders Bihar deserves.", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=85" },
];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useGSAP(() => {
    gsap.from(".hero-reveal", { y: 90, opacity: 0, duration: 1.05, stagger: .13, ease: "power4.out", delay: .15 });
    gsap.from(".hero-card", { y: 50, opacity: 0, scale: .96, duration: 1.2, ease: "power3.out", delay: .6 });
    gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => gsap.from(el, { scrollTrigger: { trigger: el, start: "top 88%" }, y: 50, opacity: 0, duration: .85, ease: "power3.out" }));
  }, { scope: root });
  useEffect(() => { const links = document.querySelectorAll('a[href^="#"]'); const go = (e: Event) => { e.preventDefault(); document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href")!)?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }; links.forEach(l=>l.addEventListener("click",go)); return ()=>links.forEach(l=>l.removeEventListener("click",go)); }, []);

  return <main ref={root}>
    <style jsx global>{`.logo-plaque{background:var(--cream);padding:5px 8px;width:96px;height:53px}.logo-plaque img{width:100%;height:100%;object-fit:contain}.footer-logo{width:180px;height:99px;padding:9px 12px}`}</style>
    <nav className="nav"><a className="brand logo-plaque" href="#top" aria-label="Hawks Sports Club home"><img src="/images/hawks-club-logo.png" alt="Hawks Sports Club" /></a><div className="navlinks"><a href="#about">Our story</a><a href="#programs">What we do</a><a href="#events">Events</a></div><a href="#join" className="join-link">JOIN THE CLUB <ArrowUpRight size={17}/></a><button className="menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen?<X/>:<Menu/>}</button></nav>
    {menuOpen && <div className="mobile-menu"><a href="#about">Our story</a><a href="#programs">What we do</a><a href="#events">Events</a><a href="#join">Join the club</a></div>}

    <section id="top" className="hero"><div className="hero-grid"></div><div className="hero-copy"><p className="eyebrow hero-reveal"><span></span> PATNA · BIHAR · INDIA</p><h1><span className="hero-reveal">FOR THE</span><em className="hero-reveal">FUTURE</em><span className="hero-reveal">OF PLAY.</span></h1><p className="intro hero-reveal">A youth club where sport becomes confidence, curiosity becomes purpose, and every young person gets room to rise.</p><a className="circle-cta hero-reveal" href="#about"><ArrowDownRight size={27}/><span>EXPLORE<br/>HAWKS</span></a></div><div className="hero-card"><div className="hero-image"></div><div className="hero-card-bottom"><span>EST. 2024</span><span>YOUTH IN MOTION</span></div><div className="orbit-text">• PLAY WITH PURPOSE • PLAY WITH PURPOSE •</div></div><div className="side-number">01<br/><span>/ 05</span></div></section>

    <div className="ticker"><div>SPORT <b>✦</b> CULTURE <b>✦</b> COMMUNITY <b>✦</b> POSSIBILITY <b>✦</b> SPORT <b>✦</b> CULTURE <b>✦</b> COMMUNITY <b>✦</b> POSSIBILITY <b>✦</b></div></div>

    <section id="about" className="about section"><p className="eyebrow reveal"><span></span> 01 / THE HAWKS WAY</p><div className="about-top"><h2 className="reveal">WE DON&apos;T JUST<br/><i>BUILD ATHLETES.</i></h2><p className="reveal">We train for the whole person. Hawks Youth Club brings young people together through games, creativity and community—unlocking the confidence to shape a better Bihar.</p></div><div className="statement reveal"><span>“</span><p>Every court, every field, every idea is a chance to <em>discover what you’re capable of.</em></p></div></section>

    <section id="programs" className="programs section"><div className="section-head"><p className="eyebrow"><span></span> 02 / FIND YOUR ARENA</p><h2>MORE THAN<br/><i>A GAME.</i></h2><p>Choose your starting point. Build your own path.</p></div><div className="program-list">{programs.map((p,i)=><motion.article className="program-card" key={p.title} initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.1,duration:.6}}><div className="program-pic" style={{backgroundImage:`linear-gradient(0deg,rgba(9,24,28,.6),transparent 55%),url(${p.image})`}}></div><div className="program-details"><span>{p.no}</span><h3>{p.title}</h3><p>{p.text}</p><a href="#join"><MoveRight size={22}/></a></div></motion.article>)}</div></section>

    <section className="numbers"><div className="numbers-image"></div><div className="numbers-panel"><p className="eyebrow"><span></span> THE BIGGER PICTURE</p><h2>ON A MISSION<br/>TO <i>MOVE</i> BIHAR.</h2><p>From friendly first matches to the national stage—we are creating space for young people to thrive, contribute and lead.</p><div className="stats"><div><strong>8+</strong><span>SPORTS &<br/>ACTIVITIES</span></div><div><strong>∞</strong><span>ROOM TO<br/>GROW</span></div></div></div></section>

    <section id="events" className="events section"><p className="eyebrow reveal"><span></span> 03 / WHAT&apos;S NEXT</p><div className="event-title reveal"><h2>MAKE YOUR<br/><i>MOVE.</i></h2><a href="#join">VIEW ALL EVENTS <ArrowUpRight size={18}/></a></div><div className="event-grid reveal"><article className="featured-event"><div className="event-date"><b>14</b><span>AUG<br/>2026</span></div><div><p>HAWKS OPEN</p><h3>CHESS<br/>CHAMPIONSHIP</h3><a href="#join">REGISTER <ArrowUpRight size={17}/></a></div></article><article className="event-line"><span>01</span><div><p>COMING SOON</p><h3>Interclub Cricket League</h3></div><ArrowUpRight/></article><article className="event-line"><span>02</span><div><p>COMING SOON</p><h3>Drone & Design Challenge</h3></div><ArrowUpRight/></article></div></section>

    <section id="join" className="join"><div className="join-bg"></div><div className="join-content"><p className="eyebrow"><span></span> YOUR TEAM IS WAITING</p><h2>COME<br/><i>SOAR</i><br/>WITH US.</h2><p>Whether you’re ready to compete, create or make a difference, there&apos;s a place for you at Hawks.</p><a href="mailto:hello@hawksclub.in" className="white-button">BECOME A HAWK <ArrowUpRight size={19}/></a></div><div className="join-badge"><Play size={21} fill="currentColor"/><span>START<br/>SOMETHING<br/>GREAT</span></div></section>

    <footer><a className="brand logo-plaque footer-logo" href="#top" aria-label="Hawks Sports Club home"><img src="/images/hawks-club-logo.png" alt="Hawks Sports Club" /></a><p>Sport. Purpose. Possibility.<br/>Built for Bihar&apos;s next generation.</p><div><a href="#top">INSTAGRAM</a><a href="mailto:hello@hawksclub.in">EMAIL US</a></div><small>© 2026 HAWKS YOUTH CLUB</small></footer>
  </main>;
}
