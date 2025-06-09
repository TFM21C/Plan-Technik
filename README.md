# Plan-Technik

Plan-Technik ist ein kleiner Schaltplan-Editor auf Basis von React und TypeScript. Mit ihm lassen sich elektrische Bauteile per Drag & Drop auf eine Zeichenfläche ziehen, verbinden und in einer einfachen Simulation schalten.

## Projekt lokal starten

```bash
yarn install # oder npm install

yarn start   # oder npm start
```

Danach läuft die Anwendung unter `http://localhost:3000`.

## Ordnerstruktur

```
src/
  components/        UI- und Schaltplan-Komponenten
    Canvas/          Zeichenfläche für Bauteile und Leitungen
    ComponentPalette/Palette mit verfügbaren Bauteilen
    ElectricalComponents/Visualisierung einzelner Bauteile
    UI/              allgemeine UI-Elemente (Sidebar, Buttons)
  hooks/             React Hooks wie `useCircuitState`
  types/             TypeScript-Typen für Schaltplan und Bauteile
  utils/             kleine Hilfsfunktionen
public/              HTML-Template
```
