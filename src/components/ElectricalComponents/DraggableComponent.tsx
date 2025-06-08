// src/components/ElectricalComponents/DraggableComponent.tsx

import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit'; // Behalte dies

interface DraggableComponentProps {
  component: CircuitComponent;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onPinClick: (e: React.MouseEvent, pinId: string) => void; // Behalte dies (vom Agenten)
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, onMouseDown, onPinClick }) => {
  const renderVisual = () => {
    // Hier die korrigierte Style-Definition aus dem Bugfix
    const style: React.CSSProperties = {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'none',
      cursor: 'grab',
    };

    const textStyle: React.CSSProperties = {
        fontSize: '12px',
        userSelect: 'none',
    };
    // Der switch-Block bleibt wie er ist...
    switch (component.type) {
        case ComponentType.Motor:
         return <><circle cx="20" cy="20" r="18" style={style} fill="white" /><text x="16" y="25" fontSize="18" fontWeight="bold" fill="black" style={textStyle}>M</text><text x="45" y="25" style={textStyle}>{component.label}</text></>;
        // ... alle anderen cases auch
    }
  };

  return (
    <g
      transform={`translate(${component.position.x}, ${component.position.y})`}
      onMouseDown={(e) => onMouseDown(e, component.id)}
    >
      {renderVisual()}

      {/* Diesen Teil vom Agenten unbedingt behalten! */}
      {component.pins.map(pin => (
        <circle
          key={pin.id}
          cx={pin.position.x}
          cy={pin.position.y}
          r="5"
          fill="blue"
          stroke="white"
          strokeWidth="1"
          style={{ cursor: 'crosshair' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onPinClick(e, pin.id);
          }}
        />
      ))}
    </g>
  );
};

export default DraggableComponent;