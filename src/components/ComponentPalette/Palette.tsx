// src/components/ComponentPalette/Palette.tsx
import React from 'react';
import { ComponentType } from '../../types/circuit';
import PaletteIcon from './PaletteIcon';

interface PaletteProps {
  onAddComponent: (type: ComponentType) => void;
  onToggleSimulation: () => void;
  isSimulating: boolean;
}

const PaletteButton: React.FC<{ type: ComponentType, onAddComponent: (type: ComponentType) => void, disabled: boolean }> = ({ type, onAddComponent, disabled }) => (
  <button onClick={() => onAddComponent(type)} disabled={disabled} className="palette-button">
    <PaletteIcon type={type} />
    <span className="palette-button-label">{type}</span>
  </button>
);
// ... (Rest der Komponente ist identisch und korrekt)