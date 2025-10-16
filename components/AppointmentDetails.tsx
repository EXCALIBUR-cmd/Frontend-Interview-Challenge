import React from 'react';
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { getPatientById } from '@/data/mockData';

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
}

export default function AppointmentDetails({ appointment, onClose }: AppointmentDetailsProps) {
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const patient = getPatientById(appointment.patientId);
  
  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-title"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 
          id="appointment-title"
          className="text-lg font-bold mb-4"
        >
          Appointment Details
        </h2>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Patient</h3>
            <p className="font-medium">{patient?.name || 'Unknown Patient'}</p>
            {patient && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                DOB: {patient.dateOfBirth}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointment Type</h3>
            <p className="font-medium">{appointment.type}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h3>
            <p className="font-medium">
              {format(startTime, 'MMMM d, yyyy')} <br />
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </p>
          </div>
          
          {appointment.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            autoFocus
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}