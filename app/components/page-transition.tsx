"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const destination = useRef<string | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const navigate = useCallback<Navigate>((href) => {
    const targetPath = href.split(/[?#]/, 1)[0];
    if (busy.current || targetPath === window.location.pathname) return;

    const panels = gsap.utils.toArray<HTMLElement>(".page-transition-panel");
    const curtain = document.querySelector<HTMLElement>(".page-transition");
    const title = curtain?.querySelector<HTMLElement>(".page-transition-title");
    if (!panels.length || !curtain || !title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    busy.current = true;
    destination.current = targetPath;
    timelineRef.current?.kill();
    gsap.set(curtain, { autoAlpha: 1, backgroundColor: "rgba(255,75,43,0)" });
    gsap.set(panels, { scaleX: 0, transformOrigin: "left center" });
    curtain.classList.remove("is-revealing");
    curtain.classList.add("is-covering");

    // Match the reference's cover: four horizontal panels scale out from the
    // left while each brand word rises from its own clipped line.
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => router.push(href, { scroll: false }),
    });
    timelineRef.current = timeline;
    panels.forEach((panel, index) => {
      timeline.to(panel, { scaleX: 1, duration: 0.6 + (index + 1) * 0.15 }, 0);
    });
    timeline.to(curtain, { backgroundColor: "rgba(255,75,43,1)", duration: 0.08 }, 1.2);
  }, [router]);

  useEffect(() => {
    if (!busy.current || !destination.current || pathname !== destination.current) return;

    const panels = gsap.utils.toArray<HTMLElement>(".page-transition-panel");
    const curtain = document.querySelector<HTMLElement>(".page-transition");
    const title = curtain?.querySelector<HTMLElement>(".page-transition-title");
    if (!panels.length || !curtain || !title) return;

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    gsap.set(panels, { scaleX: 1, transformOrigin: "right center" });
    curtain.classList.remove("is-covering");
    curtain.classList.add("is-revealing");
    timelineRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set([curtain, panels], { clearProps: "all" });
        curtain.classList.remove("is-revealing");
        busy.current = false;
        destination.current = null;
        timelineRef.current = null;
      },
    });
    timelineRef.current = timeline;

    // The destination is mounted behind the curtain before the bars collapse
    // toward the right and the title drops out of its clipped lines.
    panels.forEach((panel, index) => {
      const orderBack = panels.length - index;
      timeline.to(panel, { scaleX: 0, duration: 0.9 + orderBack * 0.15 }, 0);
    });
    timeline.to(curtain, { backgroundColor: "rgba(255,75,43,0)", duration: 1.5 }, 0);
  }, [pathname]);

  const contextValue = useMemo(() => navigate, [navigate]);

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
      <div className="page-transition" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <span className="page-transition-panel" key={index} />)}
        <span className="page-transition-title">
          <span className="page-transition-title-clip">
            {"HAWKS".split("").map((letter, index) => <span className="page-transition-title-letter" key={`${letter}-${index}`} style={{ "--letter-order": index, "--letter-reverse-order": 4 - index } as CSSProperties}>{letter}</span>)}
          </span>
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

export function transitionClick(navigate: Navigate | null) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute("href");
    if (!navigate || !href || !href.startsWith("/")) return;
    event.preventDefault();
    navigate(href);
  };
}
