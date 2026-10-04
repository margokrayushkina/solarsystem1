import { useState, useRef, useEffect, useCallback } from 'react';
import { planets, PlanetData } from './data/planets';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  const planetAnglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));

  // Responsive canvas
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 900);
      setCanvasSize({ width: size, height: size });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Scale orbit radii based on canvas size
  const getScaleFactor = useCallback(() => {
    return canvasSize.width / 900;
  }, [canvasSize]);

  // Draw the solar system
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = getScaleFactor();
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;

    // Clear canvas with space background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw stars
    drawStars(ctx, canvasSize.width, canvasSize.height);

    // Draw orbit paths
    planets.forEach((planet) => {
      const radius = planet.orbitRadius * scale;
      const isSelected = selectedPlanet?.name === planet.name;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? `${planet.color}66` : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = isSelected ? 2 : 1;
      if (isSelected) {
        ctx.setLineDash([5, 5]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Sun with pulsating effect
    const pulse = 1 + 0.05 * Math.sin(timeRef.current * 0.003);
    const sunRadius = 30 * scale * pulse;
    
    const sunGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffcc00');
    sunGradient.addColorStop(0.7, '#ff8800');
    sunGradient.addColorStop(1, '#ff440044');
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(cx, cy, sunRadius, cx, cy, 70 * scale * pulse);
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 70 * scale * pulse, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planets.forEach((planet, index) => {
      const radius = planet.orbitRadius * scale;
      const angle = planetAnglesRef.current[index];
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      const planetSize = planet.size * scale;

      // Planet shadow/glow
      if (hoveredPlanet === planet.name) {
        ctx.beginPath();
        ctx.arc(px, py, planetSize + 4, 0, Math.PI * 2);
        ctx.fillStyle = `${planet.color}44`;
        ctx.fill();
      }

      // Planet body
      const planetGradient = ctx.createRadialGradient(
        px - planetSize * 0.3, py - planetSize * 0.3, 0,
        px, py, planetSize
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 40));
      planetGradient.addColorStop(1, planet.color);
      ctx.beginPath();
      ctx.arc(px, py, planetSize, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Saturn's rings
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(px, py, planetSize * 1.8, planetSize * 0.5, Math.PI * 0.1, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232, 213, 160, 0.6)';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      }

      // Planet name label
      if (hoveredPlanet === planet.name || selectedPlanet?.name === planet.name) {
        ctx.font = `${12 * scale}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(planet.nameRu, px, py - planetSize - 8);
      }
    });
  }, [canvasSize, hoveredPlanet, selectedPlanet, getScaleFactor]);

  // Star positions (cached)
  const starsRef = useRef<{x: number, y: number, size: number, brightness: number}[]>([]);
  
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.5
      });
    }
    starsRef.current = stars;
  }, []);

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = timeRef.current * 0.001;
    starsRef.current.forEach((star, i) => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * 2 + i * 0.5);
      const alpha = star.brightness * (0.6 + 0.4 * twinkle);
      ctx.beginPath();
      ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });
  };

  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `rgb(${R}, ${G}, ${B})`;
  };

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (isPlaying) {
        timeRef.current += deltaTime * speed;
        
        // Update planet angles based on orbital periods
        // At speed 1, Earth completes orbit in ~30 seconds
        planets.forEach((planet, index) => {
          const earthBasePeriod = 30000; // 30 seconds for Earth at speed 1
          const angularSpeed = (2 * Math.PI * 365) / (planet.orbitalPeriod * earthBasePeriod);
          planetAnglesRef.current[index] += angularSpeed * deltaTime * speed;
        });
      }

      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed, draw]);

  // Click handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScaleFactor();
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;

    let clicked = false;
    planets.forEach((planet, index) => {
      const radius = planet.orbitRadius * scale;
      const angle = planetAnglesRef.current[index];
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      const planetSize = planet.size * scale;

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planetSize + 5) {
        setSelectedPlanet(planet);
        clicked = true;
      }
    });

    if (!clicked) {
      setSelectedPlanet(null);
    }
  };

  // Hover handler
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scale = getScaleFactor();
    const cx = canvasSize.width / 2;
    const cy = canvasSize.height / 2;

    let found = false;
    planets.forEach((planet, index) => {
      const radius = planet.orbitRadius * scale;
      const angle = planetAnglesRef.current[index];
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      const planetSize = planet.size * scale;

      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planetSize + 5) {
        setHoveredPlanet(planet.name);
        canvas.style.cursor = 'pointer';
        found = true;
      }
    });

    if (!found) {
      setHoveredPlanet(null);
      canvas.style.cursor = 'default';
    }
  };

  const speedOptions = [0.25, 0.5, 1, 2, 5, 10];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full text-center py-4 px-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          ☀️ Солнечная система
        </h1>
        <p className="text-gray-400 text-sm mt-1">Нажмите на планету для получения информации</p>
      </header>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full px-4 flex-1">
        {/* Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            className="rounded-2xl border border-white/10 shadow-2xl shadow-purple-900/20"
          />
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          {/* Planet Info Card */}
          {selectedPlanet && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full shadow-lg"
                  style={{ backgroundColor: selectedPlanet.color }}
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedPlanet.nameRu}</h2>
                  <p className="text-gray-400 text-sm">{selectedPlanet.name}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{selectedPlanet.description}</p>
              <div className="space-y-2">
                <InfoRow label="Диаметр" value={`${selectedPlanet.diameter.toLocaleString()} км`} />
                <InfoRow label="Расстояние от Солнца" value={`${selectedPlanet.distanceFromSun} млн км`} />
                <InfoRow label="Орбитальный период" value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)} />
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
              >
                Закрыть ✕
              </button>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Управление</h3>
            
            {/* Play/Pause */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isPlaying
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
                    : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                }`}
              >
                {isPlaying ? '⏸ Пауза' : '▶ Воспроизвести'}
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Скорость: ×{speed}</label>
              <div className="grid grid-cols-3 gap-1.5">
                {speedOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`py-1.5 rounded-md text-xs font-medium transition-all ${
                      speed === s
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/40'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    ×{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Planet Legend */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Планеты</h3>
            <div className="space-y-1.5">
              {planets.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-all text-left ${
                    selectedPlanet?.name === planet.name
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="text-gray-300">{planet.nameRu}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-gray-500 text-xs">
        Интерактивная модель Солнечной системы • Масштаб орбит упрощён для наглядности
      </footer>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) {
    return `${days} дней`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} лет (${days.toLocaleString()} дней)`;
}
