import React from 'react';

interface YearlyWeatherData {
  id: number;
  year: number;
  maxTemperature: number;
  minTemperature: number;
  maxFeelsLikeTemperature: number;
  minFeelsLikeTemperature: number;
  maxWindSpeed: number;
  windGusts: number;
  totalPrecipitation: number;
  rain: number;
  snow: number;
  precipitationTime: number;
  dominantWindDirection: number;
}

interface YearlyWeatherDataTableProps {
  yearlyData: YearlyWeatherData[];
}

const YearlyWeatherDataTable: React.FC<YearlyWeatherDataTableProps> = ({ yearlyData }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">Dane pogodowe roczne</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white text-sm text-left text-gray-800">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Rok</th>
              <th className="px-4 py-2 border-b">Maksymalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Minimalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Maksymalna odczuwalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Minimalna odczuwalna temperatura (°C)</th>
              <th className="px-4 py-2 border-b">Maksymalna prędkość wiatru (km/h)</th>
              <th className="px-4 py-2 border-b">Porywy wiatru (km/h)</th>
              <th className="px-4 py-2 border-b">Całkowite opady (mm)</th>
              <th className="px-4 py-2 border-b">Deszcz (mm)</th>
              <th className="px-4 py-2 border-b">Śnieg (mm)</th>
              <th className="px-4 py-2 border-b">Czas opadów (godz.)</th>
              <th className="px-4 py-2 border-b">Dominujący kierunek wiatru (°)</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((data) => (
              <tr key={data.id} className="odd:bg-gray-50 even:bg-gray-100">
                <td className="px-4 py-2 border-b">{data.year}</td>
                <td className="px-4 py-2 border-b">{data.maxTemperature}</td>
                <td className="px-4 py-2 border-b">{data.minTemperature}</td>
                <td className="px-4 py-2 border-b">{data.maxFeelsLikeTemperature}</td>
                <td className="px-4 py-2 border-b">{data.minFeelsLikeTemperature}</td>
                <td className="px-4 py-2 border-b">{data.maxWindSpeed}</td>
                <td className="px-4 py-2 border-b">{data.windGusts}</td>
                <td className="px-4 py-2 border-b">{data.totalPrecipitation}</td>
                <td className="px-4 py-2 border-b">{data.rain}</td>
                <td className="px-4 py-2 border-b">{data.snow}</td>
                <td className="px-4 py-2 border-b">{data.precipitationTime}</td>
                <td className="px-4 py-2 border-b">{data.dominantWindDirection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YearlyWeatherDataTable;
