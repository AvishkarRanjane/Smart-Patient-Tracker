// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole, Permission } from '../types/auth';
import { ROLE_PERMISSIONS } from '../types/auth';
import { showToast } from '../components/ui/Toast.tsx';

const AUTH_STORAGE_KEY = 'smart_patient_auth_session_v2';

export const DOCTOR_USER: User = {
  id: 'usr-doc-1',
  name: 'Doctor 1',
  role: 'doctor',
  roleTitle: 'Chief ICU Specialist',
  shift: 'Day Shift (08:00 AM – 08:00 PM)',
  initials: 'D1',
  permissions: ROLE_PERMISSIONS.doctor,
};

export const STAFF_USER: User = {
  id: 'usr-staff-1',
  name: 'Staff 1',
  role: 'staff',
  roleTitle: 'Senior Duty Nurse',
  shift: 'Day Shift (08:00 AM – 08:00 PM)',
  initials: 'S1',
  permissions: ROLE_PERMISSIONS.staff,
};

export function getFamilyUser(patientId: number, patientName: string): User {
  return {
    id: `usr-fam-${patientId}`,
    name: `Family of ${patientName}`,
    role: 'family',
    roleTitle: 'Dedicated Family Member',
    shift: 'Visiting Hours Access',
    initials: `P${patientId + 1}`,
    patientId,
    permissions: ROLE_PERMISSIONS.family,
  };
}

interface AuthCtx {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
  login: (role: UserRole, patientId?: number) => void;
  loginWithCredentials: (
    role: UserRole,
    credential: string,
    pass: string,
    patientId?: number
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  user: DOCTOR_USER,
  hasPermission: () => true,
  login: () => {},
  loginWithCredentials: () => ({ success: true }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to initial DOCTOR_USER
    }
    return DOCTOR_USER;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore storage error
    }
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const login = (role: UserRole, patientId = 0) => {
    if (role === 'doctor') {
      setUser(DOCTOR_USER);
      showToast('Signed in as Doctor 1 (Chief ICU Specialist)');
    } else if (role === 'staff') {
      setUser(STAFF_USER);
      showToast('Signed in as Staff 1 (Senior Duty Nurse)');
    } else {
      const pName = `Person ${patientId + 1}`;
      setUser(getFamilyUser(patientId, pName));
      showToast(`Signed in to Family Portal for ${pName}`);
    }
  };

  const loginWithCredentials = (
    role: UserRole,
    credential: string,
    pass: string,
    patientId = 0
  ): { success: boolean; error?: string } => {
    const credTrim = credential.trim().toLowerCase();
    const passTrim = pass.trim();

    if (role === 'doctor') {
      if (
        (credTrim === 'doctor' || credTrim === 'doc1' || credTrim === 'doctor1') &&
        (passTrim === 'doctor123' || passTrim === 'admin')
      ) {
        setUser(DOCTOR_USER);
        showToast('Authenticated successfully as Doctor 1');
        return { success: true };
      }
      return { success: false, error: 'Invalid Doctor ID or password. (Hint: doctor / doctor123)' };
    }

    if (role === 'staff') {
      if (
        (credTrim === 'staff' || credTrim === 'nurse1' || credTrim === 'staff1') &&
        (passTrim === 'staff123' || passTrim === 'nurse')
      ) {
        setUser(STAFF_USER);
        showToast('Authenticated successfully as Staff 1');
        return { success: true };
      }
      return { success: false, error: 'Invalid Staff ID or PIN. (Hint: staff / staff123)' };
    }

    if (role === 'family') {
      if (passTrim === 'family123' || passTrim === '1234') {
        const pName = `Person ${patientId + 1}`;
        setUser(getFamilyUser(patientId, pName));
        showToast(`Family Portal unlocked for ${pName}`);
        return { success: true };
      }
      return { success: false, error: 'Invalid Family Security PIN. (Hint: family123)' };
    }

    return { success: false, error: 'Invalid login details.' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, hasPermission, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
export type { UserRole, Permission, User };
