import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Variable = {
  name: string;
  value: number;
};

type HistoryItem = {
  expression: string;
  result: string;
};

interface CalculatorState {
  expression: string;
  result: string;
  error: string;
  history: HistoryItem[];
  variables: Variable[];
  constants: Record<string, number>;
  setExpression: (expr: string) => void;
  setResult: (res: string) => void;
  setError: (err: string) => void;
  addHistory: (item: HistoryItem) => void;
  deleteHistory: (index?: number) => void;
  addVariable: (variable: Variable) => void;
  deleteVariable: (name: string) => void;
  resetError: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      expression: '',
      result: '',
      error: '',
      history: [],
      variables: [],
      constants: {
        pi: 3.1415,
        e: 2.7182,
      },
      setExpression: (expr) => set({ expression: expr }),
      setResult: (res) => set({ result: res }),
      setError: (err) => set({ error: err }),
      addHistory: (item) => set({ history: [...get().history, item] }),
      deleteHistory: (index?: number) => set((state) => {
        if (typeof index === 'number') {
          return { history: state.history.filter((_, i) => i !== index) };
        } else {
          return { history: [] };
        }
      }),
      addVariable: (variable) => set({ variables: [...get().variables, variable] }),
      deleteVariable: (name) => set({ variables: get().variables.filter(v => v.name !== name) }),
      resetError: () => set({ error: '' }),
    }),
    { name: 'calculator-storage' }
  )
);
