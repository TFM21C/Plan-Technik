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

const Palette: React.FC<PaletteProps> = ({ onAddComponent, onToggleSimulation, isSimulating }) => {
  const componentsToAdd = [
    ComponentType.PowerSource24V, ComponentType.PowerSource0V,
    ComponentType.PushbuttonNO, ComponentType.PushbuttonNC,
    ComponentType.NormallyOpen, ComponentType.NormallyClosed,
    ComponentType.Coil, ComponentType.Lamp, ComponentType.Motor
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <h3 style={{ marginTop: 0 }}>Bauteile</h3>
        <div className="palette-grid">
          {componentsToAdd.map(type => (
            <PaletteButton key={type} type={type} onAddComponent={onAddComponent} disabled={isSimulating} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <h3 style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>Simulation</h3>
        <button
          onClick={onToggleSimulation}
          className="simulation-button"
          style={{ backgroundColor: isSimulating ? '#f44336' : '#4CAF50' }}
        >
          {isSimulating ? 'Simulation Stoppen' : 'Simulation Starten'}
        </button>
      </div>
    </div>
  );
};
export default Palette;
