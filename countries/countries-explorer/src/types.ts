export interface Country {
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  name: {
    common: string;
    official: string;
  };
  region: string;
  capital?: string[];
  population: string;
}

export interface CountryDetails {
  name: {
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
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
  borders?: string[];
}
