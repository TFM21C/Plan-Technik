// src/components/UI/DetailsSidebar.tsx
import React from 'react';
import { CircuitComponent } from '../../types/circuit';

interface DetailsSidebarProps {
  selectedComponent: CircuitComponent | null;
  onDelete: (componentId: string) => void;
  onClose: () => void;
  onLabelChange: (componentId: string, newLabel: string) => void;
  onPinLabelChange: (pinId: string, newLabel: string) => void;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ selectedComponent, onDelete, onClose, onLabelChange, onPinLabelChange }) => {
  if (!selectedComponent) return null;

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
        {selectedComponent.pins.length > 0 && (
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
