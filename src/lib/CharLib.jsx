import Kanji from "kanji.js";
import * as ChineseStroke from "chinese-stroke";
import hiraStrokes from "../data/hiraStrokes.json";
import kataStrokes from "../data/kataStrokes.json";
import jamoStrokes from "../data/jamoStrokes.json";
import * as HangulJS from "hangeul-js";

function getKanji(char) {

    return Kanji.getDetails(char);

}

// Returns a reading for a given character
function getOnyomi(char, index = 0) {

    return getKanji(char).onyomi[index];

}

// Returns the number of strokes in a character
function getStrokeCount(char) {

    try {
        return getKanji(char).stroke_count;
    }
    catch {

    }

    // This library returns NaN if the character doesn't exist
    if (ChineseStroke.get(char)) {
        return ChineseStroke.get(char);
    }

    if (char in hiraStrokes) {
        return hiraStrokes[char];
    }

    if (char in kataStrokes) {
        return kataStrokes[char];
    }

    if (HangulJS.isHangeul(char)) {

        let jamoList = HangulJS.disassemble(char);

        let outputCounts = jamoList.map(jamo => jamoStrokes[jamo]);
        
        // Adds up all the items in the array
        return outputCounts.reduce((partialSum, a) => partialSum + a, 0);
    }

    // console.log(`getStrokeCount: Could not find stroke count for ${char}`);
    return 0;
}

export default { getKanji, getOnyomi, getStrokeCount };
