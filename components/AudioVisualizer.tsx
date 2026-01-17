
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isModelSpeaking: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive, isModelSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const barCount = 40;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let amplitude = 0;
        
        if (isActive) {
          if (isModelSpeaking) {
            amplitude = Math.sin(time + i * 0.2) * (Math.random() * 20 + 20);
          } else {
            amplitude = Math.sin(time + i * 0.5) * (Math.random() * 10 + 5);
          }
        } else {
          amplitude = Math.sin(time + i * 0.2) * 2;
        }

        const barHeight = Math.max(4, Math.abs(amplitude));
        const color = isModelSpeaking ? '#3b82f6' : '#6366f1';
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(i * (barWidth + 2), midY - barHeight / 2, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, isModelSpeaking]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={60} 
      className="w-full h-12"
    />
  );
};

export default AudioVisualizer;
