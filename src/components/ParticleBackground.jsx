import './ParticleBackground.css';

// Generate an array of particle data (position, size, delay, duration)
const generateParticles = (count = 30) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 3 + 1; // 1px - 4px
    const left = Math.random() * 100; // percent
    const duration = Math.random() * 20 + 10; // 10-30s
    // Use a negative delay up to the duration so they are already scattered across the screen on load
    const delay = -(Math.random() * duration); 
    const opacity = Math.random() * 0.5 + 0.3;
    particles.push({ size, left, delay, duration, opacity });
  }
  return particles;
};

const particles = generateParticles();

export default function ParticleBackground() {
  return (
    <div className="particle-bg" aria-hidden="true">
      {particles.map((p, idx) => (
        <div
          key={idx}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
