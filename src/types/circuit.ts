// src/types/circuit.ts

/**
 * Definiert die möglichen Typen für unsere elektrischen Komponenten.
 * Die Verwendung eines Enums macht den Code lesbarer und vermeidet Tippfehler.
 */
export enum ComponentType {
  PowerSource24V = '24V',
  PowerSource0V = '0V',
  NormallyOpen = 'Schließer', // Schließer
  NormallyClosed = 'Öffner', // Öffner
  Motor = 'Motor',
  Lamp = 'Lampe',
}

/**
 * Repräsentiert einen einzelnen Anschlusspunkt (Pin) einer Komponente.
 */
export interface Pin {
  id: string;      // Eindeutige ID des Pins, z.B. 's1-pin-13'
  componentId: string; // ID der Komponente, zu der der Pin gehört
  label: string;   // Die Beschriftung des Pins, z.B. '13', 'A1'
}

/**
 * Die Basis-Schnittstelle für jede Komponente auf der Zeichenfläche.
 * Jede Komponente, egal welchen Typs, wird diese Eigenschaften haben.
 */
export interface CircuitComponent {
  id: string;                   // Eindeutige ID der Komponente, z.B. 's1'
  type: ComponentType;          // Der Typ der Komponente (siehe Enum oben)
  label: string;                // Die vom Benutzer vergebene Bezeichnung, z.B. 'S1'
  position: { x: number; y: number }; // Die X/Y-Koordinaten auf der Zeichenfläche
  pins: Pin[];                  // Eine Liste der Anschlusspunkte
}

/**
 * Repräsentiert eine Verbindung (ein Kabel) zwischen zwei Pins.
 */
export interface Connection {
  id: string;      // Eindeutige ID der Verbindung
  startPinId: string; // Die ID des Start-Pins
  endPinId: string;   // Die ID des End-Pins
}

/**
 * Repräsentiert den gesamten Zustand unserer Schaltung.
 * Dies ist das zentrale Datenmodell unserer Anwendung.
 */
export interface CircuitState {
  components: { [id: string]: CircuitComponent }; // Alle Komponenten, indiziert nach ihrer ID für schnellen Zugriff
  connections: { [id: string]: Connection };      // Alle Verbindungen, ebenfalls indiziert nach ID
}
