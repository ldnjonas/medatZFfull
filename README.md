# MedAT Zahlenfolgen Generator

Eine Web-Applikation zur Generierung von PDF-Aufgaben für den MedAT Medizin Zulassungstest, speziell für den Untertest "Zahlenfolgen".

## Features

- Generierung von Aufgaben mit 7 gegebenen Zahlen
- 5 Antwortmöglichkeiten (A-D: konkrete Zahlen, E: keine der Antworten ist korrekt)
- PDF-Export zum Ausdrucken
- System 01 implementiert (Pattern: -16, x2, -16, x2...)

## Installation

1. Installiere alle Dependencies:
```bash
npm run install-all
```

## Entwicklung

Starte Frontend und Backend gleichzeitig:
```bash
npm run dev
```

Oder einzeln:
```bash
# Backend (Port 3001)
npm run server

# Frontend (Port 3000)
npm run client
```

## System 01

Pattern: R1 = -16, R2 = x2 (abwechselnd)
- Beispiel: 34, 18, 36, 20, 40, 24, 48
- Position 8: 48 - 16 = 32
- Position 9: 32 * 2 = 64

## Projektstruktur

```
medatZFfull/
├── client/          # React Frontend
├── server/          # Node.js Backend
│   └── systems/     # System-Implementierungen
└── package.json     # Root package.json
```
