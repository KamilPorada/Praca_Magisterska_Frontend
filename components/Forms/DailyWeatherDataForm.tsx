import React, { useState } from 'react';

type City = {
  id: number;
  name: string;
};

type DailyWeatherDataFormProps = {
  cities: City[];
  onDataFetched: (data: any) => void;
};

const DailyWeatherDataForm: React.FC<DailyWeatherDataFormProps> = ({ cities, onDataFetched }) => {
  const [selectedCity, setSelectedCity] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCity || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
        const response = await fetch(
          `http://localhost:8080/api/daily-weather?cityId=${selectedCity}&startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        onDataFetched(data);  // Przekaż pobrane dane do komponentu nadrzędnego
      } catch (error) {
        console.error('Error fetching daily weather data:', error);
      }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white text-black">
      <h2 className="text-xl font-semibold text-center mb-4">Wczytaj dane pogodowe analizując dzień po dniu</h2>
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
          <label htmlFor="start-date" className="block text-gray-700 font-semibold mb-2">
            Data początkowa
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="end-date" className="block text-gray-700 font-semibold mb-2">
            Data końcowa
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
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

export default DailyWeatherDataForm;
