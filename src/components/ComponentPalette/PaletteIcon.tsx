// src/components/ComponentPalette/PaletteIcon.tsx
import React from 'react';
import { ComponentType } from '../../types/circuit';

interface PaletteIconProps {
  type: ComponentType;
}

const PaletteIcon: React.FC<PaletteIconProps> = ({ type }) => {
  const style: React.CSSProperties = { stroke: 'currentColor', strokeWidth: 2, fill: 'none' };
  const size = 32;

  const getIcon = () => {
    switch (type) {
      case ComponentType.NormallyOpen:
        return <g><line x1="16" y1="4" x2="16" y2="12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="12" x2="20" y2="20" style={style} /></g>;
      case ComponentType.NormallyClosed:
        return <g><line x1="16" y1="4" x2="16" y2="12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="20" x2="20" y2="12" style={style} /></g>;
      case ComponentType.PushbuttonNO:
        return <g><path d="M 16 4 V 12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="12" x2="20" y2="20" style={style} /><path d="M 12 4 L 20 4" style={style} /></g>;
      case ComponentType.PushbuttonNC:
        return <g><path d="M 16 4 V 12" style={style} /><line x1="16" y1="20" x2="16" y2="28" style={style} /><line x1="12" y1="20" x2="20" y2="12" style={style} /><path d="M 12 4 L 20 4" style={style} /></g>;
      case ComponentType.Coil:
        return <rect x="8" y="6" width="16" height="20" style={style} />;
      case ComponentType.Lamp:
        return <g><circle cx="16" cy="16" r="10" style={style} /><line x1="9" y1="9" x2="23" y2="23" style={style} /><line x1="23" y1="9" x2="9" y2="23" style={style} /></g>;
      case ComponentType.Motor:
        return <g><circle cx="16" cy="16" r="12" style={style} /><text x="12" y="21" fontSize="14px" style={{ fill: 'currentColor', stroke: 'none' }}>M</text></g>;
      default:
        return null;
    }
  };
  return (<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{getIcon()}</svg>);
};

export default PaletteIcon;