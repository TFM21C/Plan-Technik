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
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const createPinsForComponent = (componentId: string, type: ComponentType, width: number = 40): Pin[] => {
    switch (type) {
      case ComponentType.NormallyOpen: case ComponentType.PushbuttonNO:
        return [ { id: `${componentId}-p1`, componentId, label: '3', position: { x: 16, y: 4 } }, { id: `${componentId}-p2`, componentId, label: '4', position: { x: 16, y: 28 } } ];
      case ComponentType.NormallyClosed: case ComponentType.PushbuttonNC:
        return [ { id: `${componentId}-p1`, componentId, label: '1', position: { x: 16, y: 4 } }, { id: `${componentId}-p2`, componentId, label: '2', position: { x: 16, y: 28 } } ];
      case ComponentType.Coil:
        return [ { id: `${componentId}-p1`, componentId, label: 'A1', position: { x: 16, y: 6 } }, { id: `${componentId}-p2`, componentId, label: 'A2', position: { x: 16, y: 26 } } ];
      case ComponentType.Motor: case ComponentType.Lamp:
        return [ { id: `${componentId}-p1`, componentId, label: 'X1', position: { x: 16, y: 4 } }, { id: `${componentId}-p2`, componentId, label: 'X2', position: { x: 16, y: 28 } } ];
      case ComponentType.PowerSource24V: case ComponentType.PowerSource0V:
        return Array.from({ length: Math.floor(width / 20) }, (_, i) => ({ id: `${componentId}-p${i}`, componentId, label: '', position: { x: i * 20, y: 0 } }));
      default: return [];
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase().replace(/[\(\)]/g, '').replace(/\s/g, '-')}-${Date.now()}`;
    const initialWidth = 400;
    const pins = createPinsForComponent(newId, type, initialWidth);
    let initialState: { [key: string]: any } = {};
    if (type === ComponentType.NormallyOpen || type === ComponentType.PushbuttonNO) { initialState.isOpen = true; }
    else if (type === ComponentType.NormallyClosed || type === ComponentType.PushbuttonNC) { initialState.isOpen = false; }
    if (type === ComponentType.PowerSource24V || type === ComponentType.PowerSource0V) { initialState.width = initialWidth; }
    
    const newComponent: CircuitComponent = { id: newId, type, label: `-${type.charAt(0)}${Object.keys(state.components).length + 1}`, position: { x: 150, y: 150 }, pins, state: initialState };
    setState(prevState => ({ ...prevState, components: { ...prevState.components, [newId]: newComponent } }));
    setSelectedComponentId(newId);
  };

  const handleWidthChange = (componentId: string, newWidth: number) => {
    setState(prevState => {
      const component = prevState.components[componentId];
      if (!component || (component.type !== ComponentType.PowerSource24V && component.type !== ComponentType.PowerSource0V)) return prevState;
      const updatedPins = createPinsForComponent(componentId, component.type, newWidth);
      const updatedComponent = { ...component, state: { ...component.state, width: newWidth }, pins: updatedPins };
      return { ...prevState, components: { ...prevState.components, [componentId]: updatedComponent } };
    });
  };

  const handlePinLabelChange = (pinId: string, newLabel: string) => { setState(prevState => { const component = Object.values(prevState.components).find(c => c.pins.some(p => p.id === pinId)); if (!component) return prevState; const updatedPins = component.pins.map(pin => pin.id === pinId ? { ...pin, label: newLabel } : pin); const updatedComponent = { ...component, pins: updatedPins }; return { ...prevState, components: { ...prevState.components, [component.id]: updatedComponent } }; }); };
  const handleLabelChange = (componentId: string, newLabel: string) => { setState(prevState => { if (!prevState.components[componentId]) return prevState; const updatedComponent = { ...prevState.components[componentId], label: newLabel }; return { ...prevState, components: { ...prevState.components, [componentId]: updatedComponent } }; }); };
  const handleDeleteComponent = (componentId: string) => { setState(prevState => { const { [componentId]: _, ...restComponents } = prevState.components; const componentPins = new Set(prevState.components[componentId]?.pins.map(p => p.id) || []); const newConnections = Object.fromEntries(Object.entries(prevState.connections).filter(([, conn]) => !componentPins.has(conn.startPinId) && !componentPins.has(conn.endPinId))); return { components: restComponents, connections: newConnections }; }); setSelectedComponentId(null); };
  
  //... (alle anderen Handler wie `getCoordsInSvg`, `handleMouseDownOnComponent`, `handleMouseMove` etc. bleiben unverändert)
  
  return (
    <div className="app-container">
      <aside className="palette-container">
        <Palette onAddComponent={handleAddComponent} onToggleSimulation={() => {}} isSimulating={false} />
      </aside>
      <main className="canvas-container">
        {/* ... */}
      </main>
      <DetailsSidebar
        selectedComponent={selectedComponentId ? state.components[selectedComponentId] : null}
        onDelete={handleDeleteComponent}
        onClose={() => setSelectedComponentId(null)}
        onLabelChange={handleLabelChange}
        onPinLabelChange={handlePinLabelChange}
        onWidthChange={handleWidthChange}
      />
    </div>
  );
}
