import { useEffect, useRef, useState } from "react";

// Duration constants in ms
export const DURATIONS = {
  fast: 150,
  base: 200,
  slow: 250,
  fill: 300,
} as const;

// Easing constants
export const EASING = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  gentle: "ease",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
} as const;

// Alias for compatibility
export const EASINGS = EASING;

// Pre-built CSS transition strings for common use
export const TRANSITIONS = {
  opacity: `opacity ${DURATIONS.fast}ms ease`,
  height: `height ${DURATIONS.base}ms cubic-bezier(0, 0, 0.2, 1)`,
  transform: `transform ${DURATIONS.fast}ms cubic-bezier(0.4, 0, 0.2, 1)`,
} as const;

// Hook: reads and tracks prefers-reduced-motion
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}

// Hook: counts from 0 to target on mount. When reduced motion, returns target immediately.
export function useCountUp(target: number, duration = 600): number {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(reduced ? target : 0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setCurrent(target);
      return;
    }
    // Only animate on first mount (target won't change during count-up)
    startValueRef.current = 0;
    startTimeRef.current = null;

    function step(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out: 1 - (1 - t)^2
      const eased = 1 - (1 - progress) ** 2;
      const value = Math.round(
        startValueRef.current + (target - startValueRef.current) * eased,
      );
      setCurrent(value);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, reduced]);

  return current;
}

// motion/react opacity fade variants
export const motionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATIONS.fast / 1000 } },
} as const;

// Helper for motion/react fade-in props
export const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATIONS.fast / 1000, ease: EASING.standard },
} as const;
