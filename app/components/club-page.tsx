"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall, faBasketball, faChessKnight, faDumbbell, faFutbol, faGamepad, faPersonRunning, faTableTennisPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight, BookOpen, Mail, Menu, Trophy, UsersRound, X } from "lucide-react";
import FooterHands from "./footer-hands";
import { usePageTransition, transitionClick } from "./page-transition";

type PageKind = "home" | "story" | "events" | "pricing" | "blog" | "image-slider";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/story" },
  { label: "Events", href: "/events" },
  { label: "Join", href: "/pricing" },
  { label: "Gallery", href: "/image-slider" },
];

const sports = [
  { name: "Football", icon: faFutbol },
  { name: "Cricket", icon: faBaseballBatBall },
  { name: "Basketball", icon: faBasketball },
  { name: "Badminton", icon: faTableTennisPaddleBall },
  { name: "Athletics", icon: faPersonRunning },
  { name: "Strength", icon: faDumbbell },
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
  { number: "002", title: "Athletics", text: "Build speed, coordination, and confidence one small personal best at a time.", image: "https://theperformancelab.ca/parallax/i2.webp", alt: "Athlete running" },
  { number: "003", title: "Strength & movement", text: "Move well, get stronger, and build habits that support an active life.", image: "https://theperformancelab.ca/parallax/i3.webp", alt: "Athlete strength training" },
  { number: "004", title: "Community sessions", text: "Open sessions to try something new, meet people, and find your place in the club.", image: "https://theperformancelab.ca/parallax/i6.webp", alt: "Athletes at a community session" },
];

const steps = [
  { title: "Say hello", note: "Start with a conversation", text: "Tell us what you enjoy, what you want to try, and what you hope to get from being part of a team." },
  { title: "Find your game", note: "Try a session", text: "Meet the coaches and other young people, explore a program, and get a feel for how we train." },
  { title: "Build your rhythm", note: "Learn by doing", text: "Show up, practise the basics, and set small goals that help you grow at your own pace." },
  { title: "Grow together", note: "Keep moving forward", text: "Celebrate progress, support your teammates, and discover what you want to take on next." },
];

const journal = [
  { number: "01", tag: "Club notes", title: "Progress is made one practice at a time" },
  { number: "02", tag: "For families", title: "A good team is a place to belong" },
  { number: "03", tag: "On the move", title: "Small goals. Big energy." },
];

const footerGroups = [
  { title: "Club", links: [["Our story", "/story"], ["Our people", "/story"], ["Your first steps", "/pricing"], ["Get involved", "/pricing"]] },
  { title: "Programs", links: [["Team sports", "/events"], ["Athletics", "/events"], ["Strength & movement", "/events"], ["Community sessions", "/events"]] },
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
    <section className="orbit-gallery-section" id="gallery" ref={sectionRef} aria-label="Hawks sports photo gallery">
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
    <section className="join-application" aria-labelledby="join-application-title">
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
            <option>Athletics</option><option>Strength & movement</option><option>Chess</option><option>Gaming</option><option>Not sure yet</option>
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
      <section className="story-about-hero">
        <p className="story-about-kicker">HAWKS YOUTH CLUB <span>·</span> OUR STORY</p>
        <div className="story-about-hero-grid">
          <h1>MADE TO<br />MOVE <em>TOGETHER.</em></h1>
          <div className="story-about-mission">
            <p className="story-about-label">OUR MISSION</p>
            <p>We make sport a place where every young person can find their confidence, discover what they love, and grow alongside a team that has their back.</p>
            <a href="/pricing" onClick={onNavigate}>FIND YOUR PLACE <ArrowUpRight size={16} /></a>
          </div>
        </div>
        <span className="story-about-index">01 — 04 <span>SCROLL TO EXPLORE</span></span>
      </section>

      <section className="story-about-gallery" aria-label="Life at Hawks">
        <figure className="story-about-photo story-about-photo-one"><img src={collage[0].src} alt="Young athletes sharing a moment after practice" /><figcaption>SHOW UP FOR EACH OTHER <span>01</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-two"><img src={collage[1].src} alt="Young athlete running during training" /><figcaption>FIND YOUR OWN PACE <span>02</span></figcaption></figure>
        <figure className="story-about-photo story-about-photo-three"><img src={collage[3].src} alt="Coach supporting an athlete through practice" /><figcaption>GROW WITH GOOD PEOPLE <span>03</span></figcaption></figure>
      </section>

      <section className="story-about-intro">
        <p className="story-about-label">MORE ABOUT US</p>
        <div>
          <h2>SPORT IS THE START.<br /><em>Belonging is the point.</em></h2>
          <p>Hawks is a youth sports club built around the belief that movement can open doors. We bring young people together to learn the basics, take on a challenge, and experience the joy of being part of a team.</p>
          <p>There’s room to be new, to ask questions, to make mistakes, and to keep going. Our coaches and community make sure every young person has the support to grow at their own pace.</p>
        </div>
      </section>

      <section className="story-about-marquee" aria-label="Move, learn, belong, grow">
        <div className="story-about-marquee-track"><span>MOVE · LEARN · BELONG · GROW ·&nbsp;</span><span aria-hidden="true">MOVE · LEARN · BELONG · GROW ·&nbsp;</span></div>
      </section>

      <section className="story-about-approach">
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

      <section className="story-about-cta">
        <p className="story-about-label">YOUR NEXT MOVE STARTS HERE</p>
        <h2>Come find<br /><em>your team.</em></h2>
        <a href="/pricing" onClick={onNavigate}>JOIN THE CLUB <ArrowUpRight size={17} /></a>
      </section>
    </div>
  );
}

export function ClubPage({ page = "home" }: { page?: PageKind }) {
  const lenis = useRef<Lenis | null>(null);
  const revealRoot = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
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
      <header className={`site-header${isHome ? "" : " site-header-interior"}`}>
        <a className="site-logo" href="/" onClick={navigateClick} aria-label="Hawks Sports Club home"><img src="/images/hawks-logo-transparent.png" alt="Hawks Sports Club" /></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{navigation.map((item) => <a href={item.href} onClick={navigateClick} key={item.label} aria-current={page === (item.href === "/" ? "home" : item.href.slice(1)) ? "page" : undefined}>{item.label}</a>)}</nav>
        <a className="header-cta" href="/pricing" onClick={navigateClick}>Join the club</a>
        <button className={`mobile-menu-button${menuOpen ? " is-open" : ""}`} onClick={toggleMenu} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          <span className="menu-icon-lines" aria-hidden="true"><span /><span /></span>
        </button>
        {menuMounted && <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {navigation.map((item, index) => <a href={item.href} onClick={(event) => { navigateClick(event); setMenuOpen(false); if (menuCloseTimer.current) clearTimeout(menuCloseTimer.current); menuCloseTimer.current = setTimeout(() => setMenuMounted(false), 420); }} key={item.label} aria-current={page === (item.href === "/" ? "home" : item.href.slice(1)) ? "page" : undefined} style={{ "--menu-index": index } as CSSProperties}>{item.label}</a>)}
        </nav>}
      </header>
      {page === "image-slider" && <InfiniteImageGallery />}
      {page === "story" && <StoryPageContent onNavigate={navigateClick} />}
      {isHome && <section className="hero" id="home">
        <img className="hero-backdrop-image" src="/images/runner-hero.jpg" alt="" aria-hidden="true" />
        <div className="hero-title" aria-label="Where champions are made"><span>Where</span><span>Champions</span><span>Are Made</span></div>
        <div className="hero-intro"><p>Hawks Sports Club is built for young people ready to move with focus, purpose and confidence.</p><p>Find your team, challenge your limits and make your next move count.</p></div>
          <a className="hero-cta" href="#programs" onClick={scrollTo}><span>Unlock your potential</span><ArrowUpRight size={22} strokeWidth={1.75} /></a>
      </section>}

      {(isHome) && <section className="sports-strip" aria-label="Sports and activities at Hawks">
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

      {isHome && <section className="intro-section" id="story">
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

      {(isHome || page === "events") && <section className="program-section" id="programs">
        <div className="program-heading"><div><p className="eyebrow">01 — Find your game</p><h2>Room to<br /><em>move.</em></h2></div><p className="section-intro">There’s more than one way to be an athlete. Explore a program, learn the fundamentals, and find the kind of movement that makes you want to come back.</p></div>
        <div className="program-grid">{programs.map((program) => <article className="program-card" key={program.number}><div className="program-image"><img src={program.image} alt={program.alt} loading="lazy" /></div><div className="program-meta"><span>PROGRAM</span><span>{program.number}</span></div><h3>{program.title}</h3><p>{program.text}</p><a href="/pricing" onClick={navigateClick}>Explore the program <ArrowUpRight size={16} /></a></article>)}</div>
      </section>}

      {isHome && <OrbitalGallery />}

      {isHome && <section className="people-section">
        <div className="people-photo"><img src="https://theperformancelab.ca/parallax/i4.webp" alt="A coach encouraging an athlete" loading="lazy" /></div>
        <div className="people-copy"><p className="eyebrow">02 — People make the club</p><h2>Good sport<br />starts with<br /><em>good people.</em></h2><p>Our coaches and volunteers help make every session a place to learn, try, and feel supported. We value effort, respect, teamwork, and the courage to have a go.</p><a className="light-link" href="/pricing" onClick={navigateClick}>Meet the Hawks community <ArrowUpRight size={17} /></a></div>
        <div className="people-stamp"><strong>PLAY<br />AS ONE</strong><span>HAWKS SPORTS CLUB</span></div>
      </section>}

      {isHome && <section className="journey-section" id="journey">
        <div className="journey-heading"><p className="eyebrow">03 — Your first steps</p><h2>Find your place.<br /><em>Then take flight.</em></h2><p>Starting something new should feel easy. Here’s how to get involved and find the right fit.</p></div>
        <div className="journey-steps">{steps.map((step, index) => <article className="journey-step" key={step.title}><span className="step-number">{String(index + 1).padStart(3, "0")}</span><div><span className="step-note">{step.note}</span><h3>{step.title}</h3><p>{step.text}</p></div><span className="step-arrow"><ArrowUpRight size={20} /></span></article>)}</div>
        <a className="orange-link" href="#join" onClick={scrollTo}>Take your first step <ArrowUpRight size={18} /></a>
      </section>}

      {isHome && <section className="quote-section"><p className="eyebrow">A note from the club</p><QuoteTrail /><div className="quote-byline"><span className="quote-mark">H</span><span>Hawks Club<br /><small>Young athlete</small></span></div></section>}

      {page === "blog" && <section className="journal-section" id="journal"><div className="journal-heading"><div><p className="eyebrow">04 — Notes from the club</p><h2>Keep<br /><em>moving.</em></h2></div><a className="text-link" href="/pricing" onClick={navigateClick}>More from Hawks <ArrowUpRight size={17} /></a></div><div className="journal-grid">{journal.map((post) => <article className="journal-card" key={post.number}><div className="journal-art"><span className="journal-art-number">{post.number}</span><span className="journal-orbit" /></div><div className="journal-meta"><span>{post.tag}</span><span>{post.number}</span></div><h3>{post.title}</h3><a href="/story" onClick={navigateClick}>Read the story <ArrowUpRight size={16} /></a></article>)}</div></section>}

      {isHome && <section className="join-section" id="join"><div><p className="eyebrow">Your next move starts here</p><h2>Come find<br /><em>your team.</em></h2></div><div className="join-copy"><p>New to sport or ready for a new challenge? There’s a place for you at Hawks.</p><a className="dark-cta" href="mailto:hello@hawksclub.in">Get in touch <ArrowUpRight size={19} /></a><span>Families and young athletes are welcome to reach out.</span></div></section>}

      {page === "pricing" && <JoinClubApplication />}

      {page !== "image-slider" && page !== "story" && <footer className="hawks-footer" id="footer">
        <div className="hawks-footer-cta"><h2>Hawks Together.<br />Rise Together.</h2><div className="hawks-footer-actions"><a className="hawks-footer-secondary" href="/events" onClick={navigateClick}>Explore programs</a><a className="hawks-footer-primary" href="/pricing" onClick={navigateClick}>Join the club</a></div></div>
        <FooterHands />
        <div className="hawks-footer-content">
          <ul className="hawks-footer-quicklinks">{footerQuickLinks.map(({ title, href, icon: Icon }) => <li key={title}><a href={href} onClick={href.startsWith("/") ? navigateClick : undefined}><Icon size={18} strokeWidth={1.7} /><span>{title}</span><span className="hawks-footer-arrow"><FooterArrow /></span></a></li>)}</ul>
          <div className="hawks-footer-link-grid">
            {footerGroups.map((group) => <div className="hawks-footer-link-group" key={group.title}><h3>{group.title}</h3><ul>{group.links.map(([label, href]) => <li key={label}><a href={href} onClick={navigateClick}>{label}</a></li>)}</ul></div>)}
            <div className="hawks-footer-link-group"><h3>Contact</h3><ul><li><a href="mailto:hello@hawksclub.in">hello@hawksclub.in</a></li><li><span>Families and young athletes are welcome.</span></li><li><span>Come find your team.</span></li><li><a href="/pricing" onClick={navigateClick}>Get in touch</a></li></ul></div>
          </div>
          <p className="hawks-footer-copyright">© 2026 Hawks Youth Club. All rights reserved.</p>
        </div>
      </footer>}
    </main>
  );
}

