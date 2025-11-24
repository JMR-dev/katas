import { expect, test } from "vitest";
import {
  getCountriesData,
  getCountriesDetailsData,
} from "../../api/CountriesDataManager";
import type { Country, CountryDetails } from "../../types";
import { describe, vi } from "vitest";

describe("API data fetch happy path", () => {
  test("API data fetch for Countries browsing view matches required structure", async () => {
    const response = await getCountriesData();

    expect(response[0]).toMatchObject<Country>({} as Country);
  });

  test("API data fetch for Country Details view matches required structure", async () => {
    const countryName = "Denmark";
    const response = await getCountriesDetailsData(countryName);

    expect(response).toMatchObject<CountryDetails>({} as CountryDetails);
  });
});

describe("API data fetch error handling for Countries browsing view", () => {
    test("API data fetch for Countries browsing view handles 204 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 204,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow(
      "No content 204, "
    );
  });
  test("API data fetch for Country Details view handles 400 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "Bad request 400"
    );
  });
  test("API data fetch for Countries browsing view handles 404 error", async () => {
     vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow("Countries not found 404");
  });
  test("API data fetch for Country Details view handles 500 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "Server error 500"
    );
  });
  test("API data fetch for Countries browsing view handles 502 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow("Server error 502");
  });
  test("API data fetch for Country Details view handles 503 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "Server error 503"
    );
  });
    test("API data fetch for Countries browsing view handles 504 error", async () => {
        vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 504,
        } as Response);

    await expect(getCountriesData()).rejects.toThrow("Server error 504");
    });
    test("API data fetch for Countries browsing view handles unknown error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 418,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow(
      "HTTP error: 418"
    );

  });

describe("API data fetch error handling for Country Details view", () => {
    test("API data fetch for Country Details view handles 204 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 204,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "No content 204, "
    );
  });
  test("API data fetch for Countries browsing view handles 400 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow(
      "Bad request 400"
    );
  });
  test("API data fetch for Country Details view handles 404 error", async () => {
     vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow("Countries not found 404");
  });
  test("API data fetch for Countries browsing view handles 500 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow(
      "Server error 500"
    );
  });
  test("API data fetch for Country Details view handles 502 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 502,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "Server error 502"
    );
  });
  test("API data fetch for Countries browsing view handles 503 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 503,
    } as Response);

    await expect(getCountriesData()).rejects.toThrow("Server error 503");
  });
    test("API data fetch for Country Details view handles 504 error", async () => {
        vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 504,
        } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "Server error 504"
    );
    });

    test("API data fetch for Country Details view handles unknown error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 418,
    } as Response);

    await expect(getCountriesDetailsData("Denmark")).rejects.toThrow(
      "HTTP error: 418"
    );
  });

  });
});
