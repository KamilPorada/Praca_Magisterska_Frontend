// components/MonthlyWeatherDataForm.tsx
import { data } from 'framer-motion/client';
import React, { useState } from 'react';

type City = {
  id: number;
  name: string;
};

type MonthlyWeatherDataFormProps = {
  cities: City[];
  onDataFetched: (data: any) => void;
};

const MonthlyWeatherDataForm: React.FC<MonthlyWeatherDataFormProps> = ({ cities, onDataFetched }) => {
  const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<number>(1);
  const [startYear, setStartYear] = useState<number>(1950); // Zmieniamy na 1950
  const [endMonth, setEndMonth] = useState<number>(12);
  const [endYear, setEndYear] = useState<number>(2024); // Zmieniamy na 2024

  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 1950 + i); // Generowanie lat od 1950 do 2024

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity || !startMonth || !startYear || !endMonth || !endYear) {
      alert('Please fill in all fields');
      return;
    }

    try {
        const response = await fetch(
          `http://localhost:8080/api/monthly-weather?cityId=${selectedCity}&startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        onDataFetched(data);  // Przekaż pobrane dane do komponentu nadrzędnego
      } catch (error) {
        console.error('Error fetching monthly weather data:', error);
      }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white text-black">
      <h2 className="text-xl font-semibold text-center mb-4">Wczytaj dane pogodowe analizując miesiąc po miesiącu</h2>
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
          <label htmlFor="start-month" className="block text-gray-700 font-semibold mb-2">
            Miesiąc początkowy
          </label>
          <select
            id="start-month"
            value={startMonth}
            onChange={(e) => setStartMonth(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value={1}>Styczeń</option>
            <option value={2}>Luty</option>
            <option value={3}>Marzec</option>
            <option value={4}>Kwiecień</option>
            <option value={5}>Maj</option>
            <option value={6}>Czerwiec</option>
            <option value={7}>Lipiec</option>
            <option value={8}>Sierpień</option>
            <option value={9}>Wrzesień</option>
            <option value={10}>Październik</option>
            <option value={11}>Listopad</option>
            <option value={12}>Grudzień</option>
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
          <label htmlFor="end-month" className="block text-gray-700 font-semibold mb-2">
            Miesiąc końcowy
          </label>
          <select
            id="end-month"
            value={endMonth}
            onChange={(e) => setEndMonth(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value={1}>Styczeń</option>
            <option value={2}>Luty</option>
            <option value={3}>Marzec</option>
            <option value={4}>Kwiecień</option>
            <option value={5}>Maj</option>
            <option value={6}>Czerwiec</option>
            <option value={7}>Lipiec</option>
            <option value={8}>Sierpień</option>
            <option value={9}>Wrzesień</option>
            <option value={10}>Październik</option>
            <option value={11}>Listopad</option>
            <option value={12}>Grudzień</option>
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

export default MonthlyWeatherDataForm;
