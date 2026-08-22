'use client';

import { motion } from 'framer-motion';

interface SeeketLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizes = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl md:text-7xl',
};

export default function SeeketLogo({ className = '', size = 'lg', animated = true }: SeeketLogoProps) {
  const baseClass = `font-bold tracking-tight ${sizes[size]} ${className}`;

  const content = (
    <span className={`inline-flex items-baseline ${baseClass}`}>
      <span className="text-white">s</span>
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: 'linear-gradient(to right, #9a2e2e, #fa3934, #ffac31)',
        }}
      >
        ee
      </span>
      <span className="text-white">k</span>
      <span className="text-white">e</span>
      <span className="text-white">t</span>
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
