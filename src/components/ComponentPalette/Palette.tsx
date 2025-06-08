// src/components/ComponentPalette/Palette.tsx

import React from 'react';
import { ComponentType } from '../../types/circuit';
import Button from '../UI/Button';

interface PaletteProps {
  onAddComponent: (type: ComponentType) => void;
  onToggleSimulation: () => void; // NEU
  isSimulating: boolean; // NEU
}

const Palette: React.FC<PaletteProps> = ({ onAddComponent, onToggleSimulation, isSimulating }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <h3 style={{ marginTop: 0 }}>Bauteile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Die Buttons sind im Simulationsmodus deaktiviert */}
          <Button label="Schließer hinzufügen" onClick={() => onAddComponent(ComponentType.NormallyOpen)} disabled={isSimulating} />
          <Button label="Öffner hinzufügen" onClick={() => onAddComponent(ComponentType.NormallyClosed)} disabled={isSimulating} />
          <Button label="Motor hinzufügen" onClick={() => onAddComponent(ComponentType.Motor)} disabled={isSimulating} />
          <Button label="Lampe hinzufügen" onClick={() => onAddComponent(ComponentType.Lamp)} disabled={isSimulating} />
        </div>
      </div>

      {/* NEU: Simulations-Steuerung am unteren Rand der Palette */}
      <div style={{ marginTop: 'auto' }}>
        <h3 style={{ borderTop: '1px solid #ccc', paddingTop: '1rem' }}>Simulation</h3>
        <Button
          label={isSimulating ? 'Simulation Stoppen' : 'Simulation Starten'}
          onClick={onToggleSimulation}
          style={{ backgroundColor: isSimulating ? '#f44336' : '#4CAF50', color: 'white', width: '100%' }}
        />
      </div>
    </div>
  );
};

export default Palette;
