import { useEffect, useRef } from "react";

export default function CosmicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate celestial stars
    const starCount = Math.floor((width * height) / 3800);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.3 ? "#ffffff" : Math.random() > 0.5 ? "#fbbf24" : "#93c5fd"
    }));

    // Generate floating cosmic golden dust particles
    const goldenDustCount = 35;
    const dustParticles = Array.from({ length: goldenDustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      radius: Math.random() * 2.5 + 1.0,
      alpha: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep celestial radial gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 3, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, "#0e1526");
      bgGrad.addColorStop(0.5, "#080c16");
      bgGrad.addColorStop(1, "#03060a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle celestial nebulae
      const nebGrad1 = ctx.createRadialGradient(width * 0.25, height * 0.2, 10, width * 0.25, height * 0.2, width * 0.5);
      nebGrad1.addColorStop(0, "rgba(217, 119, 6, 0.06)");
      nebGrad1.addColorStop(1, "transparent");
      ctx.fillStyle = nebGrad1;
      ctx.fillRect(0, 0, width, height);

      const nebGrad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, width * 0.6);
      nebGrad2.addColorStop(0, "rgba(99, 102, 241, 0.05)");
      nebGrad2.addColorStop(1, "transparent");
      ctx.fillStyle = nebGrad2;
      ctx.fillRect(0, 0, width, height);

      // Draw twinkling stars
      stars.forEach((s) => {
        s.alpha += s.speed * s.direction;
        if (s.alpha > 0.95) {
          s.alpha = 0.95;
          s.direction = -1;
        } else if (s.alpha < 0.15) {
          s.alpha = 0.15;
          s.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = s.radius > 1 ? 6 : 0;
        ctx.shadowColor = s.color;
        ctx.fill();
      });

      // Draw floating golden particles
      dustParticles.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        const currentAlpha = d.alpha + Math.sin(time + d.x) * 0.15;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.globalAlpha = Math.max(0.05, currentAlpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#f59e0b";
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cosmic-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
}
