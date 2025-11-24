import { CountryDetailsViewModal } from "../../countryDetailView";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CountryDetails } from "../../types";
import { describe, vi, test, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import * as CountriesDataManager from "../../api/CountriesDataManager";

const mockCountryDetails: CountryDetails = {
  name: {
    nativeName: {
      german: {
        official: "Die Republik Österreich",
        common: "Österreich",
      },
    },
  },
  subregion: "Central Europe",
  languages: {
    bar: "Austrian German",
  },
  currencies: {
    EUR: {
      name: "Euro",
      symbol: "€",
    },
  },
  timezones: ["UTC+01:00"],
  borders: ["CZE", "DEU", "HUN", "ITA", "LIE", "SVK", "SVN", "CHE"],
};

describe("CountryDetailsViewModal Component", () => {
  let getCountriesDetailsDataSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.style.overflow = "unset";

    getCountriesDetailsDataSpy = vi.spyOn(
      CountriesDataManager,
      "getCountriesDetailsData"
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  test("renders loading state initially", async () => {
    getCountriesDetailsDataSpy.mockResolvedValue(mockCountryDetails);

    render(
      <CountryDetailsViewModal country="Austria" onClose={() => {}} />
    );

    expect(screen.getByText("Loading details...")).toBeInTheDocument();
    expect(screen.getByText("Austria")).toBeInTheDocument();
  });

  test("renders country details after loading", async () => {
    getCountriesDetailsDataSpy.mockResolvedValue(mockCountryDetails);

    render(
      <CountryDetailsViewModal country="Austria" onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/Native Name:.*Die Republik Österreich/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Subregion:.*Central Europe/i)).toBeInTheDocument();

    expect(screen.getByText(/Languages:.*Austrian German/i)).toBeInTheDocument();

    expect(screen.getByText(/Currencies:.*Euro/i)).toBeInTheDocument();

    expect(screen.getByText(/Timezones:.*UTC\+01:00/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Borders:.*CZE, DEU, HUN, ITA, LIE, SVK, SVN, CHE/i)
    ).toBeInTheDocument();
  });

  test("sets body overflow to hidden when details are loaded", async () => {
    getCountriesDetailsDataSpy.mockResolvedValue(mockCountryDetails);

    render(
      <CountryDetailsViewModal country="Austria" onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  test("calls onClose and resets body overflow when close button is clicked", async () => {
    getCountriesDetailsDataSpy.mockResolvedValue(mockCountryDetails);
    const onCloseMock = vi.fn();
    const user = userEvent.setup();

    render(<CountryDetailsViewModal country="Austria" onClose={onCloseMock} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
    });

    expect(document.body.style.overflow).toBe("hidden");

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(document.body.style.overflow).toBe("unset");
  });

  test("handles error when fetching country details", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    getCountriesDetailsDataSpy.mockRejectedValue(new Error("Failed to fetch"));

    render(
      <CountryDetailsViewModal country="Austria" onClose={() => {}} />
    );

    expect(screen.getByText("Loading details...")).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch country details:",
        expect.any(Error)
      );
    });

    expect(screen.getByText("Loading details...")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test("handles multiple languages correctly", async () => {
    const multiLanguageCountry: CountryDetails = {
      name: {
        nativeName: {
          french: {
            official: "Confédération suisse",
            common: "Suisse",
          },
        },
      },
      subregion: "Western Europe",
      languages: {
        fra: "French",
        gsw: "Swiss German",
        ita: "Italian",
        roh: "Romansh",
      },
      currencies: {
        CHF: {
          name: "Swiss franc",
          symbol: "Fr.",
        },
      },
      timezones: ["UTC+01:00"],
      borders: ["AUT", "FRA", "ITA", "LIE", "DEU"],
    };

    getCountriesDetailsDataSpy.mockResolvedValue(multiLanguageCountry);

    render(
      <CountryDetailsViewModal country="Switzerland" onClose={() => {}} />
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/Languages:.*French, Swiss German, Italian, Romansh/i)
    ).toBeInTheDocument();
  });

  test("handles multiple currencies correctly", async () => {
    const multiCurrencyCountry: CountryDetails = {
      name: {
        nativeName: {
          spanish: {
            official: "República de Cuba",
            common: "Cuba",
          },
        },
      },
      subregion: "Caribbean",
      languages: {
        spa: "Spanish",
      },
      currencies: {
        CUC: {
          name: "Cuban convertible peso",
          symbol: "$",
        },
        CUP: {
          name: "Cuban peso",
          symbol: "$",
        },
      },
      timezones: ["UTC-05:00"],
    };

    getCountriesDetailsDataSpy.mockResolvedValue(multiCurrencyCountry);

    render(<CountryDetailsViewModal country="Cuba" onClose={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/Currencies:.*Cuban convertible peso, Cuban peso/i)
    ).toBeInTheDocument();
  });
});
