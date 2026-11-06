'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Section reveal: fade-up 500ms when a <Section reveal> first crosses 15% of
 * the viewport. Sections already on screen are marked shown before the motion
 * class is applied, so nothing visible ever flashes. Reduced motion: no-op.
 */
export function MotionController() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal="pending"]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => (node.dataset.reveal = 'shown'));
      return;
    }
    const vh = window.innerHeight;
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < vh * 0.95) node.dataset.reveal = 'shown';
    });
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = 'shown';
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    nodes.filter((node) => node.dataset.reveal === 'pending').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
