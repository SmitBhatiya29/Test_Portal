import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 20) + 's';
      
      particlesRef.current.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 30000);
    };

    // Create initial particles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => createParticle(), i * 100);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 500);

    return () => clearInterval(interval);
  }, []);

  return <div ref={particlesRef} className="particles" />;
};

export default ParticleBackground;