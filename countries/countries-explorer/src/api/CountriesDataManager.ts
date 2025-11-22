import { Country, CountryDetails } from "../types";

function handleResponseError(response: Response): void {
  if (!response.ok || response.status === 204) {
    switch (response.status) {
      case 204:
        throw new Error(`No content ${response.status}, `);
      case 400:
        throw new Error(`Bad request ${response.status}`);
      case 404:
        throw new Error(
          `Countries not found ${response.status}`
        );
      case 500:
      case 502:
      case 503:
      case 504:
        throw new Error(`Server error ${response.status}`);
      default:
        throw new Error(`HTTP error: ${response.status}`);
    }
  }
}
export async function getCountriesData(): Promise<Country[]> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population"
  );
  handleResponseError(response);
  return await response.json();
}

export async function getCountriesDetailsData(
  name: string
): Promise<CountryDetails> {
  const response: Response = await fetch(
    `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=subregion,languages,currencies,timezones,borders`
  );
  handleResponseError(response);
  return await response.json();
}
