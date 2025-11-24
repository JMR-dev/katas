import { getCountriesDetailsData } from "./api/CountriesDataManager.ts";
import { JSX, useEffect, useState } from "react";
import { CountryDetails } from "./types.ts";
import "./styles/countryDetailsView.css";

export function CountryDetailsViewModal({
  country,
  onClose,
}: {
  country: string;
  onClose: () => void;
}): JSX.Element | null {
  const [isLoadingCountryDetails, setIsLoadingCountryDetails] = useState(true);
  const [countryDetails, setCountryDetails] = useState<CountryDetails | null>(
    null
  );

  function closeModal() {
    document.body.style.overflow = "unset";
    onClose();
  }

  useEffect(() => {
    const fetchCountryDetails = async () => {
      await getCountriesDetailsData(country)
        .then((details) => {
          console.log("Fetched country details:", details);
          console.log("Country Name:", country);
          setCountryDetails(details);
          setIsLoadingCountryDetails(false);
          document.body.style.overflow = "hidden";
        })
        .catch((error) => {
          console.error("Failed to fetch country details:", error);
        });
    };

    fetchCountryDetails();
  }, [country]);

  return (
    <div className="country-details-modal-overlay">
      <h2>{country}</h2>
      {isLoadingCountryDetails ? (
        <div>Loading details...</div>
      ) : (
        <>
          {console.log("Rendering country details:", countryDetails)}
          <div className="country-details-ui">
            <div className="country-details-modal-content">              
              <p>
                Native Name:{" "}
                {countryDetails?.name?.nativeName?.[
                  Object.keys(countryDetails?.name?.nativeName || {})[0]
                ]?.official ?? "N/A"}
              </p>
              <p>Subregion: {countryDetails?.subregion}</p>
              <p>
                Languages:{" "}
                {countryDetails?.languages
                  ? Object.values(countryDetails?.languages).join(", ")
                  : "N/A"}
              </p>
              <p>
                Currencies:{" "}
                {countryDetails?.currencies
                  ? Object.values(countryDetails?.currencies)
                      .map((c) => c.name)
                      .join(", ")
                  : "N/A"}
              </p>
              <p>
                Timezones:{" "}
                {countryDetails?.timezones
                  ? countryDetails?.timezones.map((tz) => tz).join(", ")
                  : "N/A"}
              </p>
              <p>
                Borders:{" "}
                {countryDetails?.borders
                  ? countryDetails?.borders.map((b) => b).join(", ")
                  : "N/A"}
              </p>
            </div>
            <div className="country-details-modal-close-button">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
