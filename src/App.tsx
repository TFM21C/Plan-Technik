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
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false); // NEU
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
      case ComponentType.PushbuttonNO:
      case ComponentType.PushbuttonNC:
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
      case ComponentType.PowerSource24V:
      case ComponentType.PowerSource0V:
        return Array.from({ length: 15 }, (_, i) => ({
          id: `${componentId}-p${i}`,
          componentId,
          label: '',
          position: { x: 50 + i * 25, y: 0 },
        }));
      case ComponentType.Coil:
        return [
          { id: `${componentId}-p1`, componentId, label: 'A1', position: { x: 20, y: 5 } },
          { id: `${componentId}-p2`, componentId, label: 'A2', position: { x: 20, y: 25 } },
        ];
      default:
        return [];
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    const pins = createPinsForComponent(newId, type);
    let initialState = {} as any;
    if (type === ComponentType.NormallyOpen || type === ComponentType.PushbuttonNO) {
      initialState = { isOpen: true };
    } else if (type === ComponentType.NormallyClosed || type === ComponentType.PushbuttonNC) {
      initialState = { isOpen: false };
    }
    const newComponent: CircuitComponent = { id: newId, type, label: newId, position: { x: 150, y: 150 }, pins, state: initialState };
    setState(prevState => ({ ...prevState, components: { ...prevState.components, [newId]: newComponent } }));
    setSelectedComponentId(newId);
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
    if (isSimulating) return; // Im Simulationsmodus nicht ziehen
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

  const handleCanvasClick = () => {
    if (connectingInfo.startPinId) {
      setConnectingInfo({ startPinId: null });
    }
  };

  const handlePinClick = (e: React.MouseEvent, pinId: string) => {
    if (isSimulating) return; // Im Simulationsmodus keine Verbindungen erstellen
    e.stopPropagation();
    setSelectedComponentId(null);
    if (!connectingInfo.startPinId) {
      setConnectingInfo({ startPinId: pinId });
    } else {
      if (connectingInfo.startPinId === pinId) {
        setConnectingInfo({ startPinId: null });
        return;
      }
      const newConnectionId = `conn-${connectingInfo.startPinId}-${pinId}`;
      setState(prevState => ({ ...prevState, connections: { ...prevState.connections, [newConnectionId]: { id: newConnectionId, startPinId: connectingInfo.startPinId!, endPinId: pinId } } }));
      setConnectingInfo({ startPinId: null });
    }
  };

  // NEU: Schaltet die Simulation an/aus
  const handleToggleSimulation = () => {
    setIsSimulating(prev => !prev);
    setSelectedComponentId(null); // Auswahl bei Moduswechsel aufheben
  };

  // NEU: Behandelt Klicks auf Bauteile (nur im Simulationsmodus)
  const handleComponentClick = (e: React.MouseEvent, componentId: string) => {
    if (!isSimulating) return; // Nur im Simulationsmodus

    e.stopPropagation();
    const component = state.components[componentId];
    if (component.type === ComponentType.NormallyOpen || component.type === ComponentType.NormallyClosed) {
      setState(prevState => {
        const currentComp = prevState.components[componentId];
        const newCompState = { ...currentComp.state, isOpen: !currentComp.state?.isOpen };
        return { ...prevState, components: { ...prevState.components, [componentId]: { ...currentComp, state: newCompState } } };
      });
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

  const handlePinLabelChange = (pinId: string, newLabel: string) => {
    setState(prevState => {
      const componentId = pinId.split('-p')[0];
      const component = prevState.components[componentId];
      if (!component) return prevState;

      const updatedPins = component.pins.map(pin =>
        pin.id === pinId ? { ...pin, label: newLabel } : pin
      );
      const updatedComponent = { ...component, pins: updatedPins };

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
        <Palette 
          onAddComponent={handleAddComponent} 
          onToggleSimulation={handleToggleSimulation}
          isSimulating={isSimulating}
        />
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
          onComponentClick={handleComponentClick} // NEU
        />
      </main>
      {/* Detail-Seitenleiste im Simulationsmodus ausblenden */}
      {!isSimulating && (
        <DetailsSidebar
          selectedComponent={selectedComponentId ? state.components[selectedComponentId] : null}
          onDelete={handleDeleteComponent}
          onClose={() => setSelectedComponentId(null)}
          onLabelChange={handleLabelChange}
          onPinLabelChange={handlePinLabelChange}
        />
      )}
    </div>
  );
}
