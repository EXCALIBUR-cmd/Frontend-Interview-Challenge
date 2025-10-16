"use client";

import React from 'react';
import ScheduleView from '@/components/ScheduleView';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow py-4 px-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hospital Appointment Scheduler</h1>
      </header>
      
      <main className="container mx-auto px-4">
        <ScheduleView />
      </main>
    </div>
  );
}