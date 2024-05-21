import * as JapaneseUtils from "./JapaneseUtils";
import * as Wanakana from "wanakana";
import * as HangulJS from "hangeul-js";
import * as HangulRoma from "@romanize/korean";
import Hangulizer from "./Hangulizer";
import CharLib from "./CharLib";
import punctConversion from "./punctConversion.json";

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

	let readings = tokenArray.map((token) => token.han_reading||token.reading||token.display_form);

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
		
		if (token.pos !== "記号" && token.word_type === "KNOWN") {
			hangulReading += Hangulizer.kanaToHangul(token.han_reading);
		} else if (token.pos === "記号" && token.display_form in punctConversion) {
			hangulReading += punctConversion[token.display_form];
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

// Counts the number of tokens that have at least 1 change during the conversion so far
export function countChangedTokens (tokenArray) {

	let changedTokens = 0;

	for (let token of tokenArray) {
		if (token.changeCount > 0) {
			changedTokens++;
		}
	}

	return changedTokens;
}

// Sums the number of token changes done so far at a given step
export function countTokenChangesSoFar (tokenArray) {

	let changes = 0;

	for (let token of tokenArray) {
		changes += token.changeCount;
	}

	return changes;
}

// Counts the number of strokes in a token
export function countStrokesInToken (token) {

	let strokeCount = 0;

	if (token.pos !== "記号") {
		for (let char of token.display_form.split("")) {
			strokeCount += CharLib.getStrokeCount(char);
		}
	} else {
		// console.log(`countStrokesInToken: ${token.display_form} is not a character.`)
	}

	return strokeCount;

}

// Counts the number of strokes in an array
export function countStrokesInArray (tokenArray) {

	let strokeCount = 0;

	for (let token of tokenArray) {
		strokeCount += countStrokesInToken(token);
	}

	return strokeCount;
}
