// React import removed; automatic JSX runtime is used
import { useCalculatorStore } from '../store';

const OutputDisplay = () => {
  const result = useCalculatorStore((s) => s.result);
  const error = useCalculatorStore((s) => s.error);
  return (
    <div className="output-display">
      {error ? <span className="error">{error}</span> : <span className="result">{result}</span>}
    </div>
  );
};

export default OutputDisplay;
