import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  type: "tree" | "bird" | "leaf" | "cloud" | "sun";
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

export const AnimatedBackground = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const newElements: FloatingElement[] = [];
    
    // Trees
    for (let i = 0; i < 5; i++) {
      newElements.push({
        id: i,
        type: "tree",
        x: 10 + i * 20,
        y: 80 + Math.random() * 10,
        size: 30 + Math.random() * 20,
        speed: 0,
        delay: i * 0.5
      });
    }
    
    // Birds
    for (let i = 0; i < 4; i++) {
      newElements.push({
        id: 10 + i,
        type: "bird",
        x: Math.random() * 100,
        y: 15 + Math.random() * 30,
        size: 12 + Math.random() * 8,
        speed: 2 + Math.random() * 2,
        delay: i * 2
      });
    }
    
    // Leaves
    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: 20 + i,
        type: "leaf",
        x: Math.random() * 100,
        y: Math.random() * 60,
        size: 10 + Math.random() * 10,
        speed: 1 + Math.random() * 2,
        delay: i * 1.5
      });
    }
    
    // Clouds
    for (let i = 0; i < 3; i++) {
      newElements.push({
        id: 30 + i,
        type: "cloud",
        x: i * 35,
        y: 5 + Math.random() * 15,
        size: 40 + Math.random() * 30,
        speed: 0.5 + Math.random() * 0.5,
        delay: i * 3
      });
    }
    
    // Sun
    newElements.push({
      id: 40,
      type: "sun",
      x: 85,
      y: 10,
      size: 50,
      speed: 0,
      delay: 0
    });
    
    setElements(newElements);
  }, []);

  const renderElement = (el: FloatingElement) => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${el.x}%`,
      top: `${el.y}%`,
      fontSize: `${el.size}px`,
      animationDelay: `${el.delay}s`,
      opacity: 0.8,
    };

    switch (el.type) {
      case "tree":
        return (
          <div 
            key={el.id} 
            style={baseStyle}
            className="animate-bounce-slow"
          >
            🌲
          </div>
        );
      case "bird":
        return (
          <div 
            key={el.id} 
            style={{
              ...baseStyle,
              animation: `flyAcross ${15 / el.speed}s linear infinite`,
              animationDelay: `${el.delay}s`,
            }}
          >
            🐦
          </div>
        );
      case "leaf":
        return (
          <div 
            key={el.id} 
            style={{
              ...baseStyle,
              animation: `leafFall ${8 / el.speed}s ease-in-out infinite`,
              animationDelay: `${el.delay}s`,
            }}
          >
            🍃
          </div>
        );
      case "cloud":
        return (
          <div 
            key={el.id} 
            style={{
              ...baseStyle,
              animation: `cloudDrift ${30 / el.speed}s linear infinite`,
              animationDelay: `${el.delay}s`,
              opacity: 0.6,
            }}
          >
            ☁️
          </div>
        );
      case "sun":
        return (
          <div 
            key={el.id} 
            style={baseStyle}
            className="animate-pulse-soft"
          >
            ☀️
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes flyAcross {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes leafFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `}</style>
      {elements.map(renderElement)}
    </div>
  );
};