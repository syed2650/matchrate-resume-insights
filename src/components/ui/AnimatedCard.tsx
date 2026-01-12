import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover3D?: boolean;
  glowOnHover?: boolean;
}

const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  hover3D = false,
  glowOnHover = false,
}: AnimatedCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hover3D
          ? `perspective(1000px) rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`
          : undefined,
        transformStyle: 'preserve-3d',
      }}
      className={`transition-shadow duration-300 ${
        glowOnHover ? 'hover:shadow-[0_0_40px_rgba(251,107,90,0.3)]' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
