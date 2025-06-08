// src/App.tsx

import React from 'react';
import './index.css';

import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import { useCircuitState } from './hooks/useCircuitState';
import { CircuitComponent, ComponentType } from './types/circuit';

export default function App() {
  const { state, setState } = useCircuitState();

  // Initialer Zustand mit den Stromschienen.
  // Wird nur beim ersten Rendern verwendet.
  React.useEffect(() => {
    setState({
      components: {
        'power-24v': {
          id: 'power-24v', type: ComponentType.PowerSource24V, label: '+24V',
          position: { x: 50, y: 50 }, pins: [],
        },
        'power-0v': {
          id: 'power-0v', type: ComponentType.PowerSource0V, label: '0V',
          position: { x: 50, y: 600 }, pins: [],
        },
      },
      connections: {},
    });
  }, [setState]); // Abhängigkeit von setState, um ESLint-Warnungen zu vermeiden


  // Diese Funktion wird von der Palette aufgerufen, um ein neues Bauteil hinzuzufügen.
  const handleAddComponent = (type: ComponentType) => {
    // Erzeugt eine neue, einzigartige ID für das Bauteil
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    
    const newComponent: CircuitComponent = {
      id: newId,
      type: type,
      label: newId, // Vorerst ein einfacher Label
      position: { x: 150, y: 150 }, // Startposition für neue Bauteile
      pins: [], // Pin-Logik kommt später
    };

    // Aktualisiert den Zustand: Behält alle alten Komponenten und fügt die neue hinzu.
    setState(prevState => ({
      ...prevState,
      components: {
        ...prevState.components,
        [newId]: newComponent,
      },
    }));
  };

  return (
    <div className="app-container">
      <aside className="palette-container">
        {/* Wir übergeben die handleAddComponent Funktion an die Palette */}
        <Palette onAddComponent={handleAddComponent} />
      </aside>

      <main className="canvas-container">
        {/* Die Zeichenfläche erhält jetzt die Komponenten aus dem dynamischen Zustand */}
        <CircuitCanvas components={Object.values(state.components)} />
      </main>
    </div>
  );
}
