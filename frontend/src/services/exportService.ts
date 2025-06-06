export async function fetchReports() {
  const response = await fetch('http://localhost:3030/report/data');
  if (!response.ok) throw new Error('Error al obtener reportes');
  const data = await response.json();
  console.info('export',data)
  return data.trips || []; // solo devolver la lista de viajes para la tabla
}
