import * as Wanakana from "wanakana";

// List of characters that should be merged with the last to form a syllable
const kanaDigraphChars = "ョュャッンょゅゃっん".split("");
const kanaVowels = "アイウエオーあいうえお".split("");
const kanaMerge = kanaDigraphChars.concat(kanaVowels);
const romaVowels = "aiueo".split("");
const romaConst = "kstnhmyrwgzdbp".split("");
const kanaPunct = "。、＜＞「」：　".split("");

// Takes an array and merges elements with their previous ones if they exist in the supplied array
// e.g. [a, b, c, d, e] with filter [b, e] will return [ab, c, de]
// e.g. [a, c, c] with filter [c] but exclusion [a] will return [a, cc]
function mergeWithLastFilter(inputArray, filterArray, excludeArray = []) {

    // Stores the current combination of characters
    let token = "";
    let output = [];

    for (let i = 0; i < inputArray.length; i++) {

        // Append the character to the current token
        token += inputArray[i];

        // If the next character is in the filter list, stop this iteration here
        if (filterArray.includes(inputArray[i + 1])) {

            if (!excludeArray.includes(token)) {
                continue;
            }
        }

        output.push(token);
        token = ""; // Clear the token for the next run

    }
    return output;
}

// Split a string of Japanese kana into its syllables
export function kanaToHangulSyllables(input) {

    // Merge the digraphs in Japanese
    let output = mergeWithLastFilter(input.split(""), kanaMerge);

    return output;
}

// Iterates through a kana array and returns it in romaji split by consonants and vowels
export function arrayToRomajiGroups(inputArray) {

    let outputArray = [];

    for (let item of inputArray) {

        // Convert each item in the input array to romaji
        let roma = Wanakana.toRomaji(item);

        // Running these filters results in splitting consonants from vowels
        let outputToken = mergeWithLastFilter(roma.split(""), romaConst, romaVowels);

        outputArray.push(outputToken);
    }

    return outputArray;
}

// Counts the number of syllables in a string of kana excluding punctuation
export function countKanaSyllables(input) {
    
    let textArray = mergeWithLastFilter(input.split(""), kanaDigraphChars);

    return textArray.filter(token => !kanaPunct.includes(token)).length;
}
