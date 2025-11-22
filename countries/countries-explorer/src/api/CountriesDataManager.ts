import { Country } from "../types";

export async function CountriesDataManager(): Promise<Country[]>{
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags,population");
    const countriesData = await JSON.parse(await response.text());
    return countriesData;  
}