import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  life: number;
}

interface ParticleEffectsProps {
  trigger: number; // increment to trigger burst
  type: 'heal' | 'damage' | 'seed' | 'growth' | 'sparkle' | 'water' | 'sun' | 'eco';
  intensity?: number;
  className?: string;
}

const PARTICLE_CONFIG: Record<string, { emojis: string[]; count: number; spread: number; gravity: number }> = {
  heal: { emojis: ['💚', '✨', '🌿', '❤️‍🩹'], count: 8, spread: 60, gravity: -0.3 },
  damage: { emojis: ['💔', '💥', '🔴', '⚡'], count: 6, spread: 40, gravity: 0.5 },
  seed: { emojis: ['🌱', '✨', '⭐', '🪙'], count: 10, spread: 80, gravity: -0.2 },
  growth: { emojis: ['🌱', '🌿', '🍃', '🌸', '🌼'], count: 12, spread: 100, gravity: -0.4 },
  sparkle: { emojis: ['✨', '⭐', '💫', '🌟'], count: 8, spread: 50, gravity: -0.1 },
  water: { emojis: ['💧', '💦', '🌊'], count: 8, spread: 50, gravity: 0.3 },
  sun: { emojis: ['☀️', '🌤️', '✨', '💛'], count: 8, spread: 60, gravity: -0.2 },
  eco: { emojis: ['🌿', '🐞', '🦋', '🌻', '🍀'], count: 10, spread: 70, gravity: -0.3 },
};

export const ParticleEffects = ({ trigger, type, intensity = 1, className = '' }: ParticleEffectsProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;

    const config = PARTICLE_CONFIG[type];
    const count = Math.round(config.count * intensity);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 1 + Math.random() * 3;
      newParticles.push({
        id: ++idRef.current,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
        size: 12 + Math.random() * 12,
        opacity: 1,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed + config.gravity,
        life: 1,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, [trigger, type, intensity]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocityX,
            y: p.y + p.velocityY,
            velocityY: p.velocityY + PARTICLE_CONFIG[type].gravity * 0.1,
            life: p.life - 0.03,
            opacity: Math.max(0, p.life - 0.03),
          }))
          .filter(p => p.life > 0)
      );
    }, 30);
    return () => clearInterval(timer);
  }, [particles.length > 0, type]);

  if (particles.length === 0) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 50 }}>
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute transition-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            transform: `translate(-50%, -50%) scale(${p.opacity})`,
            willChange: 'transform, opacity',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

// Floating glow ring effect for plant displays
export const GlowRing = ({ active, color = 'green' }: { active: boolean; color?: string }) => {
  if (!active) return null;
  const colorMap: Record<string, string> = {
    green: 'shadow-green-500/40',
    red: 'shadow-red-500/40',
    blue: 'shadow-blue-500/40',
    yellow: 'shadow-yellow-500/40',
    purple: 'shadow-purple-500/40',
  };
  return (
    <div className={`absolute inset-0 rounded-xl animate-pulse shadow-[0_0_30px_8px] ${colorMap[color] || colorMap.green} pointer-events-none`} style={{ zIndex: 1 }} />
  );
};

// Pulsing score popup
export const ScorePopup = ({ score, show }: { score: number; show: boolean }) => {
  if (!show || score === 0) return null;
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-fade-in">
      <span className={`text-2xl font-black ${score > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {score > 0 ? '+' : ''}{score}
      </span>
    </div>
  );
};
