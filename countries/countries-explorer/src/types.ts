export interface Country {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
    nativeName: {
      dan: {
        official: string;
        common: string;
      };
    };
  };
  region: string;
  capital: [string];
  population: string;
}

export interface CountryDetails extends Country {
  subregion: string;
  languages: {
    [key: string]: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  timezones: string[];
  borders: string[];
}
