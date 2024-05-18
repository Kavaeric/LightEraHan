import Kanji from "kanji.js";

function kanji(char) {

    return Kanji.getDetails(char);

}

// Returns an array of readings for each character
function onyomi(char, index = 0) {

    return Kanji.getDetails(char).onyomi[index];

}

export default { kanji, onyomi };
