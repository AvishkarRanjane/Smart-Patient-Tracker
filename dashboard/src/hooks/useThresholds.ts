// hooks/useThresholds.ts
import { useState, useCallback } from 'react';
import type { Thresholds } from '../types/threshold';
import { DEFAULT_THRESHOLDS } from '../utils/constants';

export function useThresholds() {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

  const update = useCallback((next: Thresholds) => {
    setThresholds(next);
    // In production: PUT /api/thresholds — writes to the Alarm Reduction Subsystem
  }, []);

  return { thresholds, update };
}
