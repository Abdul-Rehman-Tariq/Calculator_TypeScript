// React import removed; automatic JSX runtime is used
import { useCalculatorStore } from '../store';

const buttons = [
  '7','8','9','/','sqrt(',
  '4','5','6','*','^',
  '1','2','3','-','(',
  '0','.','+','pi',')',
  'sin(','cos(','tan(','e','Clear',
  'Del','='
];

const ButtonPanel = () => {
  const expression = useCalculatorStore((s) => s.expression);
  const setExpression = useCalculatorStore((s) => s.setExpression);
  const setResult = useCalculatorStore((s) => s.setResult);
  const setError = useCalculatorStore((s) => s.setError);
  const resetError = useCalculatorStore((s) => s.resetError);
  const addHistory = useCalculatorStore((s) => s.addHistory);
  const variables = useCalculatorStore((s) => s.variables);
  const constants = useCalculatorStore((s) => s.constants);

  const handleClick = (btn: string) => {
    resetError();
    if (btn === 'Clear') setExpression('');
    else if (btn === 'Del') setExpression(expression.slice(0, -1));
    else if (btn === '=') {
      try {
        // Build context for evaluator
        const ctx = {
          variables: Object.fromEntries(variables.map(v => [v.name, v.value])),
          constants,
        };
        // Dynamic import to avoid circular dependency
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
    } else {
      setExpression(expression + btn);
    }
  };

  const getClass = (btn: string) => {
    if (btn === '=') return 'btn equals';
    if (btn === 'Clear' || btn === 'Del') return 'btn control';
    if (['+', '-', '*', '/', '^', 'pi', 'e', ')', '('].includes(btn)) return 'btn operator';
    if (btn.startsWith('sin') || btn.startsWith('cos') || btn.startsWith('tan') || btn.startsWith('sqrt')) return 'btn func';
    return 'btn number';
  };

  return (
    <div className="button-panel">
      {buttons.map((btn) => (
        <button key={btn} className={getClass(btn)} onClick={() => handleClick(btn)}>{btn}</button>
      ))}
    </div>
  );
};

export default ButtonPanel;
