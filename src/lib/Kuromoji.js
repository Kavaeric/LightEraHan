import kuromoji, { reject } from "kuromoji/build/kuromoji"; // Japanese language parser

let tokenizer = null;

export function buildTokenizer() {
    // Converts a callback function into an async function
    return new Promise((resolve, reject) => {
        // Initialise the tokenizer
        kuromoji.builder({ dicPath: "kuromoji/dict/" }).build(function (error, _tokenizer) {
            if (error != null) {
                reject(error);
                return;
            }

            // The tokenizer loads async, so some logic will be needed to check for initialisation
            tokenizer = _tokenizer;
            console.log("Tokenizer initialised.");
            console.log("- - - - -");
            resolve();
        });
    })
}

export function getTokenizer() {
    return tokenizer;
}
