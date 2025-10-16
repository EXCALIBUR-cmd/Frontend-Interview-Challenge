import { TimeSlot } from './TimeSlot';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  timeSlot?: TimeSlot;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show'
}