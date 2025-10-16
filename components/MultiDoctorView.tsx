import React, { useState } from 'react';
import { Doctor, Appointment } from '@/types';
import { useAppointments } from '@/hooks/useAppointments';
import { format, isEqual, isAfter, isBefore } from 'date-fns';
import DayView from './DayView';
import { TimeSlot as DomainTimeSlot } from '@/domain/TimeSlot';

interface MultiDoctorViewProps {
  doctors: Doctor[];
  date: Date;
}

export default function MultiDoctorView({ doctors, date }: MultiDoctorViewProps) {
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(
    doctors.length > 0 ? [doctors[0].id] : []
  );

  const toggleDoctor = (doctorId: string) => {
    setSelectedDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Select Doctors to Compare</h2>
        <div className="flex flex-wrap gap-2">
          {doctors.map(doctor => (
            <button
              key={doctor.id}
              onClick={() => toggleDoctor(doctor.id)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedDoctors.includes(doctor.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              Dr. {doctor.name}
              {selectedDoctors.includes(doctor.id) && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedDoctors.map(doctorId => (
          <DoctorDayView key={doctorId} doctorId={doctorId} date={date} />
        ))}
      </div>
    </div>
  );
}

function DoctorDayView({ doctorId, date }: { doctorId: string; date: Date }) {
  const {
    loading,
    error,
    appointments,
    timeSlots,
    selectedDoctor
  } = useAppointments({
    doctorId,
    selectedDate: date,
    viewMode: 'day'
  });

  if (!selectedDoctor) {
    return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">Loading doctor data...</div>;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3 className="font-medium">Dr. {selectedDoctor.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDoctor.specialty}</p>
      </div>
      <DayView
        date={date}
        timeSlots={timeSlots.map(slot => ({
          ...slot,
          contains: (date: Date) => (
            (isEqual(date, slot.start) || isAfter(date, slot.start)) && 
            (isEqual(date, slot.end) || isBefore(date, slot.end))
          ),
          overlaps: (otherSlot: DomainTimeSlot) => (
            isEqual(slot.start, otherSlot.end) || 
            isBefore(slot.start, otherSlot.end) && 
            isEqual(slot.end, otherSlot.start) || 
            isAfter(slot.end, otherSlot.start)
          )
        }))}
        appointments={appointments}
        loading={loading}
      />
      
      {error && (
        <div className="p-2 text-center text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}