// src/types/circuit.ts

export enum ComponentType {
  PowerSource24V = '24V',
  PowerSource0V = '0V',
  NormallyOpen = 'Schalter (Schließer)',
  NormallyClosed = 'Schalter (Öffner)',
  PushbuttonNO = 'Taster (Schließer)',
  PushbuttonNC = 'Taster (Öffner)',
  Coil = 'Schützspule',
  Motor = 'Motor',
  Lamp = 'Lampe',
}

export interface Pin {
  id: string;
  componentId: string;
  label: string;
  position: { x: number; y: number };
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  label: string;
  position: { x: number; y: number };
  pins: Pin[];
  state?: { [key: string]: any };
}

export interface Connection {
  id: string;
  startPinId: string;
  endPinId: string;
}

export interface CircuitState {
  components: { [id: string]: CircuitComponent };
  connections: { [id: string]: Connection };
}
