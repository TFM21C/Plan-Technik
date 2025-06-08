import React from 'react';
import { ComponentType } from '../../types/circuit';
import Button from '../UI/Button'; // Wir verwenden unsere Button-Komponente

interface PaletteProps {
  onAddComponent: (type: ComponentType) => void;
}

const Palette: React.FC<PaletteProps> = ({ onAddComponent }) => {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Bauteile</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button
          label="Schließer hinzufügen"
          onClick={() => onAddComponent(ComponentType.NormallyOpen)}
        />
        <Button
          label="Öffner hinzufügen"
          onClick={() => onAddComponent(ComponentType.NormallyClosed)}
        />
        <Button
          label="Motor hinzufügen"
          onClick={() => onAddComponent(ComponentType.Motor)}
        />
        <Button
          label="Lampe hinzufügen"
          onClick={() => onAddComponent(ComponentType.Lamp)}
        />
      </div>
    </div>
  );
};

export default Palette;
