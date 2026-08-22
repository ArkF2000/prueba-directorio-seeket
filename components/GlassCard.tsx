'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'strong';
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = false
}: GlassCardProps) {
  const baseClasses = variant === 'strong' ? 'glass-card-strong' : 'glass-card';

  const Component = hover ? motion.div : 'div';
  const props = hover ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
