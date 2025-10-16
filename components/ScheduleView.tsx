import { useState, useMemo } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { addDays, subDays, format } from 'date-fns';
import DoctorSelector from './DoctorSelector';
import DayView from './DayView';
import WeekView from './WeekView';
import { TimeSlot as DomainTimeSlot } from '@/domain/TimeSlot';
import { Appointment as DomainAppointment } from '@/domain/Appointment';
import ThemeToggle from './ThemeToggle';

interface ScheduleViewProps {
  initialDoctorId?: string;
  initialDate?: Date;
  initialViewMode?: 'day' | 'week';
}

export default function ScheduleView({
  initialDoctorId,
  initialDate = new Date(),
  initialViewMode = 'day'
}: ScheduleViewProps) {
  // State for selected date and view mode
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [viewMode, setViewMode] = useState<'day' | 'week'>(initialViewMode);
  
  // Use our custom hook to get appointment data
  const {
    loading,
    error,
    appointments,
    timeSlots,
    weekDays,
    doctors,
    selectedDoctor,
    setSelectedDoctor,
    formattedDateRange
  } = useAppointments({
    doctorId: initialDoctorId,
    selectedDate,
    viewMode
  });

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === 'day') {
      setSelectedDate(prev => subDays(prev, 1));
    } else {
      setSelectedDate(prev => subDays(prev, 7));
    }
  };

  const goToNext = () => {
    if (viewMode === 'day') {
      setSelectedDate(prev => addDays(prev, 1));
    } else {
      setSelectedDate(prev => addDays(prev, 7));
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'day' ? 'week' : 'day');
  };

  // Helper function to safely display working hours
  const formatWorkingHours = (workingHours: any) => {
    if (!workingHours) return 'Not available';
    
    try {
      // Format the working hours in a more readable way
      return Object.entries(workingHours)
        .map(([day, hours]: [string, any]) => 
          `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.start} - ${hours.end}`
        )
        .join(', ');
    } catch (e) {
      return JSON.stringify(workingHours);
    }
  };
  
  // Convert hook's TimeSlots to domain TimeSlots
  const domainTimeSlots = useMemo(() => {
    if (!timeSlots) return [];
    return timeSlots.map(slot => new DomainTimeSlot(slot.start, slot.end));
  }, [timeSlots]);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white dark:bg-gray-900">
      {/* Main title - force white text in dark mode */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Hospital Appointment Scheduler
      </h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Doctor information & selector - with dark mode text colors */}
      {selectedDoctor && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Dr. {selectedDoctor.name} - {selectedDoctor.specialty}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Working hours: {formatWorkingHours(selectedDoctor.workingHours)}
          </p>
        </div>
      )}
      
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <DoctorSelector
          doctors={doctors}
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
        />
        
        {/* Calendar controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-700 dark:text-gray-200"
          >
            &larr;
          </button>
          <button
            onClick={goToToday}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-gray-200"
          >
            Today
          </button>
          <button
            onClick={goToNext}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-700 dark:text-gray-200"
          >
            &rarr;
          </button>
          
          <div className="ml-2 font-medium text-gray-900 dark:text-gray-100">
            {viewMode === 'day' 
              ? format(selectedDate, 'MMMM d, yyyy') 
              : formattedDateRange || ''}
          </div>
          
          {/* Add theme toggle */}
          <ThemeToggle />
          
          <button
            onClick={toggleViewMode}
            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2"
          >
            {viewMode === 'day' ? 'Week View' : 'Day View'}
          </button>
        </div>
      </div>
      
      {/* Calendar view */}
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : viewMode === 'day' ? (
          <DayView
            date={selectedDate}
            timeSlots={domainTimeSlots}
            appointments={appointments || []}
            loading={loading}
          />
        ) : (
          <WeekView
            weekDays={weekDays || []}
            timeSlots={domainTimeSlots}
            appointments={appointments || []}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

interface DayViewProps {
  date: Date;
  timeSlots: DomainTimeSlot[];
  appointments: DomainAppointment[];
  loading: boolean;
  onAppointmentSelect: (appointment: DomainAppointment) => void;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}