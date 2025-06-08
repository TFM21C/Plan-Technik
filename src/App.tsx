// src/App.tsx

import React from 'react';
import './index.css';

import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import { useCircuitState } from './hooks/useCircuitState';
import { CircuitComponent, ComponentType, Pin } from './types/circuit';

// Ein kleiner Typ für unsere Dragging-Informationen
interface DraggingInfo {
  componentId: string;
  offsetX: number;
  offsetY: number;
}
interface ConnectingInfo { startPinId: string | null; }

export default function App() {
  const { state, setState } = useCircuitState();
  // Neuer State, um zu verfolgen, was gerade gezogen wird.
  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | null>(null);
  // State für den Verbindungsmodus
  const [connectingInfo, setConnectingInfo] = React.useState<ConnectingInfo>({ startPinId: null });
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

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

  const createPinsForComponent = (componentId: string, type: ComponentType): Pin[] => {
    switch (type) {
        case ComponentType.NormallyOpen:
        case ComponentType.NormallyClosed:
            return [
                { id: `${componentId}-p1`, componentId, label: '1', position: { x: 10, y: 0 } },
                { id: `${componentId}-p2`, componentId, label: '2', position: { x: 10, y: 40 } },
            ];
        case ComponentType.Motor:
        case ComponentType.Lamp:
            return [
                { id: `${componentId}-p1`, componentId, label: 'A1', position: { x: 20, y: 2 } },
                { id: `${componentId}-p2`, componentId, label: 'A2', position: { x: 20, y: 38 } },
            ];
        default:
            return [];
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    const pins = createPinsForComponent(newId, type);
    const newComponent: CircuitComponent = {
      id: newId, type, label: newId,
      position: { x: 150, y: 150 }, pins,
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
    setMousePosition({ x: e.clientX, y: e.clientY });
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

  const handleCanvasClick = () => {
    if (connectingInfo.startPinId) {
        setConnectingInfo({ startPinId: null });
    }
  };

  const handlePinClick = (e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();

    if (!connectingInfo.startPinId) {
      setConnectingInfo({ startPinId: pinId });
    } else {
      const newConnectionId = `conn-${connectingInfo.startPinId}-${pinId}`;
      setState(prevState => ({
        ...prevState,
        connections: {
            ...prevState.connections,
            [newConnectionId]: { id: newConnectionId, startPinId: connectingInfo.startPinId!, endPinId: pinId }
        }
      }));
      setConnectingInfo({ startPinId: null });
    }
  };

  const getConnectingInfoForCanvas = () => {
    if (!connectingInfo.startPinId) return null;
    const startPin = Object.values(state.components).flatMap(c => c.pins).find(p => p.id === connectingInfo.startPinId);
    if (!startPin) return null;
    return { startPin, mousePosition };
  };

  return (
    <div className="app-container">
      <aside className="palette-container">
        <Palette onAddComponent={handleAddComponent} />
      </aside>
      <main className="canvas-container">
        <CircuitCanvas
          components={state.components}
          connections={state.connections}
          onComponentMouseDown={handleMouseDownOnComponent}
          onPinClick={handlePinClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onCanvasClick={handleCanvasClick}
          connectingInfo={getConnectingInfoForCanvas()}
        />
      </main>
    </div>
  );
}

