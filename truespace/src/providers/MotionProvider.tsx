'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
} 