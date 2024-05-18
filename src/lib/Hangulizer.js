import ConversionTables from "./ConversionTables";
import * as HangulJS from "hangeul-js";
import * as Wanakana from "wanakana";

// List of characters that should be merged with the last to form a syllable
const kanaDigraphChars = "ョュャッンょゅゃっん".split("");
const kanaVowels = "アイウエオーあいうえお".split("");
const kanaMerge = kanaDigraphChars.concat(kanaVowels);

const romaVowels = "aiueo".split("");
const romaConst = "kstnhmyrwgzdbp".split("");

// Takes an array and merges elements with their previous ones if they exist in the supplied array
// e.g. [a, b, c, d, e] with filter [b, e] will return [ab, c, de]
// e.g. [a, c, c] with filter [c] but exclusion [a] will return [a, cc]
function mergeWithLastFilter (inputArray, filterArray, excludeArray = []) {

    // Stores the current combination of characters
    let token = "";
    let output = [];

    for (let i = 0; i < inputArray.length; i++) {

        // Append the character to the current token
        token += inputArray[i];

        // If the next character is in the filter list, stop this iteration here
        if (filterArray.includes(inputArray[i + 1])) {

            if (!excludeArray.includes(token))
            {
                continue;
            }  
        }

        output.push (token);
        token = ""; // Clear the token for the next run

    }
    return output;
}

// Split a string of Japanese kana into its syllables
function kanaToSyllables (input) {

    // Merge the digraphs in Japanese
    let output = mergeWithLastFilter(input.split(""), kanaMerge);

    return output;
}

// Iterates through a kana array and returns it in romaji split by consonants and vowels
function arrayToRomajiGroups (inputArray) {

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

// Takes a string and returns the jamo via the lookup table; returns the same string if not found
function romaToJamoLookup (input) {

    let conTable = ConversionTables.getTableData("romaHangul");

    if (input in conTable) {
        return conTable[input];
    }

    return input;
}

// Turns an array of kana into Hangul
function kanaArrayToHangul (input) {

    // Converts the incoming kana array into romanji, grouped by consonants/sound
    let inputRomaGroups = arrayToRomajiGroups(input);
    let jamoArray = [];

    for (let token of inputRomaGroups) {

        let newToken = [];

        // Convert each group in each token to a collection of jamo
        newToken = token.map((group) => romaToJamoLookup(group));
        jamoArray.push(newToken);
    }

    // Then, combine each of those jamo into a coherent character
    let output = jamoArray.map((jamoGroup) => hangulFromJamo(jamoGroup));

    return output;
}

// Combines Hangul jamo into coherent syllables
function hangulFromJamo (input) {

    let output = "";

    // Assemble the input, but check for any isolated vowels
    for (let char of HangulJS.assemble(input)) {

        // If it's a lone vowel, assemble that vowel with the null start consonant
        if (HangulJS.isMoeum(char)) {
            //console.log(`Moeum detected: ${char}`);
            output += HangulJS.assemble(["ㅇ", char]);
            continue;
        }

        output += char;
    }

    return output;
}

// Main conversion function from Japanese kana to Korean Hangul
function kanaToHangul (input) {

    // First check if it's actually Japanese kana
    if (!Wanakana.isKana(input)) {
        console.log("Hangulizer.js ERROR: Input string is not kana.");
        return input;
    }

    let output = kanaToSyllables(input);
    output = kanaArrayToHangul(output)

    return output.join("");
}

export default { kanaToHangul };
