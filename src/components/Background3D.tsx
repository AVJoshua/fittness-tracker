'use client';

export default function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient animate-gradient overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      {/* Generate multiple bubbles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`bubble bubble-${i % 4}`}
          style={{
            '--left': `${Math.random() * 100}%`,
            '--size': `${Math.random() * (100 - 20) + 20}px`,
            '--delay': `${Math.random() * 5}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
} 