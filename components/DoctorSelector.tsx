import React from 'react';
import { Doctor } from '@/types';

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedDoctor?: Doctor;
  onSelectDoctor: (doctor: Doctor) => void;
}

export default function DoctorSelector({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}: DoctorSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="doctor-select" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Select Doctor
      </label>
      <select
        id="doctor-select"
        className="block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1 sm:py-2 text-sm 
                  bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-white 
                  border-gray-300 dark:border-gray-700 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                  rounded-md"
        value={selectedDoctor?.id || ''}
        onChange={(e) => {
          const doctor = doctors.find(d => d.id === e.target.value);
          if (doctor) {
            onSelectDoctor(doctor);
          }
        }}
      >
        {doctors.map((doctor) => (
          <option 
            key={doctor.id} 
            value={doctor.id}
            className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          >
            Dr. {doctor.name} - {doctor.specialty}
          </option>
        ))}
      </select>
    </div>
  );
}