export interface Country {
        "flags": {
            "png": string,
            "svg": string,
            "alt": string
        },
        "name": {
            "common": string,
            "official": string,
            "nativeName": {
                "dan": {
                    "official": string,
                    "common": string
                }
            }
        },
        "capital": [
            string
        ],
        "population": string   
}