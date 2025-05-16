export default function Starfield({ count = 100 }) {
    const stars = Array.from({ length: count });
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 6px 2px #00bfff66`,
            }}
          />
        ))}
      </div>
    );
  }
  