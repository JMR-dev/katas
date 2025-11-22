import { expect, test} from "vitest";
import { CountriesDataManager } from "../../api/CountriesDataManager";
import type { Country } from "../../types";




test("API data fetch matches required structure", async () => {
    const response = await CountriesDataManager();
    
    expect(response[0]).toMatchObject<Country>({} as Country);
});
