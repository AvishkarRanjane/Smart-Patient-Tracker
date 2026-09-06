// services/api/ward.ts
import type { Ward, Bed, BedStatus } from '../../types/ward';

const WARDS_STORAGE_KEY = 'smart_patient_wards_v2';
const BEDS_STORAGE_KEY = 'smart_patient_beds_v2';

/**
 * Service to manage wards, bed capacities, and physical bed lifecycle states
 */
export const wardService = {
  getStoredWards(): Ward[] {
    try {
      const data = localStorage.getItem(WARDS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveStoredWards(wards: Ward[]): void {
    try {
      localStorage.setItem(WARDS_STORAGE_KEY, JSON.stringify(wards));
    } catch (e) {
      console.error('Failed to save wards:', e);
    }
  },

  getStoredBeds(): Bed[] {
    try {
      const data = localStorage.getItem(BEDS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveStoredBeds(beds: Bed[]): void {
    try {
      localStorage.setItem(BEDS_STORAGE_KEY, JSON.stringify(beds));
    } catch (e) {
      console.error('Failed to save beds:', e);
    }
  },

  calculateOccupancyRate(beds: Bed[]): number {
    if (beds.length === 0) return 0;
    const occupied = beds.filter((b) => b.status === 'occupied').length;
    return Math.round((occupied / beds.length) * 100);
  },

  getBedStatusCounts(beds: Bed[]): Record<BedStatus, number> {
    return {
      occupied: beds.filter((b) => b.status === 'occupied').length,
      available: beds.filter((b) => b.status === 'available').length,
      cleaning: beds.filter((b) => b.status === 'cleaning').length,
      maintenance: beds.filter((b) => b.status === 'maintenance').length,
    };
  },
};
