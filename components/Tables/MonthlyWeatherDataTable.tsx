import React from 'react';

interface MonthlyWeatherData {
  id: number;
  year: number;
  month: number;
  maxTemperature: number;
  minTemperature: number;
  maxFeelsLikeTemperature: number;
  minFeelsLikeTemperature: number;
  dailySunshine: number;
  dailyLightHours: number;
  maxWindSpeed: number;
  windGusts: number;
  totalPrecipitation: number;
  rain: number;
  snow: number;
  precipitationTime: number;
  totalSolarRadiation: number;
  evapotranspiration: number;
}

interface MonthlyWeatherDataTableProps {
  monthlyData: MonthlyWeatherData[];
}

const MonthlyWeatherDataTable: React.FC<MonthlyWeatherDataTableProps> = ({ monthlyData }) => {
  // Funkcja do uzyskania nazwy miesiąca w języku polskim
  const getMonthName = (month: number) => {
    const months = [
      'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 
      'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    return months[month - 1];
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">Dane pogodowe miesięczne</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-sm text-left text-gray-800">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Rok</th>
              <th className="px-4 py-2 border-b">Miesiąc</th>
              <th className="px-4 py-2 border-b">Maksymalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Minimalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Maksymalna odczuwalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Minimalna odczuwalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Nasłonecznienie dzienne (godz.)</th>
              <th className="px-4 py-2 border-b">Światło dzienne (godz.)</th>
              <th className="px-4 py-2 border-b">Maksymalna prędkość wiatru (km/h)</th>
              <th className="px-4 py-2 border-b">Porywy wiatru (km/h)</th>
              <th className="px-4 py-2 border-b">Całkowite opady (mm)</th>
              <th className="px-4 py-2 border-b">Deszcz (mm)</th>
              <th className="px-4 py-2 border-b">Śnieg (mm)</th>
              <th className="px-4 py-2 border-b">Czas opadów (godz.)</th>
              <th className="px-4 py-2 border-b">Promieniowanie słoneczne (MJ/m²)</th>
              <th className="px-4 py-2 border-b">Ewapotranspiracja (mm)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((data) => (
              <tr key={data.id} className="odd:bg-gray-50 even:bg-gray-100">
                <td className="px-4 py-2 border-b">{data.year}</td>
                <td className="px-4 py-2 border-b">{getMonthName(data.month)}</td>
                <td className="px-4 py-2 border-b">{data.maxTemperature}</td>
                <td className="px-4 py-2 border-b">{data.minTemperature}</td>
                <td className="px-4 py-2 border-b">{data.maxFeelsLikeTemperature}</td>
                <td className="px-4 py-2 border-b">{data.minFeelsLikeTemperature}</td>
                <td className="px-4 py-2 border-b">{data.dailySunshine}</td>
                <td className="px-4 py-2 border-b">{data.dailyLightHours}</td>
                <td className="px-4 py-2 border-b">{data.maxWindSpeed}</td>
                <td className="px-4 py-2 border-b">{data.windGusts}</td>
                <td className="px-4 py-2 border-b">{data.totalPrecipitation}</td>
                <td className="px-4 py-2 border-b">{data.rain}</td>
                <td className="px-4 py-2 border-b">{data.snow}</td>
                <td className="px-4 py-2 border-b">{data.precipitationTime}</td>
                <td className="px-4 py-2 border-b">{data.totalSolarRadiation}</td>
                <td className="px-4 py-2 border-b">{data.evapotranspiration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyWeatherDataTable;
