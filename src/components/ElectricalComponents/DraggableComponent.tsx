// src/components/ElectricalComponents/DraggableComponent.tsx

import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

interface DraggableComponentProps {
  component: CircuitComponent;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onPinClick: (e: React.MouseEvent, pinId: string) => void;
  onComponentClick: (e: React.MouseEvent, componentId: string) => void; // NEU
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component, isSelected, onMouseDown, onPinClick, onComponentClick }) => {
  const renderVisual = () => {
    const strokeColor = isSelected ? '#007bff' : 'black';
    const style: React.CSSProperties = { stroke: strokeColor, strokeWidth: 2, fill: 'none', cursor: 'grab' };
    const textStyle: React.CSSProperties = { fontSize: '12px', userSelect: 'none', fill: strokeColor };

    switch (component.type) {
      case ComponentType.PowerSource24V:
      case ComponentType.PowerSource0V:
        return (
          <>
            <line x1="0" y1="0" x2="400" y2="0" style={style} />
            <text x="-35" y="5" fontSize="14" fill="black" style={{ cursor: 'default', userSelect: 'none' }}>
              {component.label}
            </text>
          </>
        );

      case ComponentType.NormallyOpen:
      case ComponentType.PushbuttonNO:
        if (component.state?.isOpen === false) {
          return <><line x1="10" y1="0" x2="10" y2="40" style={style} /><text x="20" y="25" style={textStyle}>{component.label}</text></>;
        }
        return <><line x1="10" y1="0" x2="10" y2="10" style={style} /><line x1="10" y1="30" x2="10" y2="40" style={style} /><line x1="0" y1="10" x2="10" y2="20" style={style} /><text x="20" y="25" style={textStyle}>{component.label}</text></>;

      case ComponentType.NormallyClosed:
      case ComponentType.PushbuttonNC:
        // KORRIGIERTE GRAFIK FÜR ÖFFNER (mit Nase)
        if (component.state?.isOpen === true) {
             return <><line x1="10" y1="0" x2="10" y2="10" style={style} /><line x1="10" y1="30" x2="10" y2="40" style={style} /><line x1="0" y1="10" x2="10" y2="20" style={style} /><text x="25" y="25" style={textStyle}>{component.label}</text></>;
        }
        return <><line x1="10" y1="0" x2="10" y2="15" style={style} /><line x1="10" y1="25" x2="10" y2="40" style={style} /><line x1="10" y1="15" x2="20" y2="25" style={style} /><text x="25" y="25" style={textStyle}>{component.label}</text></>;

      case ComponentType.Coil:
        return <><rect x="5" y="5" width="30" height="20" style={style} /><text x="40" y="22" style={textStyle}>{component.label}</text></>;

      case ComponentType.Motor:
        return (
          <>
            <circle cx="20" cy="20" r="18" style={style} fill="white" />
            <text x="16" y="25" fontSize="18" fontWeight="bold" fill="black" style={textStyle}>M</text>
            <text x="45" y="25" style={textStyle}>{component.label}</text>
          </>
        );

      case ComponentType.Lamp:
        return (
          <>
            <circle cx="20" cy="20" r="18" style={style} fill="white" />
            <line x1="5" y1="5" x2="35" y2="35" style={style} />
            <line x1="35" y1="5" x2="5" y2="35" style={style} />
            <text x="45" y="25" style={textStyle}>{component.label}</text>
          </>
        );

      default:
        // Die restlichen Bauteile bleiben wie sie sind
        return <rect width="40" height="20" fill="lightgrey" stroke="red" style={style} />;
    }
  };

  return (
    <g
      transform={`translate(${component.position.x}, ${component.position.y})`}
      onMouseDown={(e) => onMouseDown(e, component.id)}
      onClick={(e) => onComponentClick(e, component.id)} // NEU: Klick auf das ganze Bauteil
    >
      {renderVisual()}
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
          onClick={(e) => {
            e.stopPropagation();
            onPinClick(e, pin.id);
          }}
        />
      ))}
    </g>
  );
};

export default DraggableComponent;
