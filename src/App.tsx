// React import removed; automatic JSX runtime is used
import ExpressionInput from './components/ExpressionInput';
import OutputDisplay from './components/OutputDisplay';
import ButtonPanel from './components/ButtonPanel';
import VariableManager from './components/VariableManager';
import HistoryPanel from './components/HistoryPanel';
import './App.css';

function App() {

  return (
    <div className="calculator-main-layout">
      <header className="calculator-header">
        <h1>Scientific Calculator</h1>
        
      </header>
      <main className="calculator-content">
        <section className="calculator-left">
          <ExpressionInput />
          <OutputDisplay />
          <ButtonPanel />
        </section>
        <aside className="calculator-right">
          <VariableManager />
          <HistoryPanel />
        </aside>
      </main>
    </div>
  );
}

export default App
