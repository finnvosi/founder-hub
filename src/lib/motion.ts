import { Transition } from "framer-motion";

// Architectural Easing: No bounce, purely purposeful glide
export const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1.0];

export const transition: Transition = {
  duration: 0.2,
  ease,
};

export const transitionMicro: Transition = {
  duration: 0.12,
  ease,
};

export const transitionMacro: Transition = {
  duration: 0.4,
  ease,
};

export const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(4px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(4px)" },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
};
