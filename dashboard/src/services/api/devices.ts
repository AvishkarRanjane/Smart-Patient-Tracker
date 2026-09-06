// services/api/devices.ts
import type { Device } from '../../types/device';

/**
 * Service to manage medical equipment telemetry and control states
 */
export const deviceService = {
  calculateBatteryHealth(level: number): 'good' | 'warning' | 'critical' {
    if (level > 40) return 'good';
    if (level > 15) return 'warning';
    return 'critical';
  },

  formatFlowRate(flowLpm: number): string {
    return `${flowLpm.toFixed(1)} L/min`;
  },

  formatInfusionRate(rateMlh: number): string {
    return `${rateMlh.toFixed(1)} mL/hr`;
  },

  isDeviceCompromised(device: Device): boolean {
    return device.trust === 'compromised' || Boolean(device.advisory);
  },
};
