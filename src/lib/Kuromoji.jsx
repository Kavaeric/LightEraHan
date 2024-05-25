import kuromoji from "@sglkc/kuromoji" // Japanese language parser

let tokenizer = null;
let DICT_PATH = "kuromoji/dict/"

export function buildTokenizer() {
    // Converts a callback function into an async function
    return new Promise((resolve, reject) => {
        // Initialise the tokenizer
        kuromoji.builder({ dicPath: DICT_PATH }).build(function (error, _tokenizer) {
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
