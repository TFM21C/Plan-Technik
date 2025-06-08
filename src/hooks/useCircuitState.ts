import { useState } from 'react';
import { CircuitState } from '../types/circuit';

/**
 * Einfacher Hook, der den CircuitState verwaltet.
 */
export const useCircuitState = () => {
  const [state, setState] = useState<CircuitState>({
    components: {},
    connections: {},
  });

  return { state, setState };
};
