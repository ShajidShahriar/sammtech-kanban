import { Transition } from 'framer-motion';

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.8,
};

export const bouncySpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
  mass: 1,
};
