import ChineseConverter from "./ChineseConverter"; // Simplified-Traditional Chinese converter
import { getTokenizer, buildTokenizer } from "./Kuromoji"; // Kuromoji parser
import { parseConTables } from "./ConversionTables";

// Initial setup
export function initialiseHanConverter() {
	return Promise.all([
		// Wait for the tokenizer to load
		buildTokenizer(),

		// Wait for the conversion tables to load
		parseConTables()
	])
}

// Checks if an array has had any changes and returns a bool
export function arrayHasChanges(tokenArray) {
	let arrayHasChanged = false;

	for (let token of tokenArray) {
		if (token.hasChanged) {
			arrayHasChanged = true;
			break;
		}
	}

	return arrayHasChanged;
}

// Replace particles
function replaceParticles(tokenArray) {
	// TODO
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

// Adds the han_reading property to all tokens in the array, which gets displayed as ruby.
// Currently using a placeholder function that just copies the existing reading info, which produces funny results with the de-conjugator
function addReadingsToArray(tokenArray) {
	for (let token of tokenArray) {
		// Exclude symbols/punctuation
		if (token.pos != "記号") {
			token.han_reading = token.pronunciation;
		}
	}
}

// Initial parsing step
function firstConversionStep(matrix, input) {
	
	let conversionStep = {};

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

// Main conversion function
export function convertToHan(inputText) {

	console.log("Submitted: " + inputText);

	// Container for the entire process
	let conversionMatrix = [];

	// STEP 0: PARSE INPUT
	conversionMatrix.push(firstConversionStep(conversionMatrix, inputText));

	// STEP 1: Replace particles
	conversionMatrix.push(nextConversionStep(conversionMatrix, replaceParticles, "Replace particles"));

	// STEP 2: Unconjugate verbs
	conversionMatrix.push(nextConversionStep(conversionMatrix, unconjugateVerbs, "Unconjugate verbs"));

	// STEP 3: CONVERT TO SIMPLIFIED
	conversionMatrix.push(nextConversionStep(conversionMatrix, convertArrayToSimplified, "Convert to Simplified Chinese"));

	// FINAL: ADD READINGS
	conversionMatrix.push(nextConversionStep(conversionMatrix, addReadingsToArray, "Add readings"));

	console.log(conversionMatrix)

	return conversionMatrix;
}


/*function oldconvertToHan(inputText) {
	// This will be the overarching super-array that holds all the steps
	// At the end of the process the data will be pushed through to outputArrays
	let tokenArrays = [];
	let pipelineSteps = [];

	// Go with current.value; otherwise fallback to the placeholder
	console.log("Submitted: " + inputText);

	// setInputParse(tokenizer.tokenize(inputText));
	tokenArrays[0] = getTokenizer().tokenize(inputText);
	console.log("Initial parse complete.");
	
	// Adding new keys allows the rest of the kuromoji token properties to be preserved
	for (let token of tokenArrays[0]) {
		// display_form is what is shown to the client, so the original input
		// surface_form is preserved
		token.display_form = token.surface_form;

		// Language tag, used for typeface display purposes
		// Typefaces are swapped in CSS depending
		token.langDisplay = "ja";

		// Logs changes so that each step can be styled appropriately
		token.hasChanged = false;
	}
	console.log(tokenArrays[0]);

	// STEP 1: REPLACE PARTICLES
	nextConversionStep(tokenArrays, pipelineSteps, "Replace particles");
	// then run a function that modifies tokenArrays.at(-1)

	// STEP 2: UNCONJUGATE VERBS
	nextConversionStep(tokenArrays, pipelineSteps, "Unconjugate verbs");
	unconjugateVerbs(tokenArrays.at(-1));

	// STEP 3: CONVERT TO SIMPLIFIED
	nextConversionStep(tokenArrays, pipelineSteps, "Use Simplified Chinese");
	convertArrayToSimplified(tokenArrays.at(-1));

	// FINAL STEP, processing readings etc
	nextConversionStep(tokenArrays, pipelineSteps, "Adding readings information");
	addReadingsToArray(tokenArrays.at(-1));

	// Push the final results to the appropriate containers for render
	setOutputArrays(tokenArrays);
	setOutputSteps(pipelineSteps);
}*/

/*const [outputSteps, setOutputSteps] = useState([]); // Array of strings describing each step, for writing headers in the DOM

const [outputArrays, setOutputArrays] = useState(null); // Final output containing every step
// Run this before every step*/
