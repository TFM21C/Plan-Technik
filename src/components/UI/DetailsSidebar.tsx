// src/components/UI/DetailsSidebar.tsx
import React from 'react';
import { CircuitComponent, ComponentType } from '../../types/circuit';

interface DetailsSidebarProps {
  selectedComponent: CircuitComponent | null;
  onDelete: (componentId: string) => void;
  onClose: () => void;
  onLabelChange: (componentId: string, newLabel: string) => void;
  onPinLabelChange: (pinId: string, newLabel: string) => void;
  onWidthChange: (componentId: string, newWidth: number) => void;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ selectedComponent, onDelete, onClose, onLabelChange, onPinLabelChange, onWidthChange }) => {
  if (!selectedComponent) return null;

  const isPowerRail = selectedComponent.type === ComponentType.PowerSource24V || selectedComponent.type === ComponentType.PowerSource0V;

  return (
    <aside className="details-sidebar">
      <div className="sidebar-header">
        <h3>Bauteil Details</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="sidebar-content">
        <div>
          <p><strong>Bezeichnung:</strong></p>
          <input type="text" value={selectedComponent.label} onChange={(e) => onLabelChange(selectedComponent.id, e.target.value)} className="details-input"/>
        </div>
        
        {isPowerRail && (
          <div>
            <p><strong>Länge (px):</strong></p>
            <input type="number" value={selectedComponent.state?.width || 400} onChange={(e) => onWidthChange(selectedComponent.id, parseInt(e.target.value, 10))} className="details-input"/>
          </div>
        )}

        {selectedComponent.pins.length > 0 && !isPowerRail && (
          <div style={{marginTop: '1rem'}}>
            <p><strong>Anschlüsse:</strong></p>
            {selectedComponent.pins.map((pin, index) => (
              <div key={pin.id} className="pin-edit-row">
                <label htmlFor={pin.id}>{`Anschluss ${index + 1}`}:</label>
                <input id={pin.id} type="text" value={pin.label} onChange={(e) => onPinLabelChange(pin.id, e.target.value)} className="details-input pin-input" />
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => onDelete(selectedComponent.id)} className="delete-btn">
        Bauteil löschen
      </button>
    </aside>
  );
};
export default DetailsSidebar;
