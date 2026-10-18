"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall, faBasketball, faChessKnight, faFutbol, faGamepad, faLightbulb, faPalette, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight, BookOpen, Mail, Menu, Trophy, UsersRound, X } from "lucide-react";
import FooterHands from "./footer-hands";
import { usePageTransition, transitionClick } from "./page-transition";

type PageKind = "home" | "story" | "events" | "pricing" | "blog" | "image-slider" | "team";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/story" },
  { label: "Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Join", href: "/pricing" },
  { label: "Gallery", href: "/image-slider" },
];

const activities = [
  { name: "Football", icon: faFutbol },
  { name: "Cricket", icon: faBaseballBatBall },
  { name: "Basketball", icon: faBasketball },
  { name: "Badminton", icon: faTableTennisPaddleBall },
  { name: "Creative Arts & Expression", icon: faPalette },
  { name: "Entrepreneurship", icon: faLightbulb },
  { name: "Chess", icon: faChessKnight },
  { name: "Gaming", icon: faGamepad },
];

const collage = [
  { src: "https://theperformancelab.ca/parallax/i1.webp", alt: "Young people working together during a group activity", speed: 18 },
  { src: "https://theperformancelab.ca/parallax/i2.webp", alt: "Young person building confidence through movement", speed: 34 },
  { src: "https://theperformancelab.ca/parallax/i3.webp", alt: "Young person developing healthy habits", speed: 26 },
  { src: "https://theperformancelab.ca/parallax/i4.webp", alt: "Mentor encouraging a young person", speed: 42 },
  { src: "https://theperformancelab.ca/parallax/i5.webp", alt: "Young person preparing to take part", speed: 22 },
  { src: "https://theperformancelab.ca/parallax/i6.webp", alt: "Young person learning through activity", speed: 38 },
];

const introSportsImages = {
  cricket: "/images/home-sports/cricket.jpg",
  badminton: "/images/home-sports/badminton.jpg",
  chess: "/images/home-sports/chess.jpg",
  esports: "/images/home-sports/mobile-esports.jpg",
};

const galleryPhotos = [
  { src: "/images/gallery/club-photo-01.jpg", alt: "Hawks youth members receiving certificates and medals", speed: 18 },
  { src: "/images/gallery/club-photo-02.jpg", alt: "Hawks members presenting a trophy at Bhagalpur National College", speed: 34 },
  { src: "/images/gallery/club-photo-03.jpg", alt: "Club members gathering after a Hawks event", speed: 26 },
  { src: "/images/gallery/club-photo-05.jpg", alt: "Hawks members celebrating together", speed: 42 },
  { src: "/images/gallery/club-photo-06.jpg", alt: "Young club members at a community gathering", speed: 22 },
  { src: "/images/gallery/club-photo-09.jpg", alt: "Young esports tournament winners with their awards", speed: 38 },
  { src: "/images/gallery/club-photo-10.jpg", alt: "Hawks member speaking at an awards ceremony", speed: 20 },
  { src: "/images/gallery/club-photo-13.jpg", alt: "Tournament team posing with medals and trophies", speed: 28 },
  { src: "/images/gallery/club-photo-14.jpg", alt: "Hawks members receiving recognition at an event", speed: 24 },
  { src: "/images/gallery/club-photo-17.jpg", alt: "Young members celebrating together", speed: 32 },
  { src: "/images/gallery/club-photo-20.jpg", alt: "Trophies and medals from the Hawks tournament", speed: 24 },
  { src: "/images/gallery/club-photo-23.jpg", alt: "Members gathered at a Hawks community event", speed: 30 },
];

const tunnelPhotos = [
  "Youth award winners holding their certificates and medals",
  "Hawks members presenting a trophy at Bhagalpur National College",
  "Club members gathering after an event",
  "Hawks New Year celebration beneath yellow and white balloons",
  "Members celebrating together at a club event",
  "Young club members at a community gathering",
  "Hawks members sharing a meal",
  "Club representative meeting with local leaders",
  "Young esports tournament winners with their awards",
  "Hawks member speaking at an awards ceremony",
  "BGMI LAN tournament award winners",
  "A young player receiving an esports award",
  "Tournament team posing with medals and trophies",
  "Hawks members receiving recognition at an event",
  "Newspaper coverage of a Hawks esports tournament",
  "Hawks founder O.P. Singh at the India AI Impact Summit",
  "Young members celebrating together",
  "Newspaper coverage of the BGMI LAN tournament",
  "Hawks representatives at an MSME event",
  "Trophies and medals from the Hawks tournament",
  "Club members celebrating a milestone",
  "Hawks founder meeting with a Bihar government official",
  "Members gathered at a Hawks community event",
].map((alt, index) => ({
  src: `/images/gallery/club-photo-${String(index + 1).padStart(2, "0")}.jpg`,
  alt,
}));

const programs = [
  { number: "001", title: "Sports & recreation", text: "Take part, learn together, and build discipline, teamwork, and confidence through sports and games.", image: "/images/programs/sports-recreation-art.png", alt: "Screen-printed illustration of young people playing basketball together" },
  { number: "002", title: "Creative Arts & Expression", text: "Explore art, storytelling, and hands-on projects that spark imagination and give young people room to express themselves.", image: "/images/programs/creative-arts-editorial.png", alt: "Illustrated youth art workshop with expressive paint and paper shapes" },
  { number: "003", title: "Entrepreneurship", text: "Turn ideas into action. Build creativity, problem-solving, communication, and the confidence to bring a project to life.", image: "/images/programs/entrepreneurship-editorial.png", alt: "Illustration of young people growing an idea into a community venture" },
  { number: "004", title: "Community & life skills", text: "Meet people, share ideas, and practise the communication and social skills that help everyone contribute.", image: "/images/programs/community-life-editorial.png", alt: "Illustration of young people connecting through conversation and shared ideas" },
];

const eventHighlights = [
  { number: "17 OCT 2026", title: "Agri startups meet Banka farmers", text: "On 17 October 2026, Aapan Mithla Foundation and AU Bio Tech, founded by Sumit Jha and Uttam Kumar, brought together more than 100 farmers in rural Banka. Mentored by O.P. Singh, Chief Patron of Hawks Youth Club, the startups hosted guidance on organic farming with Mr. Prabhat Kumar Singh, Deputy Director, ATMA, Bihar Agriculture Department. Congratulations to the founders for taking this work to the ground level.", image: "/images/events/banka-agri-startup-program.jpeg", alt: "Farmers and organizers at a rural agriculture program in Banka district", imagePosition: "center 62%" },
  { number: "BHAGALPUR · FM MALL", title: "Bhagalpur’s first large-scale esports tournament", text: "Hawks Youth Club brought young gamers from Bihar and Jharkhand together at Saraswati Banquet Hall, FM Mall. The tournament celebrated digital skills, critical thinking, and technology-based learning, with winners and participants recognized for their efforts.", image: "/images/events/bhagalpur-esports-tournament.jpeg", alt: "Newspaper coverage of the first large-scale esports tournament organized by Hawks Youth Club", imageFit: "contain" },
  { number: "22 MAY 2026", title: "Honouring Shri Vikas Vaibhav, IPS", text: "Shri Vikas Vaibhav, IPS, Inspector General of Police, Magadh Range, Gaya, was felicitated by Shri O.P. Singh, President, Hawks Sports Club, on 22 May 2026.", image: "/images/events/vikas-vaibhav-felicitation.jpeg", alt: "Shri Vikas Vaibhav, IPS, being felicitated by Shri O.P. Singh", imagePosition: "center 25%" },
  { number: "24 MAY 2026", title: "Friendly Cricket Match 2026", text: "Held in Patna under the Let’s Inspire Bihar campaign, the friendly match brought together the Central Core Team and Disease Awareness Chapter. The Disease Awareness Chapter won a spirited game that celebrated teamwork, discipline, and health awareness.", image: "/images/events/friendly-cricket-match.jpeg", alt: "Newspaper coverage of the Friendly Cricket Match 2026 in Patna", imageFit: "contain" },
];

const journal = [
  { number: "01", tag: "Club notes", title: "Confidence grows when every child gets a chance" },
  { number: "02", tag: "For families", title: "A welcoming community gives young people room to grow" },
  { number: "03", tag: "Everyday skills", title: "Small steps build character and leadership" },
];

const footerGroups = [
  { title: "Club", links: [["Our story", "/story"], ["Our people", "/team"], ["Your first steps", "/pricing"], ["Get involved", "/pricing"]] },
  { title: "Programs", links: [["Sports & recreation", "/events"], ["Creative Arts & Expression", "/events"], ["Entrepreneurship", "/events"], ["Community & life skills", "/events"]] },
  { title: "Explore", links: [["Club journal", "/blog"], ["Upcoming events", "/events"], ["For families", "/pricing"], ["Contact Hawks", "/pricing"]] },
];

const footerQuickLinks = [
  { title: "Our story", href: "/story", icon: UsersRound },
  { title: "Programs", href: "/events", icon: Trophy },
  { title: "Club journal", href: "/blog", icon: BookOpen },
  { title: "Get in touch", href: "mailto:hello@hawksclub.in", icon: Mail },
];

function FooterArrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

function MovingPhoto({ image, index }: { image: (typeof collage)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [image.speed, -image.speed]);
  return <motion.div ref={ref} className={`club-photo club-photo-${index + 1}`} style={{ y }}><img src={image.src} alt={image.alt} /></motion.div>;
}

function IntroMovingImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [48, -88]);
  return <motion.img ref={ref} className={className} src={src} alt={alt} style={{ y }} />;
}

function OrbitalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const cards = cardsRef.current.filter((card): card is HTMLDivElement => card !== null);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileViewport = window.matchMedia("(max-width: 760px)").matches;
    let targetRotation = 0;
    let rotation = 0;
    let frame = 0;
    let lastFrameTime = 0;

    const render = (time: number) => {
      frame = 0;
      const elapsed = lastFrameTime ? Math.min(64, time - lastFrameTime) : 16.67;
      lastFrameTime = time;
      const frameScale = elapsed / 16.67;
      const scrollEase = reducedMotion ? 1 : 1 - Math.pow(1 - 0.14, frameScale);
      rotation += (targetRotation - rotation) * scrollEase;
      stage.style.setProperty("--ring-rotation", `${rotation}deg`);
      if (Math.abs(targetRotation - rotation) > 0.05) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const updateProgress = (progress: number) => {
      const turn = reducedMotion ? 180 : mobileViewport ? 720 : 360;
      targetRotation = -progress * turn;
      const cardStep = 360 / cards.length;
      const nextIndex = Math.round((progress * turn) / cardStep) % cards.length;
      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
      scheduleRender();
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => updateProgress(self.progress),
      onRefresh: (self) => updateProgress(self.progress),
    });
    updateProgress(trigger.progress);
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      trigger.kill();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="orbit-gallery-section" id="gallery" ref={sectionRef} data-nav-theme="dark" aria-label="Hawks Youth Club photo gallery">
      <div className="orbit-gallery-stage" ref={stageRef}>
        <div className="orbit-gallery-view">
          <div className="orbit-gallery-ring orbit-gallery-ring-back" role="presentation" aria-hidden="true">
            {galleryPhotos.map((photo, index) => (
              <div className="orbit-card" key={`back-${photo.src}-${index}`} style={{ "--card-angle": `${(index * 360) / galleryPhotos.length + 18}deg` } as CSSProperties}>
                <img src={photo.src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="orbit-gallery-ring" ref={ringRef} role="list" aria-label="Hawks Youth Club community and activity photos">
            {galleryPhotos.map((photo, index) => (
              <div className="orbit-card" key={`${photo.src}-${index}`} ref={(node) => { cardsRef.current[index] = node; }} style={{ "--card-angle": `${(index * 360) / galleryPhotos.length}deg` } as CSSProperties} role="listitem" aria-label={photo.alt}>
                <img src={photo.src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <article className="orbit-gallery-featured" aria-live="polite" aria-atomic="true">
            <div className="orbit-gallery-featured-image"><img key={galleryPhotos[activeIndex].src} src={galleryPhotos[activeIndex].src} alt={galleryPhotos[activeIndex].alt} /></div>
            <p>{galleryPhotos[activeIndex].alt}</p>
          </article>
        </div>
        <p className="orbit-gallery-footer"><span aria-hidden="true">↓</span> Scroll to explore</p>
      </div>
    </section>
  );
}

const tunnelImageCount = 4;

function InfiniteImageGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const layers = layersRef.current.filter((layer): layer is HTMLDivElement => layer !== null);
    const layerGap = 2500;
    const tunnelDepth = layers.length * layerGap;
    const exitPoint = 900;
    const visibleDepth = layerGap * 3;
    const initialScroll = tunnelDepth - 100;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileViewport = window.matchMedia("(max-width: 760px)").matches;
    const scrollEase = reducedMotion ? 1 : mobileViewport ? 0.15 : 0.075;
    const wheelSensitivity = mobileViewport ? 2.5 : 0.75;
    const touchSensitivity = mobileViewport ? 2.8 : 0.84;
    const scroll = { target: initialScroll, current: initialScroll };

    const getOverlay = (z: number) => {
      if (z > exitPoint) return 1;
      if (z > 0) return z / exitPoint;
      if (z > -visibleDepth) return Math.pow(Math.abs(z) / visibleDepth, 2);
      return 1;
    };
    const renderTunnel = () => {
      scroll.current += (scroll.target - scroll.current) * scrollEase;
      layers.forEach((layer, index) => {
        const baseZ = -index * layerGap;
        let z = ((baseZ + scroll.current) % tunnelDepth + tunnelDepth) % tunnelDepth;
        if (z > exitPoint) z -= tunnelDepth;
        const overlay = getOverlay(z);
        gsap.set(layer, { z, visibility: overlay >= 1 ? "hidden" : "visible" });
        layer.style.setProperty("--layer-overlay", String(overlay));
      });
    };
    const handleWheel = (event: WheelEvent) => {
      if (!stage.isConnected) return;
      scroll.target += event.deltaY * wheelSensitivity;
    };
    const handleTouchStart = (event: TouchEvent) => { stage.dataset.touchY = String(event.touches[0]?.clientY ?? 0); };
    const handleTouchMove = (event: TouchEvent) => {
      const previousY = Number(stage.dataset.touchY ?? 0);
      const nextY = event.touches[0]?.clientY ?? previousY;
      scroll.target += (previousY - nextY) * touchSensitivity;
      stage.dataset.touchY = String(nextY);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") scroll.target += layerGap * 0.35;
      if (event.key === "ArrowUp" || event.key === "PageUp") scroll.target -= layerGap * 0.35;
    };

    renderTunnel();
    if (!reducedMotion) gsap.ticker.add(renderTunnel);
    window.addEventListener("wheel", handleWheel, { passive: true });
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("keydown", handleKeyDown);

    return () => {
      gsap.ticker.remove(renderTunnel);
      window.removeEventListener("wheel", handleWheel);
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("keydown", handleKeyDown);
      gsap.set(layers, { clearProps: "transform,visibility" });
    };
  }, []);

  return (
    <section className="image-slider-page" aria-labelledby="image-slider-title">
      <div className="image-slider-heading"><p>HAWKS YOUTH CLUB</p><h1 id="image-slider-title">MOVE AS ONE</h1></div>
      <div className="image-slider-field" ref={stageRef} aria-label="Scroll to move through the Hawks Youth Club photo gallery" tabIndex={0}>
        {Array.from({ length: Math.max(6, Math.ceil(tunnelPhotos.length / tunnelImageCount)) }, (_, layerIndex) => (
          <div className="image-tunnel-layer" key={layerIndex} ref={(node) => { layersRef.current[layerIndex] = node; }}>
            {Array.from({ length: tunnelImageCount }, (_, photoIndex) => {
              const photoIndexInSet = (layerIndex % Math.ceil(tunnelPhotos.length / tunnelImageCount)) * tunnelImageCount + photoIndex;
              if (photoIndexInSet >= tunnelPhotos.length) return null;
              const photo = tunnelPhotos[photoIndexInSet];
              return <figure className={`image-tunnel-photo image-tunnel-photo-${photoIndex + 1}`} key={`${layerIndex}-${photoIndex}`}>
                <img src={photo.src} alt={photo.alt} loading={layerIndex < 8 ? "eager" : "lazy"} />
                <div className="image-tunnel-overlay" aria-hidden="true" />
              </figure>;
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function IntroMotionBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const firstLine = useTransform(scrollYProgress, [0, 1], ["-4%", "-24%"]);
  const secondLine = useTransform(scrollYProgress, [0, 1], ["-18%", "2%"]);
  const thirdLine = useTransform(scrollYProgress, [0, 1], ["-2%", "-22%"]);

  return (
    <>
      <div className="intro-motion-band" ref={ref} aria-label="The Hawks way: move, learn, grow together">
        <motion.div className="intro-motion-line intro-motion-line-one" style={{ x: firstLine }} aria-hidden="true">THE HAWKS WAY TO GROW</motion.div>
        <motion.div className="intro-motion-line intro-motion-line-two" style={{ x: secondLine }} aria-hidden="true">MOVE · LEARN · BELONG ·</motion.div>
        <motion.div className="intro-motion-line intro-motion-line-three" style={{ x: thirdLine }} aria-hidden="true">TOGETHER WE GO FURTHER</motion.div>
        <div className="intro-motion-mark" aria-hidden="true"><img src="/images/hawks-logo-transparent.png" alt="" /></div>
        <span className="intro-motion-plus intro-motion-plus-left" aria-hidden="true">+</span>
        <span className="intro-motion-plus intro-motion-plus-right" aria-hidden="true">+</span>
      </div>
      <div className="intro-image-strip" aria-hidden="true">
        {[...galleryPhotos.slice(0, 6), ...galleryPhotos.slice(0, 6)].map((photo, index) => <img key={`${photo.src}-${index}`} src={photo.src} alt="" />)}
      </div>
    </>
  );
}

function QuoteTrail() {
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    let active = true;
    let fluid: { destroy: () => void } | null = null;
    const fluidScript = document.createElement("script");
    fluidScript.src = "/liquid-cursor.js";
    fluidScript.async = true;
    fluidScript.dataset.manual = "";
    fluidScript.onload = () => {
      const liquidCursor = (window as Window & {
        LiquidCursor?: (options: {
          target: HTMLElement;
          gain: number;
          dyeFade: number;
          motionFade: number;
          curl: number;
          radius: number;
          force: number;
          simRes: number;
          dyeRes: number;
          colors: number[][];
        }) => { destroy: () => void } | null;
      }).LiquidCursor;
      if (!active || !liquidCursor) return;
      fluid = liquidCursor({
        target: surface,
        gain: 0.24,
        dyeFade: 0.88,
        motionFade: 0.58,
        curl: 34,
        radius: 0.2,
        force: 2600,
        simRes: 112,
        dyeRes: 384,
        colors: [[1, 0.2, 0.055], [1, 0.36, 0.08], [1, 0.62, 0.18], [0.98, 0.12, 0.08]],
      });
    };
    document.head.appendChild(fluidScript);
    return () => {
      active = false;
      fluid?.destroy();
      fluidScript.remove();
    };
  }, []);

  return (
    <div className="quote-trail-surface" ref={surfaceRef}>
      <blockquote className="quote-reveal">“The best part is having people around you who cheer you on, even when you’re still learning.”</blockquote>
    </div>
  );
}

function JoinClubApplication() {
  return (
    <section className="join-application" data-nav-theme="light" aria-labelledby="join-application-title">
      <div className="join-application-heading">
        <p className="eyebrow">HAWKS YOUTH CLUB · MEMBERSHIP</p>
        <h1 id="join-application-title">Make your<br /><em>next move.</em></h1>
        <p>Tell us a little about yourself and what you’d like to try. A parent or guardian can send the application for you.</p>
      </div>
      <form className="join-application-form" action="mailto:hello@hawksclub.in?subject=Hawks%20Youth%20Club%20Membership%20Enquiry" method="post" encType="text/plain">
        <div className="join-form-field">
          <label htmlFor="young-person-name">Young person’s name</label>
          <input id="young-person-name" name="Young person's name" autoComplete="name" required />
        </div>
        <div className="join-form-field join-form-field-short">
          <label htmlFor="young-person-age">Age</label>
          <input id="young-person-age" name="Age" type="number" min="5" max="18" inputMode="numeric" required />
        </div>
        <div className="join-form-field">
          <label htmlFor="guardian-name">Parent or guardian’s name</label>
          <input id="guardian-name" name="Parent or guardian's name" autoComplete="name" required />
        </div>
        <div className="join-form-field">
          <label htmlFor="guardian-email">Parent or guardian’s email</label>
          <input id="guardian-email" name="Parent or guardian's email" type="email" autoComplete="email" required />
        </div>
        <div className="join-form-field">
          <label htmlFor="guardian-phone">Phone number</label>
          <input id="guardian-phone" name="Phone number" type="tel" autoComplete="tel" />
        </div>
        <div className="join-form-field">
          <label htmlFor="club-interest">What would you like to try?</label>
          <select id="club-interest" name="Activity of interest" defaultValue="" required>
            <option value="" disabled>Select an activity</option>
            <option>Football</option><option>Cricket</option><option>Basketball</option><option>Badminton</option>
            <option>Creative Arts & Expression</option><option>Entrepreneurship</option><option>Chess</option><option>Gaming</option><option>Not sure yet</option>
          </select>
        </div>
        <div className="join-form-field join-form-field-wide">
          <label htmlFor="join-message">Anything else we should know? <span>Optional</span></label>
          <textarea id="join-message" name="Additional details" rows={3} />
        </div>
        <p className="join-form-note">Submitting opens your email app with these details ready to send to the Hawks team.</p>
        <button className="join-form-submit" type="submit">Send membership enquiry <ArrowUpRight size={18} /></button>
      </form>
    </section>
  );
}

function StoryPageContent({ onNavigate }: { onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <div className="story-page">
      <section className="story-about-hero" data-nav-theme="light">
        <p className="story-about-kicker">HAWKS YOUTH CLUB <span>·</span> OUR STORY</p>
        <div className="story-about-hero-grid">
          <h1>MADE TO<br />GROW <em>TOGETHER.</em></h1>
          <div className="story-about-mission">
            <p className="story-about-label">OUR MISSION</p>
            <p>Founded in Bhagalpur in 2019 by Mr. O.P. Singh, Hawks Youth Club helps children grow into confident, capable individuals.</p>
            <a href="/pricing" onClick={onNavigate}>FIND YOUR PLACE <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <span className="story-about-index">01 — 04 <span>SCROLL TO EXPLORE</span></span>
      </section>

      <section className="story-about-gallery" data-nav-theme="light" aria-label="Life at Hawks">
        <figure className="story-about-photo story-about-photo-one"><img src="/images/story-belonging.png" alt="Illustrated circle of young people sharing a sense of belonging" /><figcaption>SHOW UP FOR EACH OTHER <span>01</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-two"><img src="/images/story-growth.png" alt="Illustrated young person stepping toward new possibilities" /><figcaption>FIND YOUR OWN PACE <span>02</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-three"><img src="/images/story-mentorship.png" alt="Illustrated mentor reaching out to help a young person grow" /><figcaption>GROW WITH GOOD PEOPLE <span>03</span></figcaption></figure>
      </section>

      <section className="story-about-intro" data-nav-theme="light">
        <p className="story-about-label">INTRODUCTION</p>
        <div>
          <h2>Every child deserves<br /><em>room to grow.</em></h2>
          <p><strong>Hawks Youth Club, Bhagalpur</strong> was founded in 2019 by <strong>Mr. O.P. Singh</strong> with a vision to nurture children and help them grow into confident, capable individuals.</p>
          <p>The club was created to provide a platform where every child gets <strong>equal opportunities for all-round development</strong> — not just in academics, but in sports, personality development, and essential life skills.</p>
          <p>Our aim is to build <strong>discipline, teamwork, and leadership</strong> through sports and extracurricular activities, while also focusing on <strong>character building, communication, and social values</strong>.</p>
          <p>At Hawks Youth Club, we believe that with the right guidance, mentorship, and exposure, children can achieve excellence and become responsible citizens who contribute meaningfully to society at large.</p>
        </div>
      </section>

      <section className="story-about-marquee" data-nav-theme="light" aria-label="Move, learn, belong, grow">
        <div className="story-about-marquee-track"><span>MOVE · LEARN · BELONG · GROW ·&nbsp;</span><span aria-hidden="true">MOVE · LEARN · BELONG · GROW ·&nbsp;</span></div>
      </section>

      <section className="story-about-approach" data-nav-theme="light">
        <div className="story-about-approach-heading">
          <p className="story-about-label">HOW WE DO IT</p>
          <h2>A CLUB THAT<br />GROWS <em>with you.</em></h2>
          <p>Growth happens when every young person has the chance to participate, discover their strengths, and learn alongside a supportive community.</p>
        </div>
        <div className="story-about-values">
          <article><span>01 / OPPORTUNITY</span><h3>There’s room for everyone.</h3><p>Every child deserves equal opportunity to explore interests, build confidence, and take part.</p></article>
          <article><span>02 / CHARACTER</span><h3>Learn by doing.</h3><p>Sports and extracurricular activities help young people grow in discipline, communication, and resilience.</p></article>
          <article><span>03 / COMMUNITY</span><h3>We grow together.</h3><p>Mentorship and teamwork build leadership, social values, and a sense of responsibility to others.</p></article>
        </div>
      </section>

      <section className="story-about-cta" data-nav-theme="light">
        <p className="story-about-label">YOUR NEXT CHAPTER STARTS HERE</p>
        <h2>Find your place<br /><em>to grow.</em></h2>
        <a href="/pricing" onClick={onNavigate}>JOIN THE CLUB <ArrowUpRight size={17} /></a>
      </section>
    </div>
  );
}

const officeBearers = [
  { role: "Chief Patron", name: "Mr O.P. Singh", image: "/images/team/op-singh.jpg" },
  { role: "President", name: "Mr. Arnav Kejriwal", image: "/images/team/arnav-kejriwal.jpg" },
  { role: "1st Vice President", name: "Mr. Rishav Chaudhary", image: "/images/team/rishav-chaudhary.jpg" },
  { role: "2nd Vice President", name: "Mr. Vishal Vaibhav", image: "/images/team/vishal-vaibhav.jpg" },
  { role: "3rd Vice President", name: "Ms Sumedha Modi", image: "/images/team/sumedha-modi.jpg" },
  { role: "Secretary General", name: "Dikshant Shekhar", image: "/images/team/dikshant-shekhar.jpg" },
  { role: "Treasurer", name: "Abhinav Singh", image: "/images/team/abhinav-singh.jpg" },
  { role: "Public Relation Officer", name: "Akshar Divya", image: "/images/team/akshar-divya.jpg" },
];

const executiveCommittee = [
  { name: "Mr Rajarajeshwar Shivam Shroff", image: "/images/team/rajarajeshwar-shivam.jpg" },
  { name: "Mr Yashraj Shroff", image: "/images/team/yashraj-shroff.jpg" },
  { name: "Mr Rasendu Agarwal", image: "/images/team/rasendu-agarwal.jpg" },
  { name: "Mr Manan Srivastava", image: "/images/team/manan-srivastava.jpg" },
  "Mr Labya Kumar",
  { name: "Mr Harshit Bajoriya", image: "/images/team/harshit-bajoriya.jpg" },
  "Mr Harsh Jain",
  "Mr Krishana Banka",
  "Mr Aditya Shah",
  "Mr Piyush Sarogi",
  { name: "Mr Kumar Aditya", image: "/images/team/kumar-aditya.jpg" },
  { name: "Mr Kumar Amitesh", image: "/images/team/kumar-amitesh.jpg" },
  "Mr Rahul Sharma",
  "Mr Aaditya",
  "Mr Yash",
];

function TeamPageContent() {
  return <div className="team-page">
    <section className="team-page-hero" data-nav-theme="dark">
      <p className="team-page-kicker">HAWKS YOUTH CLUB <span>·</span> BHAGALPUR</p>
      <div className="team-page-hero-main">
        <div><p className="eyebrow">THE PEOPLE WHO LEAD US</p><h1>Our<br /><em>team.</em></h1></div>
        <p className="team-page-intro">Meet the office bearers and executive committee guiding Hawks Youth Club forward.</p>
      </div>
      <div className="team-page-term"><span>OFFICE BEARERS OF THE CLUB</span><span>2026 — 2028</span></div>
    </section>
    <section className="team-officers" data-nav-theme="dark" aria-labelledby="team-officers-title">
      <div className="team-section-heading"><p className="eyebrow">01 — Leadership</p><h2 id="team-officers-title">Office bearers<span>.</span></h2></div>
      <div className="team-officer-grid">{officeBearers.map((person, index) => <article className="team-officer" key={person.role}><div className="team-officer-visual"><span className="team-card-index">{String(index + 1).padStart(2, "0")}</span><div className="team-officer-photo">{person.image ? <img src={person.image} alt={`${person.name} portrait`} /> : <span>{person.name.split(/\s+/).slice(-2).map((part) => part[0]).join("")}</span>}</div></div><div className="team-officer-copy"><p>{person.role}</p><h3>{person.name}</h3></div><span className="team-card-mark" aria-hidden="true">↗</span></article>)}</div>
    </section>
    <section className="team-committee" data-nav-theme="light" aria-labelledby="team-committee-title">
      <div className="team-section-heading"><p className="eyebrow">02 — The wider team</p><h2 id="team-committee-title">Executive<br /><em>committee.</em></h2><p>Working together to create more opportunities for every young person in our community.</p></div>
      <ol className="team-committee-list">{executiveCommittee.map((member, index) => { const person: { name: string; image?: string } = typeof member === "string" ? { name: member } : member; return <li key={person.name}><span>{String(index + 1).padStart(2, "0")}</span><span className="team-committee-photo">{person.image ? <img src={person.image} alt={`${person.name} portrait`} /> : person.name.split(/\s+/).slice(-2).map((part) => part[0]).join("")}</span><h3>{person.name}</h3><span aria-hidden="true">↗</span></li>; })}</ol>
    </section>
  </div>;
}

function EventsPageIntro({ onExplore }: { onExplore: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <section className="events-page-intro" data-nav-theme="light" aria-labelledby="events-page-title">
      <div className="events-page-copy">
        <p className="eyebrow">HAWKS YOUTH CLUB <span>·</span> BHAGALPUR</p>
        <h1 id="events-page-title">A place to<br /><em>show up.</em></h1>
        <p className="events-page-lede">Club events bring young people together to participate, discover new interests, and celebrate what they can achieve as a community.</p>
        <a className="events-page-link" href="#programs" onClick={onExplore}>Explore ways to take part <ArrowUpRight size={18} /></a>
      </div>
      <figure className="events-page-photo">
        <img src="/images/gallery/club-photo-13.jpg" alt="Hawks members celebrating together at a club event" />
        <figcaption><span>COMMUNITY · PARTICIPATION · GROWTH</span><span>01 / 01</span></figcaption>
      </figure>
      <div className="events-page-foot"><span>OPEN TO YOUNG PEOPLE AND FAMILIES</span><span>GROWING TOGETHER SINCE 2019 <i aria-hidden="true">✳</i></span></div>
    </section>
  );
}

export function ClubPage({ page = "home" }: { page?: PageKind }) {
  const lenis = useRef<Lenis | null>(null);
  const revealRoot = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [navTheme, setNavTheme] = useState<"dark" | "light" | "orange">(page === "story" || page === "pricing" ? "light" : "dark");
  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = usePageTransition();
  const navigateClick = transitionClick(navigate);
  const isHome = page === "home";

  const toggleMenu = () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
    if (menuOpen) {
      setMenuOpen(false);
      menuCloseTimer.current = setTimeout(() => setMenuMounted(false), 420);
      return;
    }
    setMenuMounted(true);
    requestAnimationFrame(() => setMenuOpen(true));
  };

  useEffect(() => () => {
    if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current);
  }, []);

  useEffect(() => {
    const root = revealRoot.current;
    const header = root?.querySelector<HTMLElement>(".site-header");
    if (!root || !header) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-theme]:not(.site-header)"));
    const updateTheme = () => {
      const headerLine = Math.min(window.innerHeight - 1, Math.max(1, header.getBoundingClientRect().height / 2));
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= headerLine && bounds.bottom > headerLine;
      });
      if (current) setNavTheme(current.dataset.navTheme as "dark" | "light" | "orange");
    };

    setNavTheme(page === "story" || page === "pricing" ? "light" : "dark");
    updateTheme();
    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);
    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, [page]);

  useEffect(() => {
    if (page === "image-slider") return;
    gsap.registerPlugin(ScrollTrigger);
    const smoothScroll = new Lenis({ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.15, respectReducedMotion: true });
    smoothScroll.on("scroll", ScrollTrigger.update);
    let rafId = 0;
    const raf = (time: number) => { smoothScroll.raf(time); rafId = requestAnimationFrame(raf); };
    lenis.current = smoothScroll;
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); smoothScroll.off("scroll", ScrollTrigger.update); smoothScroll.destroy(); lenis.current = null; };
  }, [page]);

  useEffect(() => {
    const root = revealRoot.current;
    if (!root) return;

    const loader = root.querySelector<HTMLElement>(".site-loader");
    const hero = root.querySelector<HTMLElement>(".hero");
    const counter = root.querySelector<HTMLElement>(".loader-counter");
    const progress = root.querySelector<HTMLElement>(".loader-progress-fill");
    if (!loader || !hero || !counter || !progress) return;
    const heroTitleLines = root.querySelectorAll<HTMLElement>(".hero-title span");
    const heroCopy = root.querySelectorAll<HTMLElement>(".hero-intro p");
    const heroCta = root.querySelector<HTMLElement>(".hero-cta");
    const heroHeaderItems = root.querySelectorAll<HTMLElement>(".site-header .site-logo, .site-header .desktop-nav a, .site-header .header-cta, .site-header .mobile-menu-button");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      root.classList.remove("home-loading");
      gsap.set(loader, { autoAlpha: 0, pointerEvents: "none" });
      const heroEntranceElements = [
        ...Array.from(heroHeaderItems),
        ...Array.from(heroTitleLines),
        ...Array.from(heroCopy),
        ...(heroCta ? [heroCta] : []),
      ];
      gsap.set(heroEntranceElements, { clearProps: "all" });
      gsap.set(hero, { clearProps: "transform,zIndex" });
      return;
    }

    const count = { value: 0 };
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      timeline.to(count, {
        value: 100,
        duration: 2.15,
        ease: "power2.inOut",
        onUpdate: () => { counter.textContent = String(Math.round(count.value)).padStart(3, "0"); },
      }, 0);
      timeline.to(progress, { scaleX: 1, duration: 2.15, ease: "power2.inOut" }, 0);
      timeline.fromTo(hero, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 1.05, ease: "power4.inOut", onComplete: () => {
        root.classList.remove("home-loading");
        gsap.set(loader, { autoAlpha: 0, pointerEvents: "none" });
      } }, 2.15);
      timeline.fromTo(heroHeaderItems, { autoAlpha: 0, y: 18, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.72, stagger: 0.055, ease: "power3.out" }, 3.24);
      timeline.fromTo(heroTitleLines, { autoAlpha: 0, y: 52, filter: "blur(14px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, stagger: 0.12, ease: "power4.out" }, 3.24);
      timeline.fromTo(heroCopy, { autoAlpha: 0, y: 28, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.82, stagger: 0.11, ease: "power3.out" }, 3.48);
      if (heroCta) timeline.fromTo(heroCta, { autoAlpha: 0, y: 26, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.82, ease: "power3.out" }, 3.62);
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = revealRoot.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const candidates = gsap.utils.toArray<HTMLElement>(
        "section:not(.hero):not(.orbit-gallery-section) > *, .program-card, .team-officer, .team-committee-list > li, .story-about-photo, .intro-lead-copy > *, .intro-detail-panel > *, .hawks-footer-cta, .hawks-footer-content > *, .image-slider-heading",
        root,
      );
      const revealItems = candidates.filter((element, index) =>
        candidates.indexOf(element) === index &&
        !element.matches(".image-slider-field, .intro-image-strip, .intro-motion-band, .intro-parallax-image, .orbit-gallery-section, .image-tunnel-layer") &&
        !element.closest(".hero, .orbit-gallery-section, .image-slider-field, .intro-image-strip, .intro-motion-band, .intro-parallax-image, .image-tunnel-layer")
      );

      gsap.set(revealItems, { autoAlpha: 0, y: 34, filter: "blur(9px)" });
      ScrollTrigger.batch(revealItems, {
        start: "top 90%",
        onEnter: revealBatch,
        onEnterBack: revealBatch,
        onLeaveBack: (batch) => gsap.to(batch, {
          autoAlpha: 0,
          y: 34,
          filter: "blur(9px)",
          duration: 0.48,
          stagger: 0.045,
          ease: "power2.inOut",
          overwrite: "auto",
        }),
      });

      function revealBatch(batch: Element[]) {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.82,
          stagger: 0.09,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }, root);

    return () => ctx.revert();
  }, [page]);

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
    <main ref={revealRoot} className={isHome ? "home-loading" : undefined}>
      {isHome && <div className="site-loader" aria-hidden="true">
        <div className="loader-topline"><span>HAWKS YOUTH CLUB</span><span>RISE TOGETHER</span></div>
        <div className="loader-main"><span className="loader-label">MADE TO GROW</span><span className="loader-counter">000</span><span className="loader-percent">%</span></div>
        <div className="loader-bottomline"><span className="loader-progress"><span className="loader-progress-fill" /></span><span>GROWING TOGETHER</span><span>01 / 01</span></div>
      </div>}
      <header className={`site-header${isHome ? "" : " site-header-interior"}`} data-nav-theme={navTheme}>
        <a className="site-logo" href="/" onClick={navigateClick} aria-label="Hawks Youth Club home">Hawks Youth Club</a>
        <nav className="desktop-nav" aria-label="Primary navigation">{navigation.map((item) => <a href={item.href} onClick={navigateClick} key={item.label} aria-current={page === (item.href === "/" ? "home" : item.href.slice(1)) ? "page" : undefined}>{item.label}</a>)}</nav>
        <a className="header-cta" href="/pricing" onClick={navigateClick}><span>Join the club</span><ArrowUpRight className="header-cta-arrow" size={16} aria-hidden="true" /></a>
        <button className={`mobile-menu-button${menuOpen ? " is-open" : ""}`} onClick={toggleMenu} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          <span className="menu-icon-lines" aria-hidden="true"><span /><span /></span>
        </button>
        {menuMounted && <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {navigation.map((item, index) => <a href={item.href} onClick={(event) => { navigateClick(event); setMenuOpen(false); if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current); menuCloseTimer.current = setTimeout(() => setMenuMounted(false), 420); }} key={item.label} aria-current={page === (item.href === "/" ? "home" : item.href.slice(1)) ? "page" : undefined} style={{ "--menu-index": index } as CSSProperties}>{item.label}</a>)}
        </nav>}
      </header>
      {page === "image-slider" && <InfiniteImageGallery />}
      {page === "story" && <StoryPageContent onNavigate={navigateClick} />}
      {page === "team" && <TeamPageContent />}
      {page === "events" && <EventsPageIntro onExplore={scrollTo} />}
      {isHome && <section className="hero" id="home" data-nav-theme="dark">
        <div className="hero-title" aria-label="A place to grow together"><span>A Place</span><span>To Grow</span><span>Together</span></div>
        <div className="hero-intro"><p>Founded in Bhagalpur, Hawks Youth Club helps children become confident, capable, and caring individuals.</p><p>Discover new interests, build life skills, and grow with a community that believes in you.</p></div>
          <a className="hero-cta" href="#programs" onClick={scrollTo}><span>Unlock your potential</span><ArrowUpRight size={22} strokeWidth={1.75} /></a>
      </section>}

      {(isHome) && <section className="sports-strip" data-nav-theme="light" aria-label="Sports and activities at Hawks Youth Club">
        <div className="sports-track">
          {[0, 1].map((set) => (
            <div className="sports-set" key={set} aria-hidden={set === 1}>
              {activities.map(({ name, icon }) => (
                <div className="sport-item" key={`${set}-${name}`}>
                  <span className="sport-icon"><FontAwesomeIcon icon={icon} aria-hidden="true" /></span>
                  <span>{name}</span>
                  <span className="sport-divider" aria-hidden="true">✳</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>}

      {isHome && <section className="intro-section" id="story" data-nav-theme="light">
        <IntroMovingImage className="intro-float intro-float-top intro-parallax-image" src={introSportsImages.cricket} alt="Cricket ball resting in vivid green grass" />
        <div className="intro-lead">
          <IntroMovingImage className="intro-lead-image intro-parallax-image" src={introSportsImages.badminton} alt="Badminton shuttlecocks on a green court" />
          <div className="intro-lead-copy"><p className="eyebrow">WHAT IS HAWKS YOUTH CLUB</p><h2>Helping young people grow in confidence, character, and capability.</h2></div>
        </div>
        <div className="intro-detail">
          <IntroMovingImage className="intro-float intro-float-left intro-parallax-image" src={introSportsImages.chess} alt="Black and white chess knights facing each other" />
          <div className="intro-detail-panel"><span className="intro-plus intro-plus-left">+</span><span className="intro-plus intro-plus-right">+</span><p className="eyebrow">THE HAWKS WAY</p><h3>Every child deserves the chance to learn, take part, and discover what they can become.</h3><p className="intro-detail-copy">Through sports and extracurricular activities, children build discipline, teamwork, and leadership. Creative expression, entrepreneurship, mentorship, and community help develop character, communication, and essential life skills.</p><a className="intro-detail-cta" href="/story" onClick={navigateClick}>LEARN ABOUT OUR STORY <ArrowUpRight size={18} /></a></div>
          <IntroMovingImage className="intro-float intro-float-right intro-parallax-image" src={introSportsImages.esports} alt="Mobile esports gameplay on a smartphone" />
        </div>
        <IntroMotionBand />
      </section>}

      {(isHome || page === "events") && <section className={`program-section${page === "events" ? " events-program-section" : ""}`} id="programs" data-nav-theme="dark">
        <div className="program-heading"><div><p className="eyebrow">{page === "events" ? "02 — Find your way in" : "01 — Ways to grow"}</p><h2>{page === "events" ? <>Ways to<br /><em>take part.</em></> : <>Room to<br /><em>discover.</em></>}</h2></div><p className="section-intro">{page === "events" ? "From sports and games to creative expression, entrepreneurship, and community life, there are many ways for every child to participate and grow." : "From sports and games to creative expression, entrepreneurship, and community life, every child can explore interests and develop skills beyond the classroom."}</p></div>
        <div className="program-grid">{(page === "events" ? eventHighlights : programs).map((card) => <article className={`program-card${page === "events" ? " event-feature-card" : ""}`} key={card.number}>
          <div className={`program-image${"imageFit" in card && card.imageFit === "contain" ? " event-image-contain" : ""}${card.image.includes("vikas-vaibhav") ? " vikas-event-image" : ""}`}><img src={card.image} alt={card.alt} loading="lazy" style={{ objectPosition: ("imagePosition" in card ? card.imagePosition : undefined) as CSSProperties["objectPosition"] }} /></div>
          <div className="program-meta"><span>{page === "events" ? "COMMUNITY EVENT" : "PROGRAM"}</span><span>{card.number}</span></div>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <a href="/pricing" onClick={navigateClick}>{page === "events" ? "Join a future gathering" : "Explore the program"} <ArrowUpRight size={16} /></a>
        </article>)}</div>
      </section>}

      {isHome && <OrbitalGallery />}

      {isHome && <section className="quote-section" data-nav-theme="dark"><p className="eyebrow">A note from the club</p><QuoteTrail /><div className="quote-byline"><span className="quote-portrait-frame"><img className="quote-portrait" src="/images/op-singh-portrait.jpeg" alt="O.P. Singh speaking at a community event" /></span><span>O.P Singh<br /><small>Founder</small></span></div></section>}

      {page === "blog" && <section className="journal-section" id="journal"><div className="journal-heading"><div><p className="eyebrow">04 — Notes from the club</p><h2>Keep<br /><em>moving.</em></h2></div><a className="text-link" href="/pricing" onClick={navigateClick}>More from Hawks <ArrowUpRight size={17} /></a></div><div className="journal-grid">{journal.map((post) => <article className="journal-card" key={post.number}><div className="journal-art"><span className="journal-art-number">{post.number}</span><span className="journal-orbit" /></div><div className="journal-meta"><span>{post.tag}</span><span>{post.number}</span></div><h3>{post.title}</h3><a href="/story" onClick={navigateClick}>Read the story <ArrowUpRight size={16} /></a></article>)}</div></section>}

      {isHome && <section className="join-section developer-note-section" id="join" data-nav-theme="orange"><div className="developer-note-identity"><p className="eyebrow">A little note from your website maker</p><h2>Hey, I’m<br /><em>Vishal.</em></h2></div><div className="join-copy"><p>I built this little corner of the internet for Hawks Youth Club. If you’re curious about the work or have an idea of your own, come say hello.</p><div className="developer-note-portfolio-row"><a className="dark-cta" href="https://vishalvaibhavportfolio.vercel.app/" target="_blank" rel="noreferrer">Have a look at my portfolio <ArrowUpRight size={19} /></a><img src="/images/vishal-vaibhav-portfolio.jpg" alt="Vishal Vaibhav" /></div><span>Made with care for the Hawks community.</span></div></section>}

      {page === "pricing" && <JoinClubApplication />}

      {page !== "image-slider" && page !== "story" && <footer className="hawks-footer" id="footer" data-nav-theme="dark">
        <div className="hawks-footer-cta"><h2>Hawks Together.<br />Rise Together.</h2><div className="hawks-footer-actions"><a className="hawks-footer-secondary" href="/events" onClick={navigateClick}>Explore programs</a><a className="hawks-footer-primary" href="/pricing" onClick={navigateClick}>Join the club</a></div></div>
        <FooterHands />
        <div className="hawks-footer-content">
          <ul className="hawks-footer-quicklinks">{footerQuickLinks.map(({ title, href, icon: Icon }) => <li className={title === "Programs" || title === "Club journal" ? "footer-mobile-hide" : undefined} key={title}><a href={href} onClick={href.startsWith("/") ? navigateClick : undefined}><Icon size={18} strokeWidth={1.7} /><span>{title}</span><span className="hawks-footer-arrow"><FooterArrow /></span></a></li>)}</ul>
          <div className="hawks-footer-link-grid">
            {footerGroups.map((group) => <div className={`hawks-footer-link-group${group.title === "Programs" ? " footer-mobile-hide" : ""}`} key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li className={label === "Club journal" ? "footer-mobile-hide" : undefined} key={label}><a href={href} onClick={navigateClick}>{label}</a></li>)}</ul></div>)}
            <div className="hawks-footer-link-group"><h3>Contact</h3><ul><li><a href="mailto:hello@hawksclub.in">hello@hawksclub.in</a></li><li><span>Families and young people are welcome.</span></li><li><span>Find your place to grow.</span></li><li><a href="/pricing" onClick={navigateClick}>Get in touch</a></li></ul></div>
          </div>
          <p className="hawks-footer-copyright">© 2026 Hawks Youth Club. All rights reserved.</p>
        </div>
      </footer>}
    </main>
  );
}

