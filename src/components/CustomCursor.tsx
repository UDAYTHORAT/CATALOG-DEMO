'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest('button, a, .cursor-pointer'));
    };
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    return () => { window.removeEventListener('mousemove', moveCursor); window.removeEventListener('mouseover', handleHover); };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-gold rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{ translateX: cursorXSpring, translateY: cursorYSpring, scale: isHovered ? 2.5 : 1, backgroundColor: isHovered ? 'rgba(197, 160, 89, 0.1)' : 'transparent' }}
    />
  );
}
