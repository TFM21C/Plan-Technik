// src/components/ElectricalComponents/DraggableComponent.tsx
import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

interface DraggableComponentProps {
  component: CircuitComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onPinClick: (e: React.MouseEvent, pinId: string) => void;
  onComponentClick: (e: React.MouseEvent, componentId: string) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isSelected, onMouseDown, onPinClick, onComponentClick }) => {
  const renderVisual = () => {
    const strokeColor = isSelected ? '#007bff' : 'black';
    const style: React.CSSProperties = { stroke: strokeColor, strokeWidth: 2, fill: 'none' };
    const textStyle: React.CSSProperties = { fontSize: '10px', userSelect: 'none', fill: strokeColor };
    const pinTextStyle: React.CSSProperties = { fontSize: '8px', userSelect: 'none', fill: '#555' };

    switch (component.type) {
        case ComponentType.PowerSource24V: case ComponentType.PowerSource0V:
            return <> {/* Implementation-specific drawing code */} </>;
        case ComponentType.NormallyOpen: case ComponentType.PushbuttonNO:
            return <> {/* Implementation-specific drawing code */} </>;
        case ComponentType.NormallyClosed: case ComponentType.PushbuttonNC:
            return <> {/* Implementation-specific drawing code */} </>;
        default:
            return null;
    }
  };

  return (
    <g transform={`translate(${component.position.x}, ${component.position.y})`} onMouseDown={(e) => onMouseDown(e, component.id)} onClick={(e) => onComponentClick(e, component.id)} style={{ cursor: 'grab' }}>
      {renderVisual()}
      {component.pins.map(pin => (
        <g key={pin.id}>
          <circle cx={pin.position.x} cy={pin.position.y} r="5" fill="blue" stroke="white" strokeWidth="1" style={{ cursor: 'crosshair' }} onClick={(e) => { e.stopPropagation(); onPinClick(e, pin.id); }} />
          <text x={pin.position.x + 8} y={pin.position.y + 4} style={pinTextStyle}>{pin.label}</text>
        </g>
      ))}
    </g>
  );
};

export default DraggableComponent;
