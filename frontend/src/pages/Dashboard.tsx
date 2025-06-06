import React, { useEffect, useState } from 'react';
import { ReportTable, Report } from '../components/ReportTable';
import { ReportTabs } from '../components/ReportTabs';
import { ExportButton } from '../components/ExportButton';
import { fetchReports } from '../services/exportService';

export const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('Viajes');

  useEffect(() => {
    fetchReports().then(setReports).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Reportes</h1>
      <ExportButton />
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Viajes' && <ReportTable reports={reports} />}
    </div>
  );
};
