Hospital Appointment Scheduler
A modern web application for managing doctor schedules and patient appointments with an intuitive calendar interface.

Features
-> Interactive Calendar Views: Day and Week views with time slot visualization
-> Doctor Selection: Filter appointments by doctor with specialty information
-> Dark Mode Support: System-preference detection with manual toggle option
-> Responsive Design: Mobile-friendly interface that adapts to all screen sizes
-> Current Time Indicator: Visual indicator showing the current time in schedule
-> Appointment Search/Filter: Search by patient name, appointment type, and date range
-> Multiple Doctor View: Side-by-side comparison of doctor schedules
-> Print-Friendly View: Optimized layout for printed schedules
-> Accessibility Improvements: ARIA labels, keyboard navigation, and color contrast compliance
Architecture Decisions
1. React + TypeScript + Tailwind CSS
2. I chose this tech stack for several reasons:

-> React: Component-based architecture allows for reusable UI elements and efficient rendering
-> TypeScript: Provides type safety, better IDE support, and catches errors during development
-> Tailwind CSS: Enables rapid UI development with utility classes and built-in dark mode support
2. Custom Hooks for Data Management
Rather than implementing a global state management solution like Redux, I used custom React hooks to:

-> Isolate data fetching logic from UI components
-> Enable reuse of appointment data across components
-> Simplify testing by decoupling data and presentation layers
3. Progressive Enhancement
-> I implemented core functionality first (calendar views, appointment display), then progressively added enhancements:

-> Dark mode for better accessibility and user preference
-> Search and filtering capabilities for larger datasets
-> Multiple doctor comparison views for more complex scheduling scenarios
4. Local Storage for User Preferences
-> I stored theme preferences in localStorage for a better user experience:

-> Persists user's preferred theme between sessions
-> Defaults to system preference when first visiting
-> No backend dependency for simple preference storage

Component Structure I followed
App
├── ScheduleView (Main container)
│   ├── DoctorSelector
│   ├── DateNavigation
│   │   └── ThemeToggle
│   ├── AppointmentSearch
│   └── CalendarView
│       ├── DayView
│       │   └── TimeSlots
│       │       └── Appointment
│       ├── WeekView
│       │   └── DayColumn
│       │       └── Appointment
│       └── MultiDoctorView
│           └── DoctorDayView
└── AppointmentDetails (Model)


Key Components:
-> ScheduleView: The main container component that orchestrates the application's state and renders child components.
-> DoctorSelector: Dropdown component for selecting doctors with specialties and working hours.
-> DayView/WeekView: Calendar visualizations showing time slots and appointments.
-> AppointmentSearch: Search and filter interface with expandable advanced filters.
-> ThemeToggle: Toggle switch for changing between light and dark modes.
-> AppointmentDetails: Modal component showing detailed appointment information.

Data Flow
-> useAppointments hook fetches and manages appointment data
-> Data is passed down to view components (DayView, WeekView)
-> User interactions (doctor selection, date navigation) update the state
-> Components re-render with new data based on state changes
-> User preferences (theme) are stored in localStorage
-> Trade-offs and Future Improvements
Given more time, these areas could be enhanced:

1. State Management
Implement more robust state management (Context API or Redux) for larger scale applications
Add caching layer to reduce redundant API calls
2. Performance Optimization
Implement virtualized lists for rendering large numbers of appointments
Add pagination for appointment data to handle larger datasets
Optimize rendering with React.memo() for frequently re-rendered components
3. Testing
Add comprehensive unit tests for all components
Implement integration tests for key user flows
Add end-to-end tests for critical paths
4. Features
Add appointment creation and editing functionality
Implement drag-and-drop for appointment rescheduling
Add recurring appointment support
Implement conflict detection for overlapping appointments
Add user authentication and role-based permissions
5. Accessibility
Conduct a thorough accessibility audit
Add more keyboard shortcuts for power users
Improve screen reader announcements for dynamic content

