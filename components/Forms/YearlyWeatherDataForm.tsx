// components/YearlyWeatherDataForm.tsx
import React, { useState } from 'react';

type City = {
  id: number;
  name: string;
};

type YearlyWeatherDataFormProps = {
  cities: City[];
  onDataFetched: (data: any) => void;
};

const YearlyWeatherDataForm: React.FC<YearlyWeatherDataFormProps> = ({ cities, onDataFetched }) => {
  const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined);
  const [startYear, setStartYear] = useState<number>(1950); // Rok początkowy
  const [endYear, setEndYear] = useState<number>(2024); // Rok końcowy

  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 1950 + i); // Generowanie lat od 1950 do 2024

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity || !startYear || !endYear) {
      alert('Please fill in all fields');
      return;
    }

    try {
        const response = await fetch(
          `http://localhost:8080/api/yearly-weather?cityId=${selectedCity}&startYear=${startYear}&endYear=${endYear}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        onDataFetched(data);  // Przekaż pobrane dane do komponentu nadrzędnego
      } catch (error) {
        console.error('Error fetching yearly weather data:', error);
      }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white text-black">
      <h2 className="text-xl font-semibold text-center mb-4">Wczytaj dane pogodowe analizując rok po roku</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">
            Wybierz miasto
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Wybierz miasto
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="start-year" className="block text-gray-700 font-semibold mb-2">
            Rok początkowy
          </label>
          <select
            id="start-year"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="end-year" className="block text-gray-700 font-semibold mb-2">
            Rok końcowy
          </label>
          <select
            id="end-year"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Wyszukaj dane
        </button>
      </form>
    </div>
  );
};

export default YearlyWeatherDataForm;
