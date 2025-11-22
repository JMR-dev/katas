import { CountriesDataManager } from "./api/CountriesDataManager";
import type { Country } from "./types.ts"
import { useEffect, useState } from "react";
export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    CountriesDataManager().then(setCountries);
  }, []);

  console.log(countries);

  return (
    <h1 style={{ textAlign: 'center' }}>Countries Explorer</h1>
  );
}
