"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const hands = [
  { side: "left", src: "/footer/hands-left.png" },
  { side: "right", src: "/footer/hands-right.png" },
] as const;

export default function FooterHands() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ascii = " .,:;!+*#%@";
    const handsState: Array<{
      canvas: HTMLCanvasElement;
      image: HTMLImageElement;
      wrapper: HTMLElement;
      width: number;
      height: number;
      data: Uint8ClampedArray | null;
      pointerX: number;
      pointerY: number;
      loaded: boolean;
    }> = [];

    for (const hand of hands) {
      const wrapper = stage.querySelector<HTMLElement>(`.footer-hand-${hand.side}`);
      const canvas = wrapper?.querySelector("canvas");
      if (!wrapper || !canvas) continue;
      const image = new Image();
      image.decoding = "async";
      image.src = hand.src;
      handsState.push({ canvas, image, wrapper, width: 0, height: 0, data: null, pointerX: -1000, pointerY: -1000, loaded: false });
    }

    const prepare = (item: (typeof handsState)[number]) => {
      const width = Math.max(1, Math.round(item.canvas.clientWidth));
      const height = Math.max(1, Math.round(item.canvas.clientHeight));
      if (!width || !height) return;

      const scale = Math.min(width / item.image.naturalWidth, height / item.image.naturalHeight);
      const imageWidth = item.image.naturalWidth * scale;
      const imageHeight = item.image.naturalHeight * scale;
      const x = (width - imageWidth) / 2;
      const y = (height - imageHeight) / 2;
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = width;
      sampleCanvas.height = height;
      const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;
      sampleContext.clearRect(0, 0, width, height);
      sampleContext.drawImage(item.image, x, y, imageWidth, imageHeight);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      item.canvas.width = Math.round(width * dpr);
      item.canvas.height = Math.round(height * dpr);
      item.canvas.style.width = `${width}px`;
      item.canvas.style.height = `${height}px`;
      const context = item.canvas.getContext("2d");
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      item.width = width;
      item.height = height;
      item.data = sampleContext.getImageData(0, 0, width, height).data;
      item.loaded = true;
      draw(item, 0);
    };

    const draw = (item: (typeof handsState)[number], time: number) => {
      if (!item.data) return;
      const context = item.canvas.getContext("2d");
      if (!context) return;
      const { width, height, data } = item;
      context.clearRect(0, 0, width, height);
      context.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      const cellWidth = width < 400 ? 6 : 8;
      const cellHeight = width < 400 ? 8 : 10;
      const timePhase = time * 0.0015;
      for (let y = cellHeight / 2; y < height; y += cellHeight) {
        for (let x = cellWidth / 2; x < width; x += cellWidth) {
          const offset = (Math.floor(y) * width + Math.floor(x)) * 4;
          const alpha = data[offset + 3] / 255;
          if (alpha < 0.12) continue;

          const red = data[offset];
          const green = data[offset + 1];
          const blue = data[offset + 2];
          const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
          const deltaX = Math.abs(item.pointerX - x);
          const deltaY = Math.abs(item.pointerY - y);
          const influence = Math.max(0, 1 - deltaX / 320) * Math.max(0, 1 - deltaY / 230);
          const shimmer = (Math.sin(x * 0.034 + y * 0.023 + timePhase) + 1) * 0.5;
          const tone = Math.min(1, luminance / 220 + influence * 0.68 + shimmer * 0.08);
          const charIndex = Math.min(ascii.length - 1, Math.max(1, Math.round(tone * (ascii.length - 1))));
          const jitter = influence > 0.04 ? Math.round(influence * 4 + shimmer * 2) : 0;
          const character = ascii[Math.min(ascii.length - 1, charIndex + jitter)];
          const ink = Math.min(0.98, 0.38 + tone * 0.43 + influence * 0.28) * alpha;
          context.fillStyle = `rgba(232, 236, 244, ${ink})`;
          context.fillText(character, x, y);
        }
      }
    };

    const observers: ResizeObserver[] = [];
    for (const item of handsState) {
      item.image.onload = () => prepare(item);
      item.image.onerror = () => { item.loaded = false; };
      if (item.image.complete && item.image.naturalWidth) prepare(item);
      const observer = new ResizeObserver(() => {
        if (item.image.complete && item.image.naturalWidth) prepare(item);
      });
      observer.observe(item.wrapper);
      observers.push(observer);
    }

    const updatePointer = (event: PointerEvent) => {
      for (const item of handsState) {
        const bounds = item.wrapper.getBoundingClientRect();
        item.pointerX = event.clientX - bounds.left;
        item.pointerY = event.clientY - bounds.top;
        if (event.clientX < bounds.left - 320 || event.clientX > bounds.right + 320 || event.clientY < bounds.top - 230 || event.clientY > bounds.bottom + 230) {
          item.pointerX = -1000;
          item.pointerY = -1000;
          const artwork = item.wrapper.querySelector<HTMLElement>(".footer-hand-art");
          if (artwork) artwork.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        } else {
          const horizontal = Math.max(-1, Math.min(1, (item.pointerX / item.width - 0.5) * 2));
          const vertical = Math.max(-1, Math.min(1, (item.pointerY / item.height - 0.5) * 2));
          const artwork = item.wrapper.querySelector<HTMLElement>(".footer-hand-art");
          if (artwork) artwork.style.transform = `translate3d(${horizontal * 6}px, ${vertical * 4}px, 0) rotate(${horizontal * 1.6}deg)`;
        }
        if (prefersReducedMotion && item.loaded) draw(item, 0);
      }
    };
    const resetPointer = () => {
      for (const item of handsState) {
        item.pointerX = -1000;
        item.pointerY = -1000;
        const artwork = item.wrapper.querySelector<HTMLElement>(".footer-hand-art");
        if (artwork) artwork.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
      }
    };
    stage.addEventListener("pointermove", updatePointer, { passive: true });
    stage.addEventListener("pointerleave", resetPointer, { passive: true });

    let frame = 0;
    let previousTime = 0;
    let visible = false;
    const leftHand = stage.querySelector<HTMLElement>(".footer-hand-left");
    const rightHand = stage.querySelector<HTMLElement>(".footer-hand-right");
    if (!prefersReducedMotion) {
      gsap.set(leftHand, { x: -74, opacity: 0.35 });
      gsap.set(rightHand, { x: 74, opacity: 0.35 });
    }
    const animate = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (time - previousTime >= 42) {
        previousTime = time;
        for (const item of handsState) if (item.loaded) draw(item, time);
      }
      frame = window.requestAnimationFrame(animate);
    };
    const startAnimation = () => {
      visible = true;
      if (!prefersReducedMotion && !frame) frame = window.requestAnimationFrame(animate);
      else if (prefersReducedMotion) for (const item of handsState) if (item.loaded) draw(item, 0);
    };
    const stopAnimation = () => {
      visible = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion) {
          gsap.to(leftHand, { x: 0, opacity: 1, duration: 1.45, ease: "power3.out", overwrite: true });
          gsap.to(rightHand, { x: 0, opacity: 1, duration: 1.45, ease: "power3.out", overwrite: true });
        }
        startAnimation();
      } else {
        stopAnimation();
        if (!prefersReducedMotion) {
          gsap.to(leftHand, { x: -74, opacity: 0.35, duration: 1.45, ease: "power3.inOut", overwrite: true });
          gsap.to(rightHand, { x: 74, opacity: 0.35, duration: 1.45, ease: "power3.inOut", overwrite: true });
        }
      }
    }, { threshold: 0.22 });
    visibilityObserver.observe(stage);

    if (!prefersReducedMotion) {
      const onVisibilityChange = () => {
        if (document.hidden) stopAnimation();
        else if (stage.getBoundingClientRect().bottom > 0 && stage.getBoundingClientRect().top < window.innerHeight) startAnimation();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        gsap.killTweensOf([leftHand, rightHand]);
        visibilityObserver.disconnect();
        observers.forEach((observer) => observer.disconnect());
        stage.removeEventListener("pointermove", updatePointer);
        stage.removeEventListener("pointerleave", resetPointer);
        handsState.forEach((item) => { item.image.onload = null; item.image.onerror = null; });
        stopAnimation();
      };
    }

    return () => {
      visibilityObserver.disconnect();
      observers.forEach((observer) => observer.disconnect());
      stage.removeEventListener("pointermove", updatePointer);
      stage.removeEventListener("pointerleave", resetPointer);
      handsState.forEach((item) => { item.image.onload = null; item.image.onerror = null; });
      stopAnimation();
    };
  }, []);

  return (
    <div className="footer-hands-stage" ref={stageRef} aria-hidden="true">
      {hands.map(({ side, src }) => (
        <div className={`footer-hand footer-hand-${side}`} key={side}>
          <div className="footer-hand-art">
            <canvas data-image={src} />
          </div>
        </div>
      ))}
      <span className="footer-hands-glow" />
    </div>
  );
}
