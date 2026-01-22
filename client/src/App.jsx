import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [systems, setSystems] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState(new Set(['01'])); // Set of selected system IDs
  const [totalTaskCount, setTotalTaskCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/systems');
      if (!response.ok) {
        throw new Error('Server responded with error');
      }
      const data = await response.json();
      setSystems(data.systems);
      setServerError(false);
    } catch (error) {
      console.error('Error fetching systems:', error);
      setServerError(true);
      // Set default systems as fallback
      setSystems([
        { id: '01', name: 'System 01', description: 'Zwei abwechselnde Operationen' },
        { id: '02', name: 'System 02', description: 'Zwei abwechselnde Operationen, die sich pro Schritt ändern' },
        { id: '03', name: 'System 03', description: 'Zwei Ebenen von Differenzen' },
        { id: '04', name: 'System 04', description: 'Drei sich wiederholende Operationen' },
        { id: '05', name: 'System 05', description: 'Drei Operationen, die sich pro Zyklus ändern' },
        { id: '06', name: 'System 06', description: 'Fibonacci-Folge' },
        { id: '07', name: 'System 07', description: 'Fibonacci mit abwechselnden Additionen und Subtraktionen' },
        { id: '08', name: 'System 08', description: 'Tribonacci-Folge' },
        { id: '09', name: 'System 09', description: 'Fibonacci-Variante: Z(n) = Z(n-1) + Z(n-3)' },
        { id: '10', name: 'System 10', description: 'Fibonacci im Rechenschritt' },
        { id: '11', name: 'System 11', description: 'Zwei verschachtelte Sequenzen' },
        { id: '12', name: 'System 12', description: 'Zwei verschachtelte Sequenzen, Zw1 ändert sich pro Zyklus' },
        { id: '13', name: 'System 13', description: '3er-Sprung: Operationen mit Sprung von 3 Positionen' },
        { id: '14', name: 'System 14', description: '3er-Sprung: Dr1 mit steigenden Werten' }
      ]);
    }
  };

  const toggleSystem = (systemId) => {
    const newSelected = new Set(selectedSystems);
    if (newSelected.has(systemId)) {
      newSelected.delete(systemId);
    } else {
      newSelected.add(systemId);
    }
    setSelectedSystems(newSelected);
  };

  const selectAll = () => {
    setSelectedSystems(new Set(systems.map(s => s.id)));
  };

  const deselectAll = () => {
    setSelectedSystems(new Set());
  };

  const generatePDF = async () => {
    if (selectedSystems.size === 0) {
      alert('Bitte wählen Sie mindestens ein System aus.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systems: Array.from(selectedSystems),
          totalCount: totalTaskCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medat-gemischte-systeme.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Fehler beim Generieren der PDF. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MedAT Zahlenfolgen Generator</h1>
        <p>Erstellen Sie PDF-Aufgaben für den MedAT Medizin Zulassungstest</p>
      </header>

      <main className="app-main">
        <div className="generator-card">
          {serverError && (
            <div style={{ 
              padding: '1rem', 
              background: '#fff3cd', 
              border: '1px solid #ffc107', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              color: '#856404'
            }}>
              ⚠️ Server nicht erreichbar. Bitte starten Sie den Server mit <code>npm run server</code> im server-Verzeichnis.
            </div>
          )}
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="system-select">Systeme auswählen ({selectedSystems.size} ausgewählt):</label>
              <div>
                <button 
                  onClick={selectAll}
                  style={{ 
                    marginRight: '0.5rem', 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.875rem',
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Alle auswählen
                </button>
                <button 
                  onClick={deselectAll}
                  style={{ 
                    padding: '0.25rem 0.5rem', 
                    fontSize: '0.875rem',
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Alle abwählen
                </button>
              </div>
            </div>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1rem',
              background: '#fafafa'
            }}>
              {systems.length === 0 ? (
                <div>Lade Systeme...</div>
              ) : (
                systems.map((system) => (
                  <label 
                    key={system.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.5rem',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      marginBottom: '0.25rem',
                      background: selectedSystems.has(system.id) ? '#e3f2fd' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedSystems.has(system.id)) {
                        e.currentTarget.style.background = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedSystems.has(system.id)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSystems.has(system.id)}
                      onChange={() => toggleSystem(system.id)}
                      style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <strong>{system.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                        {system.description}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-count">Anzahl der Aufgaben insgesamt:</label>
            <input
              id="task-count"
              type="number"
              min="1"
              max="1000"
              value={totalTaskCount}
              onChange={(e) => setTotalTaskCount(parseInt(e.target.value) || 100)}
              className="number-input"
            />
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              Die Aufgaben werden basierend auf den konfigurierten Wahrscheinlichkeiten der ausgewählten Systeme verteilt.
            </div>
          </div>

          <button
            onClick={generatePDF}
            disabled={loading || selectedSystems.size === 0}
            className="generate-button"
            style={{ 
              opacity: selectedSystems.size === 0 ? 0.5 : 1,
              cursor: selectedSystems.size === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'PDF wird generiert...' : `PDF generieren (${totalTaskCount} Aufgaben)`}
          </button>

          <div className="info-box">
            <h3>Informationen:</h3>
            <ul>
              <li>Jede Aufgabe enthält eine Zahlenfolge mit 7 gegebenen Zahlen (getrennt durch |)</li>
              <li>Es müssen die Positionen 8 und 9 aus 5 Antwortmöglichkeiten gewählt werden</li>
              <li>A) - D) enthalten Zahlenpaare im Format "Position 8 / Position 9"</li>
              <li>E) bedeutet "Keine der gegebenen Antworten ist richtig"</li>
              <li>Die Lösungen sind am Ende jeder Aufgabe angegeben</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
