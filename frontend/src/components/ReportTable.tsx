// ReportTable.tsx
export type Report = {
  vehicleName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
};

export const ReportTable: React.FC<{ reports: Report[] }> = ({ reports }) => (
  <div className="overflow-x-auto mt-4">
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2">Vehículo</th>
          <th className="p-2">Inicio</th>
          <th className="p-2">Destino</th>
          <th className="p-2">Distancia (km)</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((trip, index) => (
          <tr key={index} className="border-t">
            <td className="p-2">{trip.vehicleName}</td>
            <td className="p-2">{trip.startLocation}</td>
            <td className="p-2">{trip.endLocation}</td>
            <td className="p-2">{trip.distance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
