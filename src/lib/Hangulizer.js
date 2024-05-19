import ConversionTables from "./ConversionTables";
import * as HangulJS from "hangeul-js";
import * as Wanakana from "wanakana";
import { arrayToRomajiGroups, kanaToHangulSyllables } from "./JapaneseUtils";

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

    let output = kanaToHangulSyllables(input);
    output = kanaArrayToHangul(output)

    return output.join("");
}

export default { kanaToHangul };
