import Papa from "papaparse"; // CSV parser

// Conversion tables parsed from .CSVs
export function parseConTables() {

    // Converts a callback function into an async function
    return Promise.all(
        [
            new Promise((resolve, reject) => {
                // Particles
                Papa.parse("contables/particles.csv", {
                    download: true,
                    header: true,
                    comments: "//",
            
                    complete: function(result) {
                        console.log("Parsed particles.csv");
                        console.log(result);
                        resolve(result.data);
                    }
                });
            }),

            // Kanji
            new Promise((resolve, reject) => {
                Papa.parse("contables/custom.csv", {
                    download: true,
                    header: true,
                    comments: "//",
            
                    complete: function(result) {
                        console.log("Parsed custom.csv");
                        console.log(result);
                        resolve(result.data);
                    }
                });
            }),
        
            // Custom
            new Promise((resolve, reject) => {
                Papa.parse("contables/custom.csv", {
                    download: true,
                    header: true,
                    comments: "//",
            
                    complete: function(result) {
                        console.log("Parsed custom.csv");
                        console.log(result);
                        resolve(result.data);
                    }
                });
            })
        ]
    )
}