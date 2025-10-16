import React from 'react';

export default function PrintButton() {
  const handlePrint = () => {
    // You could add some preparation logic here if needed
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="print:hidden ml-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md px-3 py-2 flex items-center gap-1"
      aria-label="Print schedule"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
      </svg>
      Print
    </button>
  );
}