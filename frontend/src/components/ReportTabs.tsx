import React from 'react';

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const ReportTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {['Resumen', 'Viajes'].map(tab => (
        <button
          key={tab}
          className={`px-4 py-2 rounded ${
            activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
