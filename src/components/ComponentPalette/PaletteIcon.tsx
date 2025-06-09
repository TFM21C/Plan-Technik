import React from 'react';
import { ComponentType } from '../../types/circuit';

const strokeStyle = { stroke: 'black', strokeWidth: 2, fill: 'none' } as const;

const PaletteIcon: React.FC<{ type: ComponentType }> = ({ type }) => {
  switch (type) {
    case ComponentType.NormallyOpen:
    case ComponentType.PushbuttonNO:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <line x1="16" y1="4" x2="16" y2="12" {...strokeStyle} />
          <line x1="16" y1="20" x2="16" y2="28" {...strokeStyle} />
          <line x1="12" y1="12" x2="20" y2="20" {...strokeStyle} />
        </svg>
      );
    case ComponentType.NormallyClosed:
    case ComponentType.PushbuttonNC:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <line x1="16" y1="4" x2="16" y2="12" {...strokeStyle} />
          <line x1="16" y1="20" x2="16" y2="28" {...strokeStyle} />
          <line x1="12" y1="20" x2="20" y2="12" {...strokeStyle} />
        </svg>
      );
    case ComponentType.Coil:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" {...strokeStyle} />
        </svg>
      );
    case ComponentType.Motor:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" {...strokeStyle} />
          <text x="13" y="21" fontSize="12" fill="black">M</text>
        </svg>
      );
    case ComponentType.Lamp:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" {...strokeStyle} />
          <line x1="10" y1="10" x2="22" y2="22" {...strokeStyle} />
          <line x1="22" y1="10" x2="10" y2="22" {...strokeStyle} />
        </svg>
      );
    case ComponentType.PowerSource24V:
    case ComponentType.PowerSource0V:
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <line x1="4" y1="16" x2="28" y2="16" {...strokeStyle} />
        </svg>
      );
    default:
      return null;
  }
};

export default PaletteIcon;
