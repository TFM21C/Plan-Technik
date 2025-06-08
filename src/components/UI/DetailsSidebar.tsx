import React from 'react';
import { CircuitComponent } from '../../types/circuit';

interface DetailsSidebarProps {
  selectedComponent: CircuitComponent | null;
  onDelete: (componentId: string) => void;
  onClose: () => void;
  onLabelChange: (componentId: string, newLabel: string) => void;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ selectedComponent, onDelete, onClose, onLabelChange }) => {
  if (!selectedComponent) {
    return null;
  }

  return (
    <aside className="details-sidebar">
      <div className="sidebar-header">
        <h3>Bauteil Details</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      <div className="sidebar-content">
        <p><strong>ID:</strong> {selectedComponent.id}</p>
        <p><strong>Typ:</strong> {selectedComponent.type}</p>
        <p><strong>Bezeichnung:</strong></p>
        <input
          type="text"
          value={selectedComponent.label}
          onChange={(e) => onLabelChange(selectedComponent.id, e.target.value)}
          className="details-input"
        />
        <button onClick={() => onDelete(selectedComponent.id)} className="delete-btn">
          Bauteil löschen
        </button>
      </div>
    </aside>
  );
};

export default DetailsSidebar;
