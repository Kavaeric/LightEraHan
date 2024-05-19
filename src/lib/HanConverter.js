import ChineseConverter from "./ChineseConverter"; // Simplified-Traditional Chinese converter
import { getTokenizer, buildTokenizer } from "./Kuromoji"; // Kuromoji parser
import Hangulizer from "./Hangulizer";
import ConversionTables from "./ConversionTables";
import { matchAndReplaceAll } from "./TokenArraySearch";
import Kanji from "./Kanji";
import * as Wanakana from "wanakana";

// List of all verb token descriptors to be used by the unconjugator
const verbTokens = ["動詞", "助動詞"];
// And list of common verb endings
// const verbEndings = "るすうむぶ".slice("");
const verbEndings = "るう".slice("");

// Adjective token descriptors and common endings
const adjTokens = ["形容詞"];
const adjEndings = "いき".slice("");

// Initial setup
function initialiseHanConverter() {

	return Promise.all([
		// Wait for the tokenizer to load
		buildTokenizer(),

		// Wait for the conversion tables to load
		ConversionTables.parseConTables()
	])
}

// Checks if an array has had any changes and returns a bool
// TODO: Is there a way to check for changes if a character has been removed?
function arrayHasChanges(tokenArray) {

	for (let token of tokenArray) {
		if (token.hasChanged) {
			return true;
		}
	}

	return false;
}

// Maximises kanji use via the use of a kanji conversion table
function maximiseKanji(tokenArray) {

	matchAndReplaceAll(tokenArray, ConversionTables.getTableData("kanji"));
	removeEmptyTokens(tokenArray);

}

// Replace particles
function replaceParticles(tokenArray) {

	matchAndReplaceAll(tokenArray, ConversionTables.getTableData("particles"));
	removeEmptyTokens(tokenArray);

}

// Process auxiliary verbs
function convertAuxVerbs(tokenArray) {

	matchAndReplaceAll(tokenArray, ConversionTables.getTableData("auxVerbs"));
	removeEmptyTokens(tokenArray);

}

// Replace vocab (custom list)
function replaceVocabulary(tokenArray) {

	matchAndReplaceAll(tokenArray, ConversionTables.getTableData("custom"));
	removeEmptyTokens(tokenArray);

}

// Converts all the verbs in a token array into their non-conjugated (basic) form
function unconjugateVerbs(tokenArray) {
	for (let token of tokenArray) {	
		if (verbTokens.includes(token.pos) && token.display_form != token.basic_form) {
			token.display_form = token.basic_form;

			token.hasChanged = true;
		}
	}
}

// Removes the ending of verbs
function sliceVerbs(tokenArray) {

	for (let token of tokenArray) {	
		if (verbTokens.includes(token.pos)) {
			
			// Remove verb ending
			if (verbEndings.includes(token.display_form.slice(-1))) {

				if (token.display_form.length === 1) {
					console.log(`Attempted to verb-slice ${token.display_form}, but it only consists of one character.`);
					continue;
				}

				token.display_form = token.display_form.slice(0, -1);
			}

			token.hasChanged = true;
		}
	}
}

// Remove ending of adjectives
function sliceAdjectives(tokenArray) {

	for (let token of tokenArray) {	
		if (adjTokens.includes(token.pos)) {
			
			// Remove the verb -ru ending
			if (adjEndings.includes(token.display_form.slice(-1))) {

				if (token.display_form.length === 1) {
					console.log(`Attempted to adj-slice ${token.display_form}, but it only consists of one character.`);
					continue;
				}

				token.display_form = token.display_form.slice(0, -1);
			}

			token.hasChanged = true;
		}
	}
}

// Converts all characters in a token array simplfied characters
function convertArrayToSimplified(tokenArray) {

	// Take each token's display form and run it through the converter
	for (let token of tokenArray) {	
		let newForm = ChineseConverter(token.display_form);

		if (token.display_form !== newForm) {
			token.display_form = newForm;
			token.hasChanged = true;
		}

		// Update the language display so the correct typefaces are used
		token.langDisplay = "zh-Hans";
	}
}

// Takes a string and converts kana within to Hangul
function hangulizeTokenText(tokenText) {

	let output = [];

	// Segment input into constituent parts
	let inputSegments = Wanakana.tokenize(tokenText);

	for (let segment of inputSegments) {

		// If the segment is kana, feed it through the Hangulizer
		if (Wanakana.isKana(segment)) {
			output.push(Hangulizer.kanaToHangul(segment));
			continue;
		}
		output.push(segment);
	}

	return output.join("");
}

// Converts kana in a given token array to Hangul, ignoring kanji, romaji, etc.
function hangulizeArray(tokenArray) {

	for (let token of tokenArray) {

		let newForm = hangulizeTokenText(token.display_form);

		if (token.display_form !== newForm) {
			token.display_form = newForm;
			token.hasChanged = true;
		}
	}
}

// Removes any tokens that have no display_form
function removeEmptyTokens(tokenArray) {
	for (let token of tokenArray) {
		if (token.display_form === null) {
			tokenArray.splice(tokenArray.indexOf(token), 1);
		}
	}
}

// Adds the han_reading property to all tokens in the array, which gets displayed as ruby.
function addReadingsToArray(tokenArray) {
	for (let token of tokenArray) {

		// Exclude symbols/punctuation and anything with an existing han_reading
		if (token.pos != "記号" && !token.han_reading) {

			let charList = token.display_form.split("");
			let readingList = [];

			for (let char of charList) {

				// If it's kanji, push the first onyomi reading to the list
				if (Wanakana.isKanji(char)) {
					readingList.push(Kanji.onyomi(char));
					continue;
				}

				// If it's kana, convert it to katakana first and then add it to the list
				else if (Wanakana.isKana(char)) {
					readingList.push(Wanakana.toKatakana(char));
					continue;
				}
			}

			if (token.reading != readingList.join("")) {
				token.hasChanged = true;
			}

			token.han_reading = readingList.join("");
		}
	}
}

// Initial parsing step, and creates the first entry in the conversion matrix
function firstConversionStep(input) {
	
	let conversionStep = {};

	// Parse the input text and generate a token array
	conversionStep.tokenArray = getTokenizer().tokenize(input);
	console.log("Initial parse complete.");

	for (let token of conversionStep.tokenArray) {
		// display_form is what is shown to the client, so the original input
		// surface_form is preserved
		token.display_form = token.surface_form;

		// Language tag, used for typeface display purposes
		// Typefaces are swapped in CSS depending
		token.langDisplay = "ja";

		// Logs changes so that each step can be styled appropriately
		token.hasChanged = false;
	}

	console.log(conversionStep.tokenArray);

	conversionStep.hasChanged = false;
	conversionStep.stepDescription = "";

	return conversionStep;
}

// General handler for each subsequent step in the conversion pipeline
function nextConversionStep(matrix, operation, stepDesc) {

	let conversionStep = {};

	// Clone the last step forward, which will then be processed by whatever function the step uses
	conversionStep.tokenArray = structuredClone(matrix.at(-1).tokenArray);

	// Set all the changed flags of all the tokens to false
	for (let token of conversionStep.tokenArray) {	
		token.hasChanged = false;
	}

	// Run the provided operation on the current token array
	operation(conversionStep.tokenArray);

	// Check if the operation has changed anything
	conversionStep.hasChanged = arrayHasChanges(conversionStep.tokenArray);

	// Add the step name
	conversionStep.stepDescription = stepDesc;

	return conversionStep;
}

// Main conversion pipeline
function convertToHan(inputText) {

	console.log("Submitted: " + inputText);

	// Container for the entire process
	let conversionMatrix = [];

	// STEP 1: PARSE INPUT
	conversionMatrix.push(firstConversionStep(inputText));

	// STEP 2: UNCONJUGATE VERBS
	conversionMatrix.push(nextConversionStep(conversionMatrix, unconjugateVerbs, "Unconjugate verbs"));

	// STEP 3: MAXIMISE KANJI
	conversionMatrix.push(nextConversionStep(conversionMatrix, maximiseKanji, "Maximise kanji"));

	// STEP 4: PROCESS AUXILIARY VERBS
	conversionMatrix.push(nextConversionStep(conversionMatrix, convertAuxVerbs, "Process auxiliary verbs"));

	// STEP 5: SLICE VERBS
	conversionMatrix.push(nextConversionStep(conversionMatrix, sliceVerbs, "Slice verbs"));

	// STEP 6: SLICE ADJECTIVES
	conversionMatrix.push(nextConversionStep(conversionMatrix, sliceAdjectives, "Slice adjectives"));

	// STEP 7: REPLACE PARTICLES
	conversionMatrix.push(nextConversionStep(conversionMatrix, replaceParticles, "Replace particles"));

	// STEP 8: REPLACE VOCABULARY
	conversionMatrix.push(nextConversionStep(conversionMatrix, replaceVocabulary, "Replace vocabulary"));

	// STEP 9: ADD READINGS
	conversionMatrix.push(nextConversionStep(conversionMatrix, addReadingsToArray, "Add readings"));
	
	// STEP 10: CONVERT TO SIMPLIFIED
	conversionMatrix.push(nextConversionStep(conversionMatrix, convertArrayToSimplified, "Convert to Simplified Chinese"));

	// STEP 11: CONVERT KANA TO HANGUL
	conversionMatrix.push(nextConversionStep(conversionMatrix, hangulizeArray, "Convert kana to Hangul"));

	console.log(conversionMatrix)

	return conversionMatrix;
}

export default { arrayHasChanges, initialiseHanConverter, convertToHan }
