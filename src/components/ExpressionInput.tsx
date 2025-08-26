import type { KeyboardEvent } from 'react';
import { useCalculatorStore } from '../store';

const ExpressionInput = () => {
  const expression = useCalculatorStore((s) => s.expression);
  const setExpression = useCalculatorStore((s) => s.setExpression);
  const setResult = useCalculatorStore((s) => s.setResult);
  const setError = useCalculatorStore((s) => s.setError);
  const resetError = useCalculatorStore((s) => s.resetError);
  const addHistory = useCalculatorStore((s) => s.addHistory);
  const variables = useCalculatorStore((s) => s.variables);
  const constants = useCalculatorStore((s) => s.constants);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      resetError();
      try {
        const ctx = {
          variables: Object.fromEntries(variables.map(v => [v.name, v.value])),
          constants,
        };
        import('../evaluator').then(({ evaluate }) => {
          const val = evaluate(expression, ctx);
          const fixed = val.toFixed(4);
          setResult(fixed);
          addHistory({ expression, result: fixed });
        }).catch(() => {
          setError('Evaluation error');
        });
      } catch (err: any) {
        setError(err.message || 'Error');
      }
    }
  };

  return (
    <input
      type="text"
      className="expression-input"
      value={expression}
      onChange={(e) => setExpression(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your expression..."
      autoFocus
    />
  );
};

export default ExpressionInput;
