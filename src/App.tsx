// src/App.tsx

import React from 'react';
import './index.css';
import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import DetailsSidebar from './components/UI/DetailsSidebar';
import { useCircuitState } from './hooks/useCircuitState';
import { CircuitComponent, ComponentType, Pin } from './types/circuit';

interface DraggingInfo { componentId: string; offsetX: number; offsetY: number; }
interface ConnectingInfo { startPinId: string | null; }

export default function App() {
  const { state, setState } = useCircuitState();
  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | null>(null);
  const [connectingInfo, setConnectingInfo] = React.useState<ConnectingInfo>({ startPinId: null });
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Initialer Zustand
  React.useEffect(() => { /* ... bleibt unverändert ... */ }, [setState]);
  // Pin-Erstellung
  const createPinsForComponent = (componentId: string, type: ComponentType): Pin[] => { /* ... bleibt unverändert ... */ };
  // Bauteil hinzufügen
  const handleAddComponent = (type: ComponentType) => { /* ... bleibt unverändert ... */ };
  // Mauskoordinaten holen
  const getCoordsInSvg = (e: React.MouseEvent): {x: number, y: number} => { /* ... bleibt unverändert ... */ };
  
  // Drag & Drop Handler
  const handleMouseDownOnComponent = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault();
    setSelectedComponentId(componentId);
    // ... restliche Drag&Drop Logik bleibt unverändert ...
  };
  const handleMouseMove = (e: React.MouseEvent) => { /* ... bleibt unverändert ... */ };
  const handleMouseUp = () => { /* ... bleibt unverändert ... */ };

  // Verbindungs-Handler
  const handleCanvasClick = () => { /* ... bleibt unverändert ... */ };
  const handlePinClick = (e: React.MouseEvent, pinId: string) => {
      e.stopPropagation();
      setSelectedComponentId(null);
      // ... restliche Verbindungs-Logik bleibt unverändert ...
  };
  const getConnectingInfoForCanvas = () => { /* ... bleibt unverändert ... */ };

  // Löschen-Handler (aus dem main branch)
  const handleDeleteComponent = (componentId: string) => {
    setState(prevState => {
      const newComponents = { ...prevState.components };
      delete newComponents[componentId];

      const newConnections = { ...prevState.connections };
      Object.values(newConnections).forEach(conn => {
        const startPin = Object.values(prevState.components).flatMap(c => c.pins).find(p => p.id === conn.startPinId);
        const endPin = Object.values(prevState.components).flatMap(c => c.pins).find(p => p.id === conn.endPinId);
        if (startPin?.componentId === componentId || endPin?.componentId === componentId) {
          delete newConnections[conn.id];
        }
      });
      return { components: newComponents, connections: newConnections };
    });
    setSelectedComponentId(null);
  };

  // Label-Ändern-Handler (vom Agenten)
  const handleLabelChange = (componentId: string, newLabel: string) => {
    setState(prevState => {
      if (!prevState.components[componentId]) return prevState;
      const updatedComponent = { ...prevState.components[componentId], label: newLabel };
      return {
        ...prevState,
        components: { ...prevState.components, [componentId]: updatedComponent },
      };
    });
  };

  return (
    <div className="app-container">
      <aside className="palette-container">
        <Palette onAddComponent={handleAddComponent} />
      </aside>
      <main className="canvas-container">
        <CircuitCanvas
            svgRef={svgRef}
            components={state.components}
            connections={state.connections}
            selectedComponentId={selectedComponentId}
            onComponentMouseDown={handleMouseDownOnComponent}
            onPinClick={handlePinClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onCanvasClick={handleCanvasClick}
            connectingInfo={getConnectingInfoForCanvas()}
        />
      </main>
      <DetailsSidebar
        selectedComponent={selectedComponentId ? state.components[selectedComponentId] : null}
        onDelete={handleDeleteComponent}
        onClose={() => setSelectedComponentId(null)}
        onLabelChange={handleLabelChange}
      />
    </div>
  );
}