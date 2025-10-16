import { useState, useEffect, useMemo } from "react";
import { Doctor, Appointment } from "@/types";
import { appointmentService } from "@/services/appointmentService";
import { startOfDay, addDays, format, addMinutes } from "date-fns";
export interface UseAppointmentsProps {
  doctorId?: string;
  selectedDate: Date;
  viewMode: 'day' | 'week';
}

export function useAppointments({ doctorId, selectedDate, viewMode }: UseAppointmentsProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>(undefined);

  // Generate time slots for the day view (8:00 AM to 6:00 PM in 30-minute intervals)
  const timeSlots = useMemo(() => {
    const slots: TimeSlot[] = [];
    const baseDate = startOfDay(selectedDate);
    
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const start = new Date(baseDate);
        start.setHours(hour, minute, 0, 0);
        const end = addMinutes(start, 30);
        slots.push(new TimeSlot(start, end));
      }
    }
    
    return slots;
  }, [selectedDate]);

  // Generate days for the week view
  const weekDays = useMemo(() => {
    const days = [];
    const { start: weekStart } = appointmentService.getWeekRange(selectedDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(weekStart), i));
    }
    
    return days;
  }, [selectedDate]);

  // Load all doctors
  useEffect(() => {
    try {
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
      
      // If doctorId is provided, set the selected doctor
      if (doctorId) {
        const doctor = appointmentService.getDoctorById(doctorId);
        setSelectedDoctor(doctor);
      } else if (allDoctors.length > 0) {
        // Default to the first doctor if none is specified
        setSelectedDoctor(allDoctors[0]);
      }
    } catch (err) {
      setError("Failed to load doctors");
      console.error(err);
    }
  }, [doctorId]);

  // Load appointments when selected doctor or date changes
  useEffect(() => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    try {
      let appointments: Appointment[] = [];
      
      if (viewMode === 'day') {
        appointments = appointmentService.getAppointmentsByDoctorAndDate(
          selectedDoctor.id,
          selectedDate
        );
      } else {
        // Week view - get appointments for the entire week
        const { start, end } = appointmentService.getWeekRange(selectedDate);
        appointments = appointmentService.getAppointmentsByDoctorAndDateRange(
          selectedDoctor.id,
          start,
          end
        );
      }
      
      setAppointments(appointments);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
      setLoading(false);
    }
  }, [selectedDoctor, selectedDate, viewMode]);

  // Format date range for display in week view
  const formattedDateRange = useMemo(() => {
    if (weekDays.length === 0) return '';
    
    const startStr = format(weekDays[0], 'MMM d');
    const endStr = format(weekDays[6], 'MMM d, yyyy');
    
    return `${startStr} - ${endStr}`;
  }, [weekDays]);

  return {
    loading,
    error,
    appointments,
    timeSlots,
    weekDays,
    doctors,
    selectedDoctor,
    setSelectedDoctor,
    formattedDateRange
  };
}

/**
 * Custom hook for working with a specific appointment
 */
export function useAppointmentDetails(appointmentId: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [appointmentData, setAppointmentData] = useState<{
    appointment: Appointment;
    doctor?: Doctor;
    patient?: any;
  } | null>(null);

  useEffect(() => {
    try {
      const appointments = appointmentService.getAllDoctors().flatMap(doctor => 
        appointmentService.getAppointmentsByDoctor(doctor.id)
      );
      
      const appointment = appointments.find(apt => apt.id === appointmentId);
      
      if (!appointment) {
        setError("Appointment not found");
        setLoading(false);
        return;
      }
      
      const populatedData = appointmentService.getPopulatedAppointment(appointment);
      setAppointmentData(populatedData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appointment details");
      console.error(err);
      setLoading(false);
    }
  }, [appointmentId]);

  return { loading, error, ...appointmentData };
  return { loading, error, ...appointmentData };
}

/**
 * Represents a time slot with start and end times
 */
export class TimeSlot {
  constructor(public start: Date, public end: Date) {}
  
  toString(): string {
    return `${this.start.toLocaleTimeString()} - ${this.end.toLocaleTimeString()}`;
  }
  
  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && this.end > other.start;
  }
}