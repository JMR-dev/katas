import { getCountriesData } from "./api/CountriesDataManager";
import { CountryDetailsViewModal } from "./countryDetailView.tsx";
import type { Country } from "./types.ts";
import { useEffect, useState } from "react";
import "./styles/App.css";

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isPaginatedView, setIsPaginatedView] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  function alphabeticalSort(a: any, b: any) {
    return a.name.common.localeCompare(b.name.common);
  }

  useEffect(() => {
    getCountriesData().then((data) => {
      const sorted = data.sort(alphabeticalSort).map((country) => ({
        ...country,
        capital: country.capital?.slice().sort() as [string],
      }));
      setCountries(sorted);
    });
  }, []);

  console.log(countries);

  function handleCountryClick(countryName: string) {
    setSelectedCountry(countryName);
  }

  function createPaginatedView() {
    const itemsPerPage = 10;
    const pageCount = Math.ceil(countries.length / itemsPerPage);
    const pages = Array.from({ length: pageCount }, (_, i) =>
      countries.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
    );
    return pages.map((page, index) => (
      <>
        <div key={index}>
          <ul>
            {page.map((country) => (
              <li key={country.name.common}>
                <div>
                  Country:{" "}
                  <span>
                   <button onClick={() => handleCountryClick(country.name.common)}>{country.name.common}</button>
                  </span>
                </div>
                <div>Region: {country.region}</div>
                <div>Population: {country.population.toLocaleString()}</div>
                <div>
                  Capital(s):
                  {country.capital?.map((cap) => cap).join(", ") ?? "No Capital"}
                </div>
                <div>
                  <button
                    onClick={() => handleCountryClick(country.name.common)}
                  >
                    <img
                      src={country.flags.svg}
                      alt={`Flag of ${country.name.common}`}
                      loading="lazy"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
         <ul>
        {selectedCountry && (
          <CountryDetailsViewModal
            country={selectedCountry}
            onClose={() => {
              setSelectedCountry(null);
            }}
          />
        )}
      </ul>
        <nav className="navigation" key={index + "-nav"}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>Page {currentPage + 1}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))
            }
            disabled={currentPage === pages.length - 1}
          >
            Next
          </button>
        </nav>
      </>
    ));
  }

  return (
    <>
      <h1>Countries Explorer</h1>
      <button
        onClick={() => {
          if (isPaginatedView === false) {
            setIsPaginatedView(true);
            setCurrentPage(0);
          } else {
            setIsPaginatedView(false);
            setCurrentPage(0);
          }
        }}
        disabled={!countries.length}
      >
        Change View Type
      </button>
      {isPaginatedView ? createPaginatedView()[currentPage] : (
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            <div>
              Country:{" "}
              <span>
                 <button onClick={() => handleCountryClick(country.name.common)}>{country.name.common}</button>
              </span>
            </div>
            <div>Region: {country.region}</div>
            <div>Population: {country.population.toLocaleString()}</div>
            <div>
              Capital(s):
              {country?.capital?.map((cap) => cap).join(", ") ?? "No Capital"}
            </div>
            <div>
              <button onClick={() => handleCountryClick(country.name.common)}>
                <img
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  loading="lazy"
                />
              </button>
            </div>
          </li>
        ))}
      </ul>)}
      <ul>
        {selectedCountry && (
          <CountryDetailsViewModal
            country={selectedCountry}
            onClose={() => {
              setSelectedCountry(null);
            }}
          />
        )}
      </ul>
    </>
  );
}
