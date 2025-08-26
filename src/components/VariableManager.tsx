import { useState } from 'react';
import { useCalculatorStore } from '../store';

const reserved = ['pi', 'e'];

const VariableManager = () => {
  const variables = useCalculatorStore((s) => s.variables);
  const addVariable = useCalculatorStore((s) => s.addVariable);
  const deleteVariable = useCalculatorStore((s) => s.deleteVariable);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.match(/^[a-zA-Z_]\w*$/)) {
      setError('Invalid variable name');
      return;
    }
    if (reserved.includes(name)) {
      setError('Reserved name');
      return;
    }
    if (variables.some(v => v.name === name)) {
      setError('Variable exists');
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Invalid value');
      return;
    }
    addVariable({ name, value: num });
    setName('');
    setValue('');
    setError('');
  };

  return (
    <div className="variable-manager">
      <h3>Variables</h3>
      <div className="variable-manager-inputs">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <div className="variable-manager-input-row">
          <input value={value} onChange={e => setValue(e.target.value)} placeholder="Value" />
          <button className="add-btn" onClick={handleAdd}>Add</button>
        </div>
      </div>
      {error && <span className="error">{error}</span>}
      <ul>
        {variables.map(v => (
          <li key={v.name}>
            {v.name} = {v.value}
            <button className="delete-btn" onClick={() => deleteVariable(v.name)}>
              <span style={{fontWeight: 'bold'}}>✖</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VariableManager;
