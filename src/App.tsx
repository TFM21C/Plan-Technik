// src/App.tsx

import React from 'react';
import './index.css';

// Importiert unsere Komponenten und den State-Hook
import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import { useCircuitState } from './hooks/useCircuitState';
import { ComponentType } from './types/circuit'; // Wir brauchen den ComponentType für unsere Beispieldaten

export default function App() {
  // Wir rufen unseren Hook auf, um den Zustand der Schaltung zu bekommen.
  // Vorerst nutzen wir nur den 'state', die 'setState' Funktion kommt später.
  const { state, setState } = useCircuitState();

  // Wir erstellen hier manuell ein paar Start-Komponenten zum Testen.
  // Später werden diese aus der Palette hinzugefügt.
  const initialComponents = {
    'power-24v': {
      id: 'power-24v',
      type: ComponentType.PowerSource24V,
      label: '+24V',
      position: { x: 50, y: 50 },
      pins: [], // Vorerst leer
    },
    'power-0v': {
      id: 'power-0v',
      type: ComponentType.PowerSource0V,
      label: '0V',
      position: { x: 50, y: 600 },
      pins: [], // Vorerst leer
    },
  };

  return (
    <div className="app-container">
      <aside className="palette-container">
        <Palette />
      </aside>

      <main className="canvas-container">
        {/* Wir übergeben unsere Test-Komponenten an die Zeichenfläche */}
        <CircuitCanvas components={Object.values(initialComponents)} />
      </main>
    </div>
  );
}
