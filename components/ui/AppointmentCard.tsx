import React from 'react';
import { Appointment, Patient, AppointmentType } from '@/types';
import { format, differenceInMinutes } from 'date-fns';

interface AppointmentCardProps {
  appointment: Appointment;
  patient?: Patient;
  isWeekView?: boolean;
}


const appointmentColors: Record<AppointmentType, string> = {
  checkup: 'bg-blue-500',
  consultation: 'bg-green-500',
  'follow-up': 'bg-orange-500',
  procedure: 'bg-purple-500',
};

export default function AppointmentCard({ 
  appointment, 
  patient,
  isWeekView = false 
}: AppointmentCardProps) {
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const durationMinutes = differenceInMinutes(endTime, startTime);
  
  const colorClass = appointmentColors[appointment.type];
  
  return (
    <div 
      className={`${colorClass} text-white rounded-md p-2 shadow-sm mb-1 ${
        isWeekView ? 'text-xs' : 'text-sm'
      }`}
    >
      <div className="font-medium truncate">
        {patient?.name || 'Patient'}
      </div>
      <div className={`${isWeekView ? 'hidden sm:block' : ''}`}>
        {appointment.type}
      </div>
      <div className={`text-xs opacity-90 ${isWeekView ? 'hidden sm:block' : ''}`}>
        {durationMinutes} min
      </div>
    </div>
  );
}