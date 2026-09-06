// types/alert.ts
export type AlertSeverity  = 'critical' | 'watch' | 'info';
export type EscalationTier = 'tier1' | 'tier2' | 'escalated';

export interface Alert {
  id:          number;
  patientId:   number;
  severity:    AlertSeverity;
  text:        string;
  sub:         string;
  time:        number;   // Date.now()
  acked:       boolean;
  escalation:  EscalationTier;
  auditId:     string;   // immutable log reference
}
