import { 
  MOCK_DOCTORS as mockDoctors, 
  MOCK_APPOINTMENTS as mockAppointments, 
  MOCK_PATIENTS as mockPatients,
  getDoctorById,
  getPatientById,
  getAppointmentsByDoctor,
  getAppointmentsByDoctorAndDate,
  getAppointmentsByDoctorAndDateRange
} from '@/data/mockData';

// Create an appointment service with methods to access the mock data
export const appointmentService = {
  getAllDoctors() {
    return mockDoctors;
  },
  
  getDoctorById(doctorId: string) {
    const doctor = mockDoctors.find(doc => doc.id === doctorId);
    if (!doctor) {
      throw new Error(`Doctor with ID ${doctorId} not found`);
    }
    return doctor;
  },
  
  getAppointmentsByDoctor(doctorId: string) {
    return getAppointmentsByDoctor(doctorId);
  },
  
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date) {
    return getAppointmentsByDoctorAndDate(doctorId, date);
  },
  
  getAppointmentsByDoctorAndDateRange(doctorId: string, startDate: Date, endDate: Date) {
    return getAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate);
  },
  
  getWeekRange(date: Date) {
    // Get the start of the week (Monday)
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    
    // Get the end of the week (Sunday)
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  },
  
  getPopulatedAppointment(appointment: any) {
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);
    
    return {
      appointment,
      doctor,
      patient
    };
  }
};