// Globale Konfiguration für Wahrscheinlichkeiten der Systeme
// Die Werte bestimmen, wie wahrscheinlich es ist, dass eine Aufgabe von einem bestimmten System generiert wird
// Höhere Werte = höhere Wahrscheinlichkeit

export const systemProbabilities = {
  '01': 1.0,   // Standard-Wahrscheinlichkeit
  '02': 1.0,
  '03': 0.8,   // Etwas seltener
  '04': 1.0,
  '05': 1.0,
  '06': 1.2,   // Etwas häufiger
  '07': 1.0,
  '08': 1.0,
  '09': 0.9,
  '10': 1.0,
  '11': 1.0,
  '12': 1.0,
  '13': 1.0,
  '14': 1.0,
  '15': 1.0,
  '16': 0.8,
  '17': 1.0,
  '18': 1.0,
  '19': 1.0,
  '20': 1.0,
  '21': 1.0,
  '22': 1.0,
  '23': 1.0,
  '24': 1.0,
  '25': 1.0,
  '26': 1.0,
  '28': 1.0,
  '29': 1.0,
  '30': 1.0,
  '31': 1.0,
};

// Funktion zum Abrufen der Wahrscheinlichkeit für ein System (Standard: 1.0)
export function getProbability(systemId) {
  return systemProbabilities[systemId] || 1.0;
}

// Funktion zum Normalisieren der Wahrscheinlichkeiten für eine Liste von Systemen
// Gibt ein Objekt zurück: { systemId: normalizedProbability }
export function normalizeProbabilities(selectedSystems) {
  const probabilities = {};
  let totalWeight = 0;
  
  // Sammle Gewichte für ausgewählte Systeme
  for (const systemId of selectedSystems) {
    const weight = getProbability(systemId);
    probabilities[systemId] = weight;
    totalWeight += weight;
  }
  
  // Normalisiere (optional, aber hilfreich für Debugging)
  const normalized = {};
  for (const systemId in probabilities) {
    normalized[systemId] = probabilities[systemId] / totalWeight;
  }
  
  return { probabilities, normalized, totalWeight };
}

// Funktion zum Zufälligen Auswählen eines Systems basierend auf Wahrscheinlichkeiten
export function selectSystemByProbability(selectedSystems) {
  const { probabilities, totalWeight } = normalizeProbabilities(selectedSystems);
  
  // Zufällige Zahl zwischen 0 und totalWeight
  let random = Math.random() * totalWeight;
  
  // Finde das System, das diesem Zufallswert entspricht
  for (const systemId of selectedSystems) {
    random -= probabilities[systemId];
    if (random <= 0) {
      return systemId;
    }
  }
  
  // Fallback (sollte nicht passieren)
  return selectedSystems[0];
}
