'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const proofPoints = [
  { value: '8', suffix: '+', label: 'Years of carrying well' },
  { value: 'India', suffix: '', label: 'Shipped across India' },
  { value: '30', suffix: '+', label: 'Branches and counting' },
  { value: '10,000', suffix: '+', label: 'Bags in the wild' },
];

gsap.registerPlugin(ScrollTrigger);

export function CarryformProofPoints() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.fromTo(
      sectionRef.current?.querySelectorAll('[data-proof-point]') ?? [],
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="proof-points"
      aria-label="CARRYFORM by the numbers"
    >
      <div className="proof-points-inner">
        {proofPoints.map((point) => (
          <div key={point.label} data-proof-point className="proof-point">
            <p className="proof-point-value">
              {point.value}
              {point.suffix && <span aria-hidden="true">{point.suffix}</span>}
            </p>
            <p className="proof-point-label">{point.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
