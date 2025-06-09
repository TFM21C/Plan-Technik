// src/components/ElectricalComponents/DraggableComponent.tsx
import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

interface DraggableComponentProps {
  component: CircuitComponent; isSelected: boolean;
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
      case ComponentType.NormallyOpen: case ComponentType.PushbuttonNO:
        if (component.state?.isOpen === false) { return <g><line x1="16" y1="4" x2="16" y2="28" style={style} /><text x="22" y="18" style={textStyle}>{component.label}</text></g>; }
        return <g><line x1="16" y1="4" x2="16" y2="12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="12" x2="20" y2="20" style={style} /><text x="22" y="18" style={textStyle}>{component.label}</text></g>;
      case ComponentType.NormallyClosed: case ComponentType.PushbuttonNC:
        if (component.state?.isOpen === true) { return <g><line x1="16" y1="4" x2="16" y2="12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="12" x2="20" y2="20" style={style} /><text x="22" y="18" style={textStyle}>{component.label}</text></g>; }
        return <g><line x1="16" y1="4" x2="16" y2="20" style={style} /><line x1="16" y1="20" x2="20" y2="12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><text x="22" y="18" style={textStyle}>{component.label}</text></g>;
      case ComponentType.Coil:
        return <g><rect x="8" y="6" width="16" height="20" style={style} /><text x="28" y="18" style={textStyle}>{component.label}</text></g>;
      // ... (Rest bleibt wie im Feinschliff-Update) ...
    }
  };

  return (
    <g transform={`translate(${component.position.x}, ${component.position.y})`} onMouseDown={(e) => onMouseDown(e, component.id)} onClick={(e) => onComponentClick(e, component.id)} style={{ cursor: 'grab' }}>
      {renderVisual()}
      {component.pins.map(pin => (
        <g key={pin.id}>
          <circle cx={pin.position.x} cy={pin.position.y} r="5" fill="blue" stroke="white" strokeWidth="1" style={{ cursor: 'crosshair' }} onClick={(e) => { e.stopPropagation(); onPinClick(e, pin.id); }} />
          <text x={pin.position.x + 6} y={pin.position.y + 4} style={pinTextStyle}>{pin.label}</text>
        </g>
      ))}
    </g>
  );
};
export default DraggableComponent;