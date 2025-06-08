// src/App.tsx

import React from 'react';
import './index.css';

import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import { useCircuitState } from './hooks/useCircuitState';
import { CircuitComponent, ComponentType } from './types/circuit';

// Ein kleiner Typ für unsere Dragging-Informationen
interface DraggingInfo {
  componentId: string;
  offsetX: number;
  offsetY: number;
}

export default function App() {
  const { state, setState } = useCircuitState();
  // Neuer State, um zu verfolgen, was gerade gezogen wird.
  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | null>(null);

  React.useEffect(() => {
    // ... (der useEffect zum initialen Setzen der Stromschienen bleibt unverändert)
    setState({
      components: {
        'power-24v': { id: 'power-24v', type: ComponentType.PowerSource24V, label: '+24V', position: { x: 50, y: 50 }, pins: [] },
        'power-0v': { id: 'power-0v', type: ComponentType.PowerSource0V, label: '0V', position: { x: 50, y: 600 }, pins: [] },
      },
      connections: {},
    });
  }, [setState]);

  const handleAddComponent = (type: ComponentType) => {
    // ... (diese Funktion bleibt unverändert)
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    const newComponent: CircuitComponent = {
      id: newId, type: type, label: newId,
      position: { x: 150, y: 150 }, pins: [],
    };
    setState(prevState => ({
      ...prevState,
      components: { ...prevState.components, [newId]: newComponent },
    }));
  };

  // --- NEUE FUNKTIONEN FÜR DRAG & DROP ---

  const handleMouseDownOnComponent = (e: React.MouseEvent, componentId: string) => {
    // Verhindert, dass Text markiert wird etc.
    e.preventDefault();
    const component = state.components[componentId];
    if (!component) return;

    // Berechnet den Klick-Offset relativ zur oberen linken Ecke des Bauteils
    const offsetX = e.clientX - component.position.x;
    const offsetY = e.clientY - component.position.y;

    setDraggingInfo({ componentId, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Nur wenn wir gerade ein Bauteil ziehen...
    if (draggingInfo) {
      const { componentId, offsetX, offsetY } = draggingInfo;
      // Neue Position berechnen
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      // ...aktualisieren wir die Position dieses einen Bauteils im State.
      setState(prevState => ({
        ...prevState,
        components: {
          ...prevState.components,
          [componentId]: {
            ...prevState.components[componentId],
            position: { x: newX, y: newY },
          },
        },
      }));
    }
  };

  const handleMouseUp = () => {
    // Beendet den Drag-Vorgang, indem wir die Dragging-Info zurücksetzen.
    setDraggingInfo(null);
  };

  return (
    <div className="app-container">
      <aside className="palette-container">
        <Palette onAddComponent={handleAddComponent} />
      </aside>
      <main className="canvas-container">
        <CircuitCanvas
          components={Object.values(state.components)}
          onComponentMouseDown={handleMouseDownOnComponent}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </main>
    </div>
  );
}

