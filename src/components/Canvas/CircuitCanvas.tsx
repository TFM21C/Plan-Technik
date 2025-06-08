// src/components/Canvas/CircuitCanvas.tsx

import React from 'react';
import { CircuitComponent } from '../../types/circuit';
import DraggableComponent from '../ElectricalComponents/DraggableComponent';

interface CircuitCanvasProps {
  components: CircuitComponent[];
  onComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ components, onComponentMouseDown, onMouseMove, onMouseUp }) => {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ backgroundColor: 'white', border: '1px solid #ccc' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {components.map((component) => (
        <DraggableComponent
          key={component.id}
          component={component}
          onMouseDown={onComponentMouseDown}
        />
      ))}
    </svg>
  );
};

export default CircuitCanvas;
