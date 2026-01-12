import { motion } from 'framer-motion';

interface FloatingOrbsProps {
  variant?: 'hero' | 'section' | 'subtle';
  className?: string;
}

const FloatingOrbs = ({ variant = 'hero', className = '' }: FloatingOrbsProps) => {
  const orbConfigs = {
    hero: [
      {
        className: 'floating-orb-1',
        style: { top: '-10%', right: '-5%' },
        animate: {
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        },
        transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      },
      {
        className: 'floating-orb-2',
        style: { bottom: '10%', left: '-10%' },
        animate: {
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 0.95, 1],
        },
        transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 },
      },
      {
        className: 'floating-orb-3',
        style: { top: '40%', right: '20%' },
        animate: {
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        },
        transition: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 },
      },
    ],
    section: [
      {
        className: 'floating-orb-1',
        style: { top: '20%', right: '-15%', opacity: 0.3 },
        animate: {
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        },
        transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
      },
      {
        className: 'floating-orb-2',
        style: { bottom: '0%', left: '-10%', opacity: 0.25 },
        animate: {
          y: [0, 15, 0],
          x: [0, -10, 0],
        },
        transition: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 },
      },
    ],
    subtle: [
      {
        className: 'floating-orb-3',
        style: { top: '10%', right: '5%', opacity: 0.2, width: '200px', height: '200px' },
        animate: {
          y: [0, -10, 0],
        },
        transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      },
    ],
  };

  const orbs = orbConfigs[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`floating-orb ${orb.className}`}
          style={orb.style}
          animate={orb.animate}
          transition={orb.transition}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;
