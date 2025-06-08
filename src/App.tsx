// src/App.tsx

import React from 'react';
import './index.css'; // Importiert unsere globalen CSS-Stile

// Importiert unsere Platzhalter-Komponenten
import Palette from './components/ComponentPalette/Palette';
import CircuitCanvas from './components/Canvas/CircuitCanvas';

export default function App() {
  return (
    <div className="app-container">
      {/* Der Container für die linke Seitenleiste/Palette */}
      <aside className="palette-container">
        <Palette />
      </aside>

      {/* Der Hauptbereich für die Zeichenfläche */}
      <main className="canvas-container">
        <CircuitCanvas />
      </main>
    </div>
  );
}

