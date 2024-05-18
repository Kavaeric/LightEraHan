import ChineseConverter from "./ChineseConverter"; // Simplified-Traditional Chinese converter
import { getTokenizer, buildTokenizer } from "./Kuromoji"; // Kuromoji parser
import ConversionTables from "./ConversionTables";
import { matchAndReplaceAll } from "./TokenArraySearch";

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
function arrayHasChanges(tokenArray) {

	for (let token of tokenArray) {
		if (token.hasChanged) {
			return true;
		}
	}

	return false
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

// Converts all the verbs in a token array into their non-conjugated (basic) form
function unconjugateVerbs(tokenArray) {
	for (let token of tokenArray) {	
		if (token.pos === "動詞" && token.display_form != token.basic_form) {
			token.display_form = token.basic_form;
			token.hasChanged = true;
		}
	}
}

// Converts all characters in a token array simplfied characters
function convertArrayToSimplified(tokenArray) {

	// Take each token's display form and run it through the converter
	for (let token of tokenArray) {	
		let newForm = ChineseConverter(token.display_form);

		if (token.display_form != newForm) {
			token.display_form = newForm;
			token.hasChanged = true;
		}

		// Update the language display so the correct typefaces are used
		token.langDisplay = "zh-Hans";
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
// Currently using a placeholder function that just copies the existing reading info, which produces funny results with the de-conjugator
function addReadingsToArray(tokenArray) {
	for (let token of tokenArray) {

		// Exclude symbols/punctuation and anything with an existing han_reading
		if (token.pos != "記号" && !token.han_reading) {
			token.han_reading = token.pronunciation;
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

	// STEP 2: REPLACE PARTICLES
	conversionMatrix.push(nextConversionStep(conversionMatrix, replaceParticles, "Replace particles"));

	// STEP 3: UNCONJUGATE VERBS
	conversionMatrix.push(nextConversionStep(conversionMatrix, unconjugateVerbs, "Unconjugate verbs"));

	// STEP 4: MAXIMISE KANJI
	conversionMatrix.push(nextConversionStep(conversionMatrix, maximiseKanji, "Maximise kanji"));

	// STEP 5: CONVERT TO SIMPLIFIED
	conversionMatrix.push(nextConversionStep(conversionMatrix, convertArrayToSimplified, "Convert to Simplified Chinese"));

	// FINAL: ADD READINGS
	conversionMatrix.push(nextConversionStep(conversionMatrix, addReadingsToArray, "Add readings"));

	console.log(conversionMatrix)

	return conversionMatrix;
}

export default { arrayHasChanges, initialiseHanConverter, convertToHan }
