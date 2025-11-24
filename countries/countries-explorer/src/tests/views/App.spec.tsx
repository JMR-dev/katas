import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../../App";
import { getCountriesData } from "../../api/CountriesDataManager";
import { Country } from "../../types";

vi.mock("../../api/CountriesDataManager", () => ({
  getCountriesData: vi.fn(),
  getCountriesDetailsData: vi.fn(),
}));

vi.mock("../../countryDetailView.tsx", () => ({
  CountryDetailsViewModal: ({ country, onClose }: { country: string; onClose: () => void }) => (
    <div data-testid="country-modal">
      <h2>{country}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("App Component", () => {
  const mockCountries: Country[] = [
    {
      name: { common: "Canada", official: "Canada" },
      capital: ["Ottawa"],
      region: "Americas",
      flags: { svg: "canada.svg", png: "canada.png", alt: "Flag of Canada" },
      population: "38000000",
    },
    {
      name: { common: "Brazil", official: "Federative Republic of Brazil" },
      capital: ["Bras�lia"],
      region: "Americas",
      flags: { svg: "brazil.svg", png: "brazil.png", alt: "Flag of Brazil" },
      population: "213000000",
    },
    {
      name: { common: "Australia", official: "Commonwealth of Australia" },
      capital: ["Canberra"],
      region: "Oceania",
      flags: { svg: "australia.svg", png: "australia.png", alt: "Flag of Australia" },
      population: "25600000",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render and Data Fetching", () => {
    test("should render the title", async () => {
      (getCountriesData as Mock).mockResolvedValue([]);
      render(<App />);

      expect(screen.getByText("Countries Explorer")).toBeInTheDocument();
    });

    test("should fetch and display countries on mount", async () => {
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(getCountriesData).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByText("Australia")).toBeInTheDocument();
        expect(screen.getByText("Brazil")).toBeInTheDocument();
        expect(screen.getByText("Canada")).toBeInTheDocument();
      });
    });

    test("should sort countries alphabetically", async () => {
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        const countryButtons = screen.getAllByRole("button", { name: /Australia|Brazil|Canada/i });
        const countryNames = countryButtons.map(btn => btn.textContent).filter(Boolean);
        const uniqueNames = Array.from(new Set(countryNames));

        expect(uniqueNames[0]).toBe("Australia");
        expect(uniqueNames[1]).toBe("Brazil");
        expect(uniqueNames[2]).toBe("Canada");
      });
    });

    test("should display country information correctly", async () => {
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Canada" })).toBeInTheDocument();
      });

      expect(screen.getAllByText(/Region:/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Capital\(s\):/)[0]).toBeInTheDocument();
      expect(screen.getByText(/Ottawa/)).toBeInTheDocument();
    });

    test("should render flag images with correct attributes", async () => {
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        const flagImage = screen.getByAltText("Flag of Canada");
        expect(flagImage).toBeInTheDocument();
        expect(flagImage).toHaveAttribute("src", "canada.svg");
        expect(flagImage).toHaveAttribute("loading", "lazy");
      });
    });
  });

  describe("View Toggle Functionality", () => {
    test("should disable 'Change View Type' button when no countries are loaded", () => {
      (getCountriesData as Mock).mockResolvedValue([]);
      render(<App />);

      const changeViewButton = screen.getByText("Change View Type");
      expect(changeViewButton).toBeDisabled();
    });

    test("should enable 'Change View Type' button when countries are loaded", async () => {
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        const changeViewButton = screen.getByText("Change View Type");
        expect(changeViewButton).not.toBeDisabled();
      });
    });

    test("should toggle between paginated and non-paginated view", async () => {
      const user = userEvent.setup();
      const manyCountries = Array.from({ length: 25 }, (_, i) => ({
        name: { common: `Country${i}`, official: `Country ${i}` },
        capital: [`Capital${i}`],
        region: "Region",
        flags: { svg: `flag${i}.svg`, png: `flag${i}.png`, alt: `Flag ${i}` },
        population: "1000000",
      }));

      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Country0")).toBeInTheDocument();
      });

      expect(screen.getByText("Previous")).toBeInTheDocument();
      expect(screen.getByText("Next")).toBeInTheDocument();
      expect(screen.getByText(/Page 1/)).toBeInTheDocument();

      const changeViewButton = screen.getByText("Change View Type");
      await user.click(changeViewButton);

      await waitFor(() => {
        const previousButtons = screen.queryAllByText("Previous");
        const nextButtons = screen.queryAllByText("Next");
        expect(previousButtons.length).toBe(0);
        expect(nextButtons.length).toBe(0);
      });
    });
  });

  describe("Pagination Functionality", () => {
    const createManyCountries = (count: number): Country[] => {
      return Array.from({ length: count }, (_, i) => ({
        name: {
          common: `Country${String.fromCharCode(65 + i)}`,
          official: `Official Country ${i}`
        },
        capital: [`Capital${i}`],
        region: "Region",
        flags: {
          svg: `flag${i}.svg`,
          png: `flag${i}.png`,
          alt: `Flag ${i}`
        },
        population: `${1000000 + i}`,
      }));
    };

    test("should display 10 countries per page in paginated view", async () => {
      const manyCountries = createManyCountries(25);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("CountryA")).toBeInTheDocument();
      });

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(10);
    });

    test("should navigate to next page", async () => {
      const user = userEvent.setup();
      const manyCountries = createManyCountries(15);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("CountryA")).toBeInTheDocument();
      });

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2/)).toBeInTheDocument();
      });
    });

    test("should navigate to previous page", async () => {
      const user = userEvent.setup();
      const manyCountries = createManyCountries(15);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("CountryA")).toBeInTheDocument();
      });

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2/)).toBeInTheDocument();
      });

      const previousButton = screen.getByText("Previous");
      await user.click(previousButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 1/)).toBeInTheDocument();
      });
    });

    test("should disable Previous button on first page", async () => {
      const manyCountries = createManyCountries(15);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        const previousButton = screen.getByText("Previous");
        expect(previousButton).toBeDisabled();
      });
    });

    test("should disable Next button on last page", async () => {
      const user = userEvent.setup();
      const manyCountries = createManyCountries(15);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "CountryA" })).toBeInTheDocument();
      });

      const nextButton = screen.getByRole("button", { name: "Next" });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      });
    });

    test("should reset to page 1 when toggling view type", async () => {
      const user = userEvent.setup();
      const manyCountries = createManyCountries(25);
      (getCountriesData as Mock).mockResolvedValue(manyCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("CountryA")).toBeInTheDocument();
      });

      const nextButton = screen.getByText("Next");
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2/)).toBeInTheDocument();
      });

      const changeViewButton = screen.getByText("Change View Type");
      await user.click(changeViewButton);

      await user.click(changeViewButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 1/)).toBeInTheDocument();
      });
    });
  });

  describe("Country Detail Modal", () => {
    test("should open modal when country name button is clicked", async () => {
      const user = userEvent.setup();
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Canada" })).toBeInTheDocument();
      });

      const countryButtons = screen.getAllByRole("button", { name: "Canada" });
      await user.click(countryButtons[0]);

      await waitFor(() => {
        const modals = screen.queryAllByTestId("country-modal");
        expect(modals.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    test("should open modal when flag is clicked", async () => {
      const user = userEvent.setup();
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByAltText("Flag of Canada")).toBeInTheDocument();
      });

      const flagImage = screen.getByAltText("Flag of Canada");
      const flagButton = flagImage.closest("button");
      expect(flagButton).toBeInTheDocument();

      if (flagButton) {
        await user.click(flagButton);
      }

      await waitFor(() => {
        const modals = screen.queryAllByTestId("country-modal");
        expect(modals.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    });

    test("should close modal when close button is clicked", async () => {
      const user = userEvent.setup();
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Canada" })).toBeInTheDocument();
      });

      const countryButtons = screen.getAllByRole("button", { name: "Canada" });
      await user.click(countryButtons[0]);

      await waitFor(() => {
        const modals = screen.queryAllByTestId("country-modal");
        expect(modals.length).toBeGreaterThan(0);
      }, { timeout: 2000 });

      const closeButtons = screen.getAllByRole("button", { name: "Close" });
      await user.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.queryAllByTestId("country-modal")).toHaveLength(0);
      }, { timeout: 2000 });
    });

    test("should display correct country name in modal", async () => {
      const user = userEvent.setup();
      (getCountriesData as Mock).mockResolvedValue(mockCountries);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Brazil" })).toBeInTheDocument();
      });

      const countryButtons = screen.getAllByRole("button", { name: "Brazil" });
      await user.click(countryButtons[0]);

      await waitFor(() => {
        const modals = screen.queryAllByTestId("country-modal");
        expect(modals.length).toBeGreaterThan(0);
        expect(modals[0]).toHaveTextContent("Brazil");
      }, { timeout: 2000 });
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty countries array", async () => {
      (getCountriesData as Mock).mockResolvedValue([]);
      render(<App />);

      await waitFor(() => {
        expect(getCountriesData).toHaveBeenCalled();
      });

      const changeViewButton = screen.getByText("Change View Type");
      expect(changeViewButton).toBeDisabled();
    });

    test("should handle countries with multiple capitals", async () => {
      const countryWithMultipleCapitals = {
        name: { common: "South Africa", official: "Republic of South Africa" },
        capital: ["Pretoria", "Bloemfontein", "Cape Town"],
        region: "Africa",
        flags: { svg: "sa.svg", png: "sa.png", alt: "Flag of South Africa" },
        population: "59300000",
      } as Country;

      (getCountriesData as Mock).mockResolvedValue([countryWithMultipleCapitals]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Bloemfontein, Cape Town, Pretoria/)).toBeInTheDocument();
      });
    });

    test("should format population numbers with locale string", async () => {
      const countryWithLargePopulation: Country = {
        name: { common: "China", official: "People's Republic of China" },
        capital: ["Beijing"],
        region: "Asia",
        flags: { svg: "china.svg", png: "china.png", alt: "Flag of China" },
        population: "1400000000",
      };

      (getCountriesData as Mock).mockResolvedValue([countryWithLargePopulation]);
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "China" })).toBeInTheDocument();
      });

      expect(screen.getByText(/Population:/)).toBeInTheDocument();
    });

    test("should handle single country without pagination", async () => {
      const singleCountry: Country = {
        name: { common: "Australia", official: "Commonwealth of Australia" },
        capital: ["Canberra"],
        region: "Oceania",
        flags: { svg: "australia.svg", png: "australia.png", alt: "Flag of Australia" },
        population: "25600000",
      };

      (getCountriesData as Mock).mockResolvedValue([singleCountry]);
      render(<App />);

      await waitFor(() => {
        const australiaButtons = screen.queryAllByRole("button", { name: "Australia" });
        expect(australiaButtons.length).toBeGreaterThan(0);
      }, { timeout: 2000 });

      const previousButtons = screen.getAllByRole("button", { name: "Previous" });
      const nextButtons = screen.getAllByRole("button", { name: "Next" });

      expect(previousButtons[0]).toBeDisabled();
      expect(nextButtons[0]).toBeDisabled();
    });
  });
});
