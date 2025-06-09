import React from 'react';
import { CircuitComponent, Connection, Pin } from '../../types/circuit';
import DraggableComponent from '../ElectricalComponents/DraggableComponent';

interface CircuitCanvasProps {
  svgRef: React.RefObject<SVGSVGElement>;
  components: { [id: string]: CircuitComponent };
  connections: { [id: string]: Connection };
  selectedComponentId: string | null;
  onComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onPinClick: (e: React.MouseEvent, pinId: string) => void;
  onComponentClick: (e: React.MouseEvent, componentId: string) => void; // NEU
  onConnectionClick: (connectionId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onCanvasClick: () => void;
  connectingInfo?: { startPin: Pin; mousePosition: { x: number; y: number } } | null;
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = (props) => {
  const {
    svgRef,
    components,
    connections,
    selectedComponentId,
    onComponentMouseDown,
    onPinClick,
    onComponentClick,
    onConnectionClick,
    onMouseMove,
    onMouseUp,
    onCanvasClick,
    connectingInfo,
  } = props;

  const [hoveredConnectionId, setHoveredConnectionId] = React.useState<string | null>(null);

  const getAbsolutePinPosition = (pinId: string) => {
    const pin = Object.values(components)
      .flatMap(c => c.pins)
      .find(p => p.id === pinId);
    if (!pin) return { x: 0, y: 0 };
    const component = components[pin.componentId];
    return {
      x: component.position.x + pin.position.x,
      y: component.position.y + pin.position.y,
    };
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ backgroundColor: 'white', border: '1px solid #ccc' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onClick={onCanvasClick}
    >
      {Object.values(connections).map(conn => {
        const start = getAbsolutePinPosition(conn.startPinId);
        const end = getAbsolutePinPosition(conn.endPinId);
        return (
          <line
            key={conn.id}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={hoveredConnectionId === conn.id ? 'red' : 'black'}
            strokeWidth={2}
            onMouseEnter={() => setHoveredConnectionId(conn.id)}
            onMouseLeave={() => setHoveredConnectionId(null)}
            onClick={(e) => {
              e.stopPropagation();
              onConnectionClick(conn.id);
            }}
            style={{ cursor: 'pointer' }}
          />
        );
      })}
      {connectingInfo && (
        <line
          x1={getAbsolutePinPosition(connectingInfo.startPin.id).x}
          y1={getAbsolutePinPosition(connectingInfo.startPin.id).y}
          x2={connectingInfo.mousePosition.x}
          y2={connectingInfo.mousePosition.y}
          stroke="red"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}
      {Object.values(components).map(component => (
        <DraggableComponent
          key={component.id}
          component={component}
          isSelected={component.id === selectedComponentId}
          onMouseDown={onComponentMouseDown}
          onPinClick={onPinClick}
          onComponentClick={onComponentClick}
        />
      ))}
    </svg>
  );
};

export default CircuitCanvas;
