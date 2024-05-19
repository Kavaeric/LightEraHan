import * as JapaneseUtils from "./JapaneseUtils";
import * as Wanakana from "wanakana";
import * as HangulJS from "hangeul-js";
import * as HangulRoma from "@romanize/korean";
import Hangulizer from "./Hangulizer";


// Extracts the display_form text from an array
export function getArrayText(tokenArray, join = true, delimiter = "") {

	let text = tokenArray.map((token) => token.display_form||token.surface_form);

	if (join) {
		return text.join(delimiter)
	}

	return text;
}

// Extracts the display_form text from an array
export function getArrayReadings(tokenArray, join = true, delimiter = "") {

	let readings = tokenArray.map((token) => token.han_reading||token.reading);

	if (join) {
		return readings.join(delimiter)
	}

	return readings;
}

// Specialised function that produces Japanese reading for voice synthesis
export function getJAReading(inputArray) {

	let tokenArray = structuredClone(inputArray);

	// To help with inflection, punctuation is placed after each particle
	for (let token of tokenArray) {

		// Any particles but final
		if (token.pos === "助詞"
			&& token.display_form === "于") {
			token.han_reading += "、";
		}
	}

	// Join the output with fullwidth spaces
	return getArrayReadings(tokenArray, true, "　");
}

// Specialised function that produces Chinese reading for voice synthesis
export function getCNReading(inputArray) {

	let tokenArray = structuredClone(inputArray);

	// To help with inflection, punctuation is placed after each particle
	for (let token of tokenArray) {

		// Any particles but final
		if (token.pos === "助詞"
			&& token.display_form === "于") {
			token.display_form += "，";
		}
	}

	// Get the text only
	let splitArray = getArrayText(tokenArray);
	let output = [];

	for (let token of splitArray) {

		// Split the token into its constituent parts
		// (which for the final step, would be hanzi + hangul)
		token = Wanakana.tokenize(token);
		let newToken = [];

		for (let segment of token) {

			let newSegment = segment;

			// Romanize any Hangeul
			if (HangulJS.isHangeul(segment)) {
				newSegment = HangulRoma.romanize(segment);
			}

			newToken.push(newSegment);
		}

		output.push(newToken.join(""));
	}

	return output.join("");
}

// Specialised function that produces Korean reading for voice synthesis
export function getKRReading(inputArray) {

	let hangulReading = "";

	// To help with inflection, punctuation is placed after each particle
	for (let token of inputArray) {
		
		if (token.pos !== "記号") {
			hangulReading += Hangulizer.kanaToHangul(token.han_reading);
		} else {
			hangulReading += token.display_form;
		}

		if (token.pos === "助詞"
			&& token.display_form === "于") {
			
			hangulReading += " ";
		}
	}

	return hangulReading;
}

// Extracts tokens from an array, with an option to ignore punctuation
export function getArrayTokens(tokenArray, ignorePunct = true) {

	let newTokenArray = [];

	for (let token of tokenArray) {

		// If ignorePunct is true and this is a punctuation token, skip
		if (token.pos === "記号" && ignorePunct) {
			continue;
		}

		newTokenArray.push(token);
	}

	return newTokenArray;

}

// Counts the number of syllables in an array
export function countSyllablesInArray(tokenArray) {

	let arrayReadings = getArrayReadings(getArrayTokens(tokenArray));

	return JapaneseUtils.countKanaSyllables(arrayReadings);
}

// Counts the number of characters in an array
export function countCharsInArray(tokenArray) {

	return getArrayText(tokenArray).length;
	
}

// Counts the number of tokens with hasChanged === true in an array
export function countChangesInArray(tokenArray) {

	let changes = 0;

	for (let token of tokenArray) {
		if (token.hasChanged) {
			changes++;		
		}
	}

	return changes;
}

// Counts the number of changes across an entire matrix
export function countChangesInMatrix(conMatrix) {

	let changes = 0;

	for (let step of conMatrix) {
		changes += countChangesInArray(step.tokenArray);
	}

	return changes;
}
