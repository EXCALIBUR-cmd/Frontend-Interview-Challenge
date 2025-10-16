import React, { useEffect, useMemo, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { TimeSlot } from '@/domain/TimeSlot';
import { Appointment } from '@/types';
import { getPatientById } from '@/data/mockData';

interface WeekViewProps {
  weekDays: Date[];
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  loading: boolean;
  onAppointmentSelect?: (appointment: Appointment) => void;
  compact?: boolean;
}

export default function WeekView({ weekDays, timeSlots, appointments, loading, onAppointmentSelect }: WeekViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const earlyTimeSlots = useMemo(() => {
    return timeSlots.filter((_, index) => index % 2 === 0);
  }, [timeSlots]);

  // Get current time indicator position
  const getCurrentTimePosition = () => {
    const startOfDay = new Date(currentTime);
    startOfDay.setHours(8, 0, 0, 0);
    const diff = currentTime.getTime() - startOfDay.getTime();
    const minutesSince8AM = diff / (1000 * 60);
    
    // Return percentage of day (10 hours = 600 minutes)
    return (minutesSince8AM / 600) * 100;
  };
  
  const getPatientNameById = (patientId: string): string => {
    const patient = getPatientById(patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  return (
    <div className="calendar-container">
      {loading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-240px)]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Week header with days */}
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <div className="w-16 flex-shrink-0"></div>
              {weekDays.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div 
                    key={i} 
                    className={`flex-1 p-2 text-center ${isToday ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-300">{format(day, 'EEE')}</div>
                    <div className={`text-lg ${isToday ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week grid with time slots and appointments */}
            <div className="flex-1 overflow-y-auto">
              {earlyTimeSlots.map((slot, index) => (
                <div key={index} className="flex border-b border-gray-100">
                  <div className="w-16 flex-shrink-0 text-xs text-gray-500 p-2 border-r border-gray-100">
                    {format(slot.start, 'h:mm a')}
                  </div>
                  
                  {/* One column per day */}
                  {weekDays.map((day, dayIndex) => {
                    const isToday = isSameDay(day, new Date());
                    const showCurrentTime = isToday && 
                      currentTime.getHours() >= 8 && 
                      currentTime.getHours() < 18;
                    
                    // Get appointments for this day and time slot
                    const dayAppointments = appointments.filter(appointment => {
                      const appointmentDate = new Date(appointment.startTime);
                      const isSameDate = isSameDay(appointmentDate, day);
                      
                      if (!isSameDate) return false;
                      
                      // Check if the appointment overlaps with this hour
                      const appointmentStart = new Date(appointment.startTime);
                      const appointmentEnd = new Date(appointment.endTime);
                      
                      const hourStart = new Date(day);
                      hourStart.setHours(slot.start.getHours(), slot.start.getMinutes(), 0, 0);
                      
                      const hourEnd = new Date(day);
                      hourEnd.setHours(slot.start.getHours() + 1, slot.start.getMinutes(), 0, 0);
                      
                      return (appointmentStart < hourEnd && appointmentEnd > hourStart);
                    });
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`flex-1 min-h-[100px] relative ${isToday ? 'bg-blue-50/30' : ''}`}
                      >
                        {showCurrentTime && slot.start.getHours() === currentTime.getHours() && (
                          <div 
                            className="current-time-indicator" 
                            style={{ top: `${getCurrentTimePosition() % 100}%` }}
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                          </div>
                        )}
                        
                        {dayAppointments.map(appointment => {
                          const startTime = new Date(appointment.startTime);
                          const endTime = new Date(appointment.endTime);
                          
                          // Calculate top position and height based on start/end times
                          const slotStartMinutes = slot.start.getHours() * 60;
                          const apptStartMinutes = startTime.getHours() * 60 + startTime.getMinutes();
                          const apptEndMinutes = endTime.getHours() * 60 + endTime.getMinutes();
                          
                          const topOffset = Math.max(0, apptStartMinutes - slotStartMinutes);
                          const height = Math.min(100, (apptEndMinutes - Math.max(apptStartMinutes, slotStartMinutes)));
                          
                          const top = `${(topOffset / 60) * 100}%`;
                          const heightPct = `${(height / 60) * 100}%`;
                          
                          const typeClass = `appointment-${appointment.type.toLowerCase()}`;
                          const patientName = getPatientNameById(appointment.patientId);
                          
                          return (
                            <div
                              key={appointment.id}
                              className={`appointment ${typeClass} absolute left-0 right-0 mx-1`}
                              style={{
                                top,
                                height: heightPct,
                                zIndex: 5
                              }}
                              title={`${patientName} - ${appointment.type}`}
                              role="button"
                              tabIndex={0}
                              aria-label={`Appointment with ${patientName} for ${appointment.type} at ${format(startTime, 'h:mm a')}`}
                              onClick={() => onAppointmentSelect?.(appointment)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  onAppointmentSelect?.(appointment);
                                  e.preventDefault();
                                }
                              }}
                            >
                              <div className="text-[10px] font-semibold truncate">{patientName}</div>
                              <div className="text-[8px] truncate">{appointment.type}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}