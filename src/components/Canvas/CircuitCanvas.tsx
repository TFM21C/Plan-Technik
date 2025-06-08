// src/components/Canvas/CircuitCanvas.tsx

import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

interface CircuitCanvasProps {
  components: CircuitComponent[];
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ components }) => {
  const renderComponent = (component: CircuitComponent) => {
    // Definieren wir ein paar Standard-SVG-Stile
    const style = {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'none',
    };

    switch (component.type) {
      case ComponentType.PowerSource24V:
      case ComponentType.PowerSource0V:
        return (
          <>
            <line x1="0" y1="0" x2="400" y2="0" {...style} />
            <text x="-35" y="5" fontSize="14" fill="black">
              {component.label}
            </text>
          </>
        );

      case ComponentType.NormallyOpen: // Schließer
        return (
          <>
            <line x1="10" y1="0" x2="10" y2="10" {...style} />
            <line x1="10" y1="30" x2="10" y2="40" {...style} />
            <line x1="0" y1="10" x2="10" y2="20" {...style} />
            <text x="20" y="25" fontSize="12">{component.label}</text>
          </>
        );

      case ComponentType.NormallyClosed: // Öffner
        return (
          <>
            <line x1="10" y1="0" x2="10" y2="15" {...style} />
            <line x1="10" y1="25" x2="10" y2="40" {...style} />
            <line x1="10" y1="15" x2="20" y2="25" {...style} />
            <text x="25" y="25" fontSize="12">{component.label}</text>
          </>
        );

      case ComponentType.Motor:
        return (
          <>
            <circle cx="20" cy="20" r="18" {...style} fill="white" />
            <text x="16" y="25" fontSize="18" fontWeight="bold" fill="black">M</text>
            <text x="45" y="25" fontSize="12">{component.label}</text>
          </>
        );

      case ComponentType.Lamp:
         return (
          <>
            <circle cx="20" cy="20" r="18" {...style} fill="white" />
            <line x1="5" y1="5" x2="35" y2="35" {...style} />
            <line x1="35" y1="5" x2="5" y2="35" {...style} />
            <text x="45" y="25" fontSize="12">{component.label}</text>
          </>
        );

      default:
        return (
          <rect width="40" height="20" fill="lightgrey" stroke="red" />
        );
    }
  };

  return (
    <svg width="100%" height="100%" style={{ backgroundColor: 'white', border: '1px solid #ccc' }}>
      {components.map((component) => (
        <g key={component.id} transform={`translate(${component.position.x}, ${component.position.y})`}>
          {renderComponent(component)}
        </g>
      ))}
    </svg>
  );
};

export default CircuitCanvas;
