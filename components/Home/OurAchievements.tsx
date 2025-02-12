import { 
    FaCalendar, 
    FaCity, 
    FaGlobe, 
    FaChartLine, 
    FaFilter, 
    FaTemperatureHigh, 
    FaDatabase 
  } from 'react-icons/fa';

  import { 
 
    FaArrowTrendUp, 

  } from 'react-icons/fa6';
  
  import Achievement from './Acheviement';
  import SectionTitle from '../UI/SectionTitle';
  
  const achievements = [
    { icon: <FaDatabase />, title: 'Dane historyczne', description: 'Dostęp do danych pogodowych obejmujących aż 75 lat historii.' },
    { icon: <FaCity />, title: '80 miast', description: 'Analiza meteorologiczna dla największych polskich miast przez dekady badań i doświadczeń.' },
    { icon: <FaGlobe />, title: 'Dane dla Polski', description: 'Kompleksowe informacje o zmieniającym się klimacie w różnych regionach naszego kraju.' },
    { icon: <FaCalendar />, title: 'Przegląd danych', description: 'Filtrowanie danych pogodowych według określonych przedziałów czasowych analizy.' },
    { icon: <FaChartLine />, title: 'Wykresy i analizy', description: 'Zaawansowana wizualizacja pozwalająca na lepsze zrozumienie trendów pogodowych.' },
    { icon: <FaFilter />, title: 'Filtrowanie danych', description: 'Precyzyjna selekcja informacji według lokalizacji, okresu oraz innych parametrów.' },
    { icon: <FaTemperatureHigh />, title: 'Dane pogodowe', description: 'Sprawdzaj średnie, maksymalne oraz minimalne temperatury, opady i wiatr.' },
    { icon: <FaArrowTrendUp />, title: 'Rekordy pogodowe', description: 'Najwyższe oraz najniższe temperatury, sumy opadów i ekstremalne zjawiska.' }
  ];
const OurAchievements = () => {
  return (
    <section className="container py-8 md:py-20">
      <SectionTitle title='Nasze osiągnięcia'/>
      <div className="flex flex-wrap justify-center gap-8 py-8 md:py-20">
        {achievements.map((item, index) => (
          <Achievement key={index} icon={item.icon} title={item.title} description={item.description} />
        ))}
      </div>
    </section>
  );
};

export default OurAchievements;
