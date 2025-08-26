import React from 'react';
import { useCalculatorStore } from '../store';

const HistoryPanel = () => {
  const history = useCalculatorStore((s) => s.history);
  const setExpression = useCalculatorStore((s) => s.setExpression);
  const deleteHistory = useCalculatorStore((s) => s.deleteHistory);

  return (
    <div className="history-panel">
      <h3>History</h3>
      <button
        onClick={() => deleteHistory()}
        style={{ margin: '10px', padding: '8px 16px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Delete All History
      </button>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            <span className="expr" onClick={() => setExpression(item.expression)}>{item.expression}</span>
            <span className="res">= {item.result}</span>
            <button onClick={() => deleteHistory(idx)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;
