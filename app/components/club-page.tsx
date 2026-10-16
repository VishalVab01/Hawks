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

const sports = [
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
  { src: "https://theperformancelab.ca/parallax/i1.webp", alt: "Young athletes working together on court", speed: 18 },
  { src: "https://theperformancelab.ca/parallax/i2.webp", alt: "Athlete sprinting during practice", speed: 34 },
  { src: "https://theperformancelab.ca/parallax/i3.webp", alt: "Athlete building strength", speed: 26 },
  { src: "https://theperformancelab.ca/parallax/i4.webp", alt: "Coach supporting an athlete", speed: 42 },
  { src: "https://theperformancelab.ca/parallax/i5.webp", alt: "Runner preparing to start", speed: 22 },
  { src: "https://theperformancelab.ca/parallax/i6.webp", alt: "Athlete in motion", speed: 38 },
];

const introSportsImages = {
  cricket: "/images/home-sports/cricket.jpg",
  badminton: "/images/home-sports/badminton.jpg",
  chess: "/images/home-sports/chess.jpg",
  esports: "/images/home-sports/mobile-esports.jpg",
};

const galleryPhotos = [
  ...collage,
  { src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=700&q=80", alt: "Cricket players meeting on the field", speed: 20 },
  { src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=700&q=80", alt: "Basketball players in a gym", speed: 28 },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=700&q=80", alt: "Football match on a field", speed: 24 },
  { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80", alt: "Runners racing on a track", speed: 32 },
];

const programs = [
  { number: "001", title: "Team sports", text: "Learn the game, trust your teammates, and discover what you can do together.", image: "https://theperformancelab.ca/parallax/i1.webp", alt: "Team sports practice" },
  { number: "002", title: "Creative Arts & Expression", text: "Explore art, storytelling, and hands-on projects that spark imagination and help young people express themselves.", image: "/images/programs/creative-arts.jpg", alt: "Art materials ready for a creative workshop" },
  { number: "003", title: "Entrepreneurship", text: "Turn ideas into action. Learn creativity, problem-solving, teamwork, and the basics of bringing a project to life.", image: "/images/programs/entrepreneurship.jpg", alt: "Open notebook with plans and ideas" },
  { number: "004", title: "Community sessions", text: "Open sessions to try something new, meet people, and find your place in the club.", image: "https://images.unsplash.com/photo-1680024436315-fb06267264b2?auto=format&fit=crop&fm=jpg&q=80&w=1200", alt: "Young people playing soccer together at a community session" },
];

const journal = [
  { number: "01", tag: "Club notes", title: "Progress is made one practice at a time" },
  { number: "02", tag: "For families", title: "A good team is a place to belong" },
  { number: "03", tag: "On the move", title: "Small goals. Big energy." },
];

const footerGroups = [
  { title: "Club", links: [["Our story", "/story"], ["Our people", "/team"], ["Your first steps", "/pricing"], ["Get involved", "/pricing"]] },
  { title: "Programs", links: [["Team sports", "/events"], ["Creative Arts & Expression", "/events"], ["Entrepreneurship", "/events"], ["Community sessions", "/events"]] },
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
    let targetRotation = 0;
    let rotation = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let frame = 0;
    let lastFrameTime = 0;

    const render = (time: number) => {
      frame = 0;
      const elapsed = lastFrameTime ? Math.min(64, time - lastFrameTime) : 16.67;
      lastFrameTime = time;
      const frameScale = elapsed / 16.67;
      const scrollEase = reducedMotion ? 1 : 1 - Math.pow(1 - 0.2, frameScale);
      const pointerEase = reducedMotion ? 1 : 1 - Math.pow(1 - 0.16, frameScale);
      rotation += (targetRotation - rotation) * scrollEase;
      tiltX += (targetTiltX - tiltX) * pointerEase;
      tiltY += (targetTiltY - tiltY) * pointerEase;
      stage.style.setProperty("--ring-rotation", `${rotation}deg`);
      stage.style.setProperty("--ring-tilt-x", `${tiltX}deg`);
      stage.style.setProperty("--ring-tilt-y", `${tiltY}deg`);
      if (Math.abs(targetRotation - rotation) > 0.05 || Math.abs(targetTiltX - tiltX) > 0.02 || Math.abs(targetTiltY - tiltY) > 0.02) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const updateProgress = (progress: number) => {
      const turn = reducedMotion ? 180 : 360;
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
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetTiltX = -y * 7;
      targetTiltY = x * 7;
      scheduleRender();
    };
    const resetPointer = () => {
      targetTiltX = 0;
      targetTiltY = 0;
      scheduleRender();
    };
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", resetPointer);
    updateProgress(trigger.progress);
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      trigger.kill();
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", resetPointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="orbit-gallery-section" id="gallery" ref={sectionRef} data-nav-theme="dark" aria-label="Hawks sports photo gallery">
      <div className="orbit-gallery-stage" ref={stageRef}>
        <div className="orbit-gallery-view">
          <div className="orbit-gallery-ring" ref={ringRef} role="list" aria-label="Hawks sports photo carousel">
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

const tunnelPositions = [
  { x: "0px", y: "clamp(-190px, -15vw, -60px)" },
  { x: "clamp(-420px, -30vw, -90px)", y: "0px" },
  { x: "clamp(90px, 30vw, 420px)", y: "0px" },
  { x: "0px", y: "clamp(60px, 15vw, 190px)" },
];

function InfiniteImageGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const layers = layersRef.current.filter((layer): layer is HTMLDivElement => layer !== null);
    const layerCount = layers.length;
    const spacing = 1800;
    const tunnelLength = layerCount * spacing;
    // Let each layer travel close to the camera plane. CSS perspective scales
    // the photos up naturally until they fill the viewport and pass out of view.
    const nearestZ = window.innerWidth < 760 ? 900 : 1260;
    const farZ = nearestZ - tunnelLength;
    const motion = { position: tunnelLength - spacing / 2 };
    let targetPosition = motion.position;
    let touchY = 0;

    const renderTunnel = () => {
      motion.position += (targetPosition - motion.position) * 0.075;
      layers.forEach((layer, index) => {
        // Positive wheel movement advances progress, moves Z toward the camera,
        // and adds a little explicit scale on top of the CSS perspective.
        const progress = ((motion.position - index * spacing) % tunnelLength + tunnelLength) % tunnelLength;
        const depthProgress = progress / tunnelLength;
        const z = farZ + progress;
        gsap.set(layer, {
          x: index === 1 ? 140 : 0,
          y: index === 1 ? 55 : 0,
          z,
          scale: 0.82 + depthProgress * 0.18,
          autoAlpha: 1,
        });
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetPosition += event.deltaY * 0.45;
    };
    const handleTouchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const nextY = event.touches[0]?.clientY ?? touchY;
      targetPosition += (touchY - nextY) * 1.3;
      touchY = nextY;
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") targetPosition += spacing * 0.35;
      if (event.key === "ArrowUp" || event.key === "PageUp") targetPosition -= spacing * 0.35;
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) gsap.ticker.add(renderTunnel);
    else layers.forEach((layer, index) => gsap.set(layer, {
      x: index === 1 ? 140 : 0,
      y: index === 1 ? 55 : 0,
      z: nearestZ - (index * spacing + spacing / 2),
      scale: 0.82 + ((tunnelLength - (index * spacing + spacing / 2)) / tunnelLength) * 0.18,
      autoAlpha: 1,
    }));

    if (!reducedMotion) {
      stage.addEventListener("wheel", handleWheel, { passive: false });
      stage.addEventListener("touchstart", handleTouchStart, { passive: true });
      stage.addEventListener("touchmove", handleTouchMove, { passive: false });
      stage.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      gsap.ticker.remove(renderTunnel);
      if (!reducedMotion) {
        stage.removeEventListener("wheel", handleWheel);
        stage.removeEventListener("touchstart", handleTouchStart);
        stage.removeEventListener("touchmove", handleTouchMove);
        stage.removeEventListener("keydown", handleKeyDown);
      }
      gsap.set(layers, { clearProps: "transform,opacity,visibility" });
    };
  }, []);

  return (
    <section className="image-slider-page" aria-labelledby="image-slider-title">
      <div className="image-slider-heading"><p>HAWKS YOUTH CLUB</p><h1 id="image-slider-title">MOVE AS ONE</h1></div>
      <div className="image-slider-field" ref={stageRef} aria-label="Scroll to move through the Hawks sports photo tunnel" tabIndex={0}>
        {Array.from({ length: 2 }, (_, layerIndex) => (
          <div className="image-tunnel-layer" key={layerIndex} ref={(node) => { layersRef.current[layerIndex] = node; }}>
            {tunnelPositions.map((position, photoIndex) => {
              const photo = galleryPhotos[(layerIndex * tunnelPositions.length + photoIndex) % galleryPhotos.length];
              return <figure className={`image-tunnel-photo image-tunnel-photo-${photoIndex + 1}`} key={`${layerIndex}-${photoIndex}`} style={{
                "--photo-x": position.x, "--photo-y": position.y, "--photo-tilt": "0deg",
              } as CSSProperties}>
                <img src={photo.src} alt={photo.alt} loading={layerIndex < 2 ? "eager" : "lazy"} />
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
        {[...collage, ...collage].map((photo, index) => <img key={`${photo.src}-${index}`} src={photo.src} alt="" />)}
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
      <form className="join-application-form" action="mailto:hello@hawksclub.in?subject=Hawks%20Club%20Membership%20Application" method="post" encType="text/plain">
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
          <h1>MADE TO<br />MOVE <em>TOGETHER.</em></h1>
          <div className="story-about-mission">
            <p className="story-about-label">OUR MISSION</p>
            <p>Founded in Bhagalpur in 2019 by Mr. O.P. Singh, Hawks Youth Club helps children grow into confident, capable individuals.</p>
            <a href="/pricing" onClick={onNavigate}>FIND YOUR PLACE <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <span className="story-about-index">01 — 04 <span>SCROLL TO EXPLORE</span></span>
      </section>

      <section className="story-about-gallery" data-nav-theme="light" aria-label="Life at Hawks">
        <figure className="story-about-photo story-about-photo-one"><img src={collage[0].src} alt="Young athletes sharing a moment after practice" /><figcaption>SHOW UP FOR EACH OTHER <span>01</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-two"><img src={collage[1].src} alt="Young athlete running during training" /><figcaption>FIND YOUR OWN PACE <span>02</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-three"><img src={collage[3].src} alt="Coach supporting an athlete through practice" /><figcaption>GROW WITH GOOD PEOPLE <span>03</span></figcaption></figure>
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
          <p>Good sport is about more than the scoreboard. It’s how you feel when you walk in, what you learn along the way, and who’s cheering when you try.</p>
        </div>
        <div className="story-about-values">
          <article><span>01 / BELONGING</span><h3>There’s a place for you.</h3><p>Start wherever you are. We make space for different interests, abilities, and ways of finding your game.</p></article>
          <article><span>02 / COURAGE</span><h3>Progress takes practice.</h3><p>Try something unfamiliar, celebrate small wins, and learn that confidence grows one step at a time.</p></article>
          <article><span>03 / TEAMWORK</span><h3>We rise together.</h3><p>Encouragement matters. We build teams that respect each other and make every person feel seen.</p></article>
        </div>
      </section>

      <section className="story-about-cta" data-nav-theme="light">
        <p className="story-about-label">YOUR NEXT MOVE STARTS HERE</p>
        <h2>Come find<br /><em>your team.</em></h2>
        <a href="/pricing" onClick={onNavigate}>JOIN THE CLUB <ArrowUpRight size={17} /></a>
      </section>
    </div>
  );
}

const officeBearers = [
  { role: "Chief Patron", name: "Mr O.P. Singh" },
  { role: "President", name: "Mr. Arnav Kejriwal" },
  { role: "1st Vice President", name: "Mr. Rishav Chaudhary" },
  { role: "2nd Vice President", name: "Mr. Vishal Vaibhav" },
  { role: "3rd Vice President", name: "Ms Sumedha Modi" },
  { role: "Secretary General", name: "Dikshant Shekhar" },
  { role: "Treasurer", name: "Abhinav Singh" },
  { role: "Public Relation Officer", name: "Akshar Divya" },
];

const executiveCommittee = [
  "Mr Rajarajeshwar Shivam Shroff",
  "Mr Yashraj Shroff",
  "Mr Rasendu Agarwal",
  "Mr Manan Srivastava",
  "Mr Labya Kumar",
  "Mr Harshit Bajoriya",
  "Mr Harsh Jain",
  "Mr Krishana Banka",
  "Mr Aditya Shah",
  "Mr Piyush Sarogi",
  "Mr Kumar Aditya",
  "Mr Kumar Amitesh",
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
      <div className="team-officer-grid">{officeBearers.map((person, index) => <article className="team-officer" key={person.role}><span className="team-card-index">{String(index + 1).padStart(2, "0")}</span><div><p>{person.role}</p><h3>{person.name}</h3></div><span className="team-card-mark" aria-hidden="true">↗</span></article>)}</div>
    </section>
    <section className="team-committee" data-nav-theme="light" aria-labelledby="team-committee-title">
      <div className="team-section-heading"><p className="eyebrow">02 — The wider team</p><h2 id="team-committee-title">Executive<br /><em>committee.</em></h2><p>Working together to create more opportunities for every young person in our community.</p></div>
      <ol className="team-committee-list">{executiveCommittee.map((name, index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><span aria-hidden="true">↗</span></li>)}</ol>
    </section>
  </div>;
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
    const counter = root.querySelector<HTMLElement>(".loader-counter");
    const progress = root.querySelector<HTMLElement>(".loader-progress-fill");
    const heroImage = root.querySelector<HTMLImageElement>(".hero-backdrop-image");
    if (!loader || !counter || !progress || !heroImage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(loader, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(heroImage, { width: "100%", height: "100%" });
      return;
    }

    const count = { value: 0 };
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      timeline.to(count, {
        value: 100,
        duration: 2.7,
        ease: "power2.inOut",
        onUpdate: () => { counter.textContent = String(Math.round(count.value)).padStart(3, "0"); },
      }, 0);
      timeline.to(progress, { scaleX: 1, duration: 2.7, ease: "power2.inOut" }, 0);
      timeline.to(heroImage, { width: "100%", height: "100%", duration: 2.7, ease: "power3.inOut" }, 0);
      timeline.to(loader, { autoAlpha: 0, duration: 0.36, ease: "power2.out", onComplete: () => { gsap.set(loader, { pointerEvents: "none" }); } }, 2.54);
    }, root);

    return () => ctx.revert();
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
    <main ref={revealRoot}>
      {isHome && <div className="site-loader" aria-hidden="true">
        <div className="loader-topline"><span>HAWKS SPORTS CLUB</span><span>RISE TOGETHER</span></div>
        <div className="loader-main"><span className="loader-label">MADE TO MOVE</span><span className="loader-counter">000</span><span className="loader-percent">%</span></div>
        <div className="loader-bottomline"><span className="loader-progress"><span className="loader-progress-fill" /></span><span>PREPARING YOUR NEXT MOVE</span><span>01 / 01</span></div>
      </div>}
      <header className={`site-header${isHome ? "" : " site-header-interior"}`} data-nav-theme={navTheme}>
        <a className="site-logo" href="/" onClick={navigateClick} aria-label="Hawks Sports Club home"><img src="/images/hawks-logo-transparent.png" alt="Hawks Sports Club" /></a>
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
      {isHome && <section className="hero" id="home" data-nav-theme="dark">
        <img className="hero-backdrop-image" src="/images/runner-hero.jpg" alt="" aria-hidden="true" />
        <div className="hero-title" aria-label="Where champions are made"><span>Where</span><span>Champions</span><span>Are Made</span></div>
        <div className="hero-intro"><p>Hawks Sports Club is built for young people ready to move with focus, purpose and confidence.</p><p>Find your team, challenge your limits and make your next move count.</p></div>
          <a className="hero-cta" href="#programs" onClick={scrollTo}><span>Unlock your potential</span><ArrowUpRight size={22} strokeWidth={1.75} /></a>
      </section>}

      {(isHome) && <section className="sports-strip" data-nav-theme="light" aria-label="Sports and activities at Hawks">
        <div className="sports-track">
          {[0, 1].map((set) => (
            <div className="sports-set" key={set} aria-hidden={set === 1}>
              {sports.map(({ name, icon }) => (
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
          <div className="intro-lead-copy"><p className="eyebrow">WHAT IS HAWKS SPORTS CLUB</p><h2>Helping young people move better, grow together, and find their game.</h2></div>
        </div>
        <div className="intro-detail">
          <IntroMovingImage className="intro-float intro-float-left intro-parallax-image" src={introSportsImages.chess} alt="Black and white chess knights facing each other" />
          <div className="intro-detail-panel"><span className="intro-plus intro-plus-left">+</span><span className="intro-plus intro-plus-right">+</span><p className="eyebrow">THE HAWKS WAY</p><h3>Find your game. Whether you’re learning a new sport, building lifelong confidence, or looking for a team, we’re here to help you take your next step.</h3><p className="intro-detail-copy">Try something new, discover what you’re good at, and grow alongside people who have your back. Our coaches help you build skills, healthy habits, and confidence you can carry beyond the court or field. Every practice is a chance to learn, belong, and move forward together.</p><a className="intro-detail-cta" href="/pricing" onClick={navigateClick}>LEARN MORE ABOUT HAWKS <ArrowUpRight size={18} /></a></div>
          <IntroMovingImage className="intro-float intro-float-right intro-parallax-image" src={introSportsImages.esports} alt="Mobile esports gameplay on a smartphone" />
        </div>
        <IntroMotionBand />
      </section>}

      {(isHome || page === "events") && <section className="program-section" id="programs" data-nav-theme="dark">
        <div className="program-heading"><div><p className="eyebrow">01 — Find your game</p><h2>Room to<br /><em>move.</em></h2></div><p className="section-intro">There’s more than one way to be an athlete. Explore a program, learn the fundamentals, and find the kind of movement that makes you want to come back.</p></div>
        <div className="program-grid">{programs.map((program) => <article className="program-card" key={program.number}><div className="program-image"><img src={program.image} alt={program.alt} loading="lazy" /></div><div className="program-meta"><span>PROGRAM</span><span>{program.number}</span></div><h3>{program.title}</h3><p>{program.text}</p><a href="/pricing" onClick={navigateClick}>Explore the program <ArrowUpRight size={16} /></a></article>)}</div>
      </section>}

      {isHome && <OrbitalGallery />}

      {isHome && <section className="quote-section" data-nav-theme="dark"><p className="eyebrow">A note from the club</p><QuoteTrail /><div className="quote-byline"><span className="quote-mark">H</span><span>O.P Singh<br /><small>Founder</small></span></div></section>}

      {page === "blog" && <section className="journal-section" id="journal"><div className="journal-heading"><div><p className="eyebrow">04 — Notes from the club</p><h2>Keep<br /><em>moving.</em></h2></div><a className="text-link" href="/pricing" onClick={navigateClick}>More from Hawks <ArrowUpRight size={17} /></a></div><div className="journal-grid">{journal.map((post) => <article className="journal-card" key={post.number}><div className="journal-art"><span className="journal-art-number">{post.number}</span><span className="journal-orbit" /></div><div className="journal-meta"><span>{post.tag}</span><span>{post.number}</span></div><h3>{post.title}</h3><a href="/story" onClick={navigateClick}>Read the story <ArrowUpRight size={16} /></a></article>)}</div></section>}

      {isHome && <section className="join-section" id="join" data-nav-theme="orange"><div><p className="eyebrow">Your next move starts here</p><h2>Come find<br /><em>your team.</em></h2></div><div className="join-copy"><p>New to sport or ready for a new challenge? There’s a place for you at Hawks.</p><a className="dark-cta" href="mailto:hello@hawksclub.in">Get in touch <ArrowUpRight size={19} /></a><span>Families and young athletes are welcome to reach out.</span></div></section>}

      {page === "pricing" && <JoinClubApplication />}

      {page !== "image-slider" && page !== "story" && <footer className="hawks-footer" id="footer" data-nav-theme="dark">
        <div className="hawks-footer-cta"><h2>Hawks Together.<br />Rise Together.</h2><div className="hawks-footer-actions"><a className="hawks-footer-secondary" href="/events" onClick={navigateClick}>Explore programs</a><a className="hawks-footer-primary" href="/pricing" onClick={navigateClick}>Join the club</a></div></div>
        <FooterHands />
        <div className="hawks-footer-content">
          <ul className="hawks-footer-quicklinks">{footerQuickLinks.map(({ title, href, icon: Icon }) => <li className={title === "Programs" || title === "Club journal" ? "footer-mobile-hide" : undefined} key={title}><a href={href} onClick={href.startsWith("/") ? navigateClick : undefined}><Icon size={18} strokeWidth={1.7} /><span>{title}</span><span className="hawks-footer-arrow"><FooterArrow /></span></a></li>)}</ul>
          <div className="hawks-footer-link-grid">
            {footerGroups.map((group) => <div className={`hawks-footer-link-group${group.title === "Programs" ? " footer-mobile-hide" : ""}`} key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li className={label === "Club journal" ? "footer-mobile-hide" : undefined} key={label}><a href={href} onClick={navigateClick}>{label}</a></li>)}</ul></div>)}
            <div className="hawks-footer-link-group"><h3>Contact</h3><ul><li><a href="mailto:hello@hawksclub.in">hello@hawksclub.in</a></li><li><span>Families and young athletes are welcome.</span></li><li><span>Come find your team.</span></li><li><a href="/pricing" onClick={navigateClick}>Get in touch</a></li></ul></div>
          </div>
          <p className="hawks-footer-copyright">© 2026 Hawks Youth Club. All rights reserved.</p>
        </div>
      </footer>}
    </main>
  );
}

