import React from 'react';

export const ExportButton: React.FC = () => {
  const handleExport = async () => {
    const res = await fetch('http://localhost:3030/export/pdf', { method: 'GET' });
    const data = await res.json();
    alert(`Export job submitted. Job ID: ${data.jobId}`);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Exportar PDF
    </button>
  );
};
