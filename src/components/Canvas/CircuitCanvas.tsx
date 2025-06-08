// src/components/Canvas/CircuitCanvas.tsx

import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

// Definiert die 'Props' (Eigenschaften), die diese Komponente empfängt.
// In diesem Fall ist es eine Liste von CircuitComponent-Objekten.
interface CircuitCanvasProps {
  components: CircuitComponent[];
}

/**
 * Die Zeichenfläche, die eine Liste von Komponenten erhält und diese als SVG darstellt.
 */
const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ components }) => {
  // Eine Hilfsfunktion, die entscheidet, WIE ein einzelnes Bauteil gezeichnet wird.
  const renderComponent = (component: CircuitComponent) => {
    switch (component.type) {
      case ComponentType.PowerSource24V:
      case ComponentType.PowerSource0V:
        return (
          <>
            <line x1="0" y1="0" x2="400" y2="0" stroke="black" strokeWidth="2" />
            <text x="-30" y="5" fontSize="12" fill="black">
              {component.label}
            </text>
          </>
        );
      // Hier werden wir später weitere 'case' für andere Bauteile hinzufügen
      // z.B. case ComponentType.NormallyOpen: ...
      default:
        // Falls ein unbekannter Typ kommt, zeichnen wir einen Platzhalter
        return (
          <rect
            width="40"
            height="20"
            fill="lightgrey"
            stroke="red"
            strokeDasharray="5,5"
          />
        );
    }
  };

  return (
    // Das SVG-Element ist unsere Leinwand.
    <svg
      width="100%"
      height="100%"
      style={{ backgroundColor: 'white', border: '1px solid #ccc' }}
    >
      {/* Wir gehen durch die Liste der Komponenten.
        Für jede Komponente erstellen wir eine SVG-Gruppe ('g').
        Diese Gruppe verschieben wir an die Position der Komponente.
      */}
      {components.map((component) => (
        <g
          key={component.id}
          transform={`translate(${component.position.x}, ${component.position.y})`}
        >
          {/* Wir rufen unsere Hilfsfunktion auf, um die eigentliche Grafik zu malen */}
          {renderComponent(component)}
        </g>
      ))}
    </svg>
  );
};

export default CircuitCanvas;
