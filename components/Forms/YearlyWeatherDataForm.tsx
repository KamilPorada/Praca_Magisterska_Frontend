import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';

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
  const [startYear, setStartYear] = useState<number>(1950);
  const [endYear, setEndYear] = useState<number>(2024);
  const [cityName, setCityName] = useState<string>('');
  const [dataFetched, setDataFetched] = useState<boolean>(false); // New state to track if data is fetched

  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 1950 + i);

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
      onDataFetched(data);

      // Mark data as fetched after successful fetch
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching yearly weather data:', error);
    }
  };

  useEffect(() => {
    if (cities.length > 0) {
      setSelectedCity(cities[0].id);
      setCityName(cities[0].name);
    }
  }, [cities]);

  useEffect(() => {
    const city = cities.find((city) => city.id === selectedCity);
    if (city) {
      setCityName(city.name);
    }
  }, [selectedCity, cities]);

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="city" className="block text-white font-semibold mb-2">
            Wybierz miasto
          </label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
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
          <label htmlFor="start-year" className="block text-white font-semibold mb-2">
            Rok początkowy
          </label>
          <select
            id="start-year"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="end-year" className="block text-white font-semibold mb-2">
            Rok końcowy
          </label>
          <select
            id="end-year"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Button className='w-full mt-2'>Wczytaj dane </Button>

      </form>

      {/* Show message only after the data is fetched */}
      {dataFetched && selectedCity && startYear && endYear && (
        <p className="mt-16 text-center text-white text-base sm:text-xl">
          Dane pogodowe dla miasta {cityName} z lat {startYear} - {endYear}
        </p>
      )}
    </div>
  );
};

export default YearlyWeatherDataForm;
