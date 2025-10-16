import React, { useMemo } from 'react';
import { format, differenceInMinutes } from 'date-fns';
import { TimeSlot } from '@/domain/TimeSlot';
import { Appointment } from '@/types';
import { getPatientById } from '@/data/mockData';

interface DayViewProps {
  date: Date;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  loading: boolean;
}

export default function DayView({ date, timeSlots, appointments, loading }: DayViewProps) {
  const formattedDate = useMemo(() => {
    return format(date, 'EEEE, MMMM d, yyyy');
  }, [date]);

  // Get appointments for the selected date only
  const todayAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  }, [appointments, date]);

  const getPatientNameById = (patientId: string): string => {
    try {
      const patient = getPatientById(patientId);
      return patient ? patient.name : 'Unknown Patient';
    } catch (error) {
      return 'Unknown Patient';
    }
  };

  // Get CSS class for appointment type
  const getAppointmentTypeClass = (type: string): string => {
    // Normalize the type to lowercase
    const normalizedType = type.toLowerCase();
    
    // Check for each possible type variation
    if (normalizedType.includes('follow')) return 'appointment-follow-up';
    if (normalizedType.includes('check')) return 'appointment-checkup';
    if (normalizedType.includes('consult')) return 'appointment-consultation';
    if (normalizedType.includes('procedure')) return 'appointment-procedure';
    if (normalizedType.includes('surgery')) return 'appointment-procedure';
    
    // Default to a generic class
    console.warn(`Unknown appointment type: ${type}`);
    return 'appointment-default';
  };

  return (
    <div className="calendar-container">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{formattedDate}</h2>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
        ) : (
          <div className="relative h-[calc(100vh-240px)] overflow-y-auto">
            {/* Time slots */}
            {timeSlots.map((slot, index) => {
              const slotStart = new Date(slot.start);
              const hourStr = format(slotStart, 'h:mm a');
              
              return (
                <div key={index} className="time-slot">
                  <div className="flex">
                    <div className="w-16 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      {hourStr}
                    </div>
                    <div className="time-slot-container flex-1 min-h-[60px] border-b border-gray-100 relative">
                      {/* Find appointments in this time slot */}
                      {todayAppointments.map(appointment => {
                        const apptStart = new Date(appointment.startTime);
                        const apptEnd = new Date(appointment.endTime);
                        
                        // Only show appointments that start in this time slot
                        if (
                          apptStart.getHours() === slotStart.getHours() && 
                          apptStart.getMinutes() === slotStart.getMinutes()
                        ) {
                          // Calculate duration in minutes
                          const durationMins = differenceInMinutes(apptEnd, apptStart);
                          
                          // Convert duration to pixels - use a scale factor (e.g., 2px per minute)
                          const heightInPixels = Math.max(durationMins * 2, 60); // Minimum 60px
                          
                          // Use the helper function to get the correct CSS class
                          const typeClass = getAppointmentTypeClass(appointment.type);
                          const patientName = getPatientNameById(appointment.patientId);
                          
                          // Debug information
                          console.log('Rendering appointment:', {
                            id: appointment.id,
                            patient: patientName,
                            type: appointment.type,
                            typeClass,
                            start: format(apptStart, 'h:mm a'),
                            end: format(apptEnd, 'h:mm a'),
                            duration: durationMins
                          });
                          
                          return (
                            <div
                              key={appointment.id}
                              className={`appointment ${typeClass}`}
                              style={{
                                height: `${heightInPixels}px`,
                                top: '0',
                                left: '0',
                                right: '0',
                                margin: '0 2px'
                              }}
                            >
                              <div className="font-bold truncate">{patientName}</div>
                              <div className="truncate">{appointment.type}</div>
                              <div className="text-xs opacity-80 truncate">
                                {format(apptStart, 'h:mm')} - {format(apptEnd, 'h:mm a')}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}