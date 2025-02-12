import Image from "next/image";
import AboutusImg from "../../public/img/aboutus-img.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faChartLine } from "@fortawesome/free-solid-svg-icons";
import SectionTitle from "../UI/SectionTitle";

export default function AboutPlatform() {
  return (
    <section className="bg-secondaryColor py-16 px-6">
      <div className="container mx-auto">
        {/* Tytuł sekcji */}
        <SectionTitle title="Kilka słów o nas" />

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-8">
          {/* Obraz po lewej */}
          <div className="lg:w-1/2">
            <Image
              src={AboutusImg}
              alt="Analiza danych pogodowych"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Tekst po prawej */}
          <div className="lg:w-1/2">
            <p className="text-gray-300 mt-4 font-thin">
              Tworzymy interaktywną platformę do analizy historycznych danych pogodowych w Polsce.
              Naszym celem jest dostarczanie precyzyjnych informacji meteorologicznych
              oraz ułatwienie analizy wieloletnich trendów klimatycznych.
            </p>
            <p className="text-gray-300 mt-2 font-thin">
              Platforma opiera się na bazie danych zawierającej informacje pogodowe
              dla 80 miast w Polsce z lat 1950-2025. Pozwala użytkownikom na wizualizację,
              filtrowanie oraz analizę statystyczną danych.
            </p>

            {/* Lista z ikonami */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCloud} className="text-mainColor text-2xl" />
                <div>
                  <h4 className="font-semibold">Dokładne Dane Meteorologiczne</h4>
                  <p className="text-gray-300 text-sm font-thin">
                    Dostęp do danych pogodowych dla 80 miast z ostatnich 75 lat.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faChartLine} className="text-mainColor text-2xl" />
                <div>
                  <h4 className="font-semibold">Zaawansowana Analiza Danych</h4>
                  <p className="text-gray-300 text-sm font-thin">
                    Interaktywne wykresy i raporty pomagające w analizie trendów klimatycznych.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
