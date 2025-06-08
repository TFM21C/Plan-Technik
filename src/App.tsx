// src/App.tsx

import React from 'react';
import './index.css';
import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';
import DetailsSidebar from './components/UI/DetailsSidebar';
import { useCircuitState } from './hooks/useCircuitState';
import { CircuitComponent, ComponentType, Pin } from './types/circuit';

interface DraggingInfo {
  componentId: string;
  offsetX: number;
  offsetY: number;
}

interface ConnectingInfo {
  startPinId: string | null;
}

export default function App() {
  const { state, setState } = useCircuitState();
  const [draggingInfo, setDraggingInfo] = React.useState<DraggingInfo | null>(null);
  const [connectingInfo, setConnectingInfo] = React.useState<ConnectingInfo>({ startPinId: null });
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
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
    const newComponent: CircuitComponent = { id: newId, type, label: newId, position: { x: 150, y: 150 }, pins };
    setState(prevState => ({ ...prevState, components: { ...prevState.components, [newId]: newComponent } }));
  };

  const getCoordsInSvg = (e: React.MouseEvent): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  const handleMouseDownOnComponent = (e: React.MouseEvent, componentId: string) => {
    e.preventDefault();
    setSelectedComponentId(componentId);
    const component = state.components[componentId];
    if (!component) return;
    const mouseCoords = getCoordsInSvg(e);
    const offsetX = mouseCoords.x - component.position.x;
    const offsetY = mouseCoords.y - component.position.y;
    setDraggingInfo({ componentId, offsetX, offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const currentMousePos = getCoordsInSvg(e);
    setMousePosition(currentMousePos);
    if (draggingInfo) {
      const { componentId, offsetX, offsetY } = draggingInfo;
      const newX = currentMousePos.x - offsetX;
      const newY = currentMousePos.y - offsetY;
      setState(prevState => ({ ...prevState, components: { ...prevState.components, [componentId]: { ...prevState.components[componentId], position: { x: newX, y: newY } } } }));
    }
  };

  const handleMouseUp = () => { setDraggingInfo(null); };

  const handleCanvasClick = () => { if (connectingInfo.startPinId) { setConnectingInfo({ startPinId: null }); } };

  const handlePinClick = (e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();
    setSelectedComponentId(null);
    if (!connectingInfo.startPinId) {
      setConnectingInfo({ startPinId: pinId });
    } else {
      if (connectingInfo.startPinId === pinId) return;
      const newConnectionId = `conn-${connectingInfo.startPinId}-${pinId}`;
      setState(prevState => ({ ...prevState, connections: { ...prevState.connections, [newConnectionId]: { id: newConnectionId, startPinId: connectingInfo.startPinId!, endPinId: pinId } } }));
      setConnectingInfo({ startPinId: null });
    }
  };

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

  const handleLabelChange = (componentId: string, newLabel: string) => {
    setState(prevState => {
      if (!prevState.components[componentId]) return prevState;
      const updatedComponent = { ...prevState.components[componentId], label: newLabel };
      return { ...prevState, components: { ...prevState.components, [componentId]: updatedComponent } };
    });
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

