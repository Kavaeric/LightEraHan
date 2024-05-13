import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import kuromoji from "kuromoji/build/kuromoji"; // Japanese language parser
import * as OpenCC from "opencc-js"; // Chinese simplified-traditional converter
import Papa from "papaparse"; // CSV parser
import './App.css';
import OutputTokenArray from './OutputTokenArray';

function App() {

	// Container variable for tokenizer system
	const [tokenizer, setTokenizer] = useState(null);

	// Containers for dictionaries
	const [ctParticles, SetCTParticles] = useState(null);

	// Containers for the pipeline
	const [outputArrays, setOutputArrays] = useState(null); // Final output containing every step
	const [outputSteps, setOutputSteps] = useState(null); // Array of strings describing each step, for writing headers in the DOM
	const inputField = useRef(null);

	// Default placeholder text
	const [placeholderText, setPlaceholderText] = useState(null);

	// Will run any enclosed function when a dependency changes
	// This one has no dependencies so it'll run once on startup
	useEffect(() => {

		// Placeholder text, for when the text field is left empty
		setPlaceholderText("日本国旗の赤い丸は太陽を象徴している。歴史は面白いよね。");

		// Initialise the tokenizer
		kuromoji.builder({ dicPath: "kuromoji/dict/" }).build(function (error, _tokenizer) {
			if (error != null) {
				console.log(error);
			}

			// The tokenizer loads async, so some logic will be needed to check for initialisation
			setTokenizer(_tokenizer);
			console.log("Tokenizer initialised.");
			console.log("- - - - -");
		});

		// Conversion tables parsed from .CSVs
		Papa.parse("contables/particles.csv", {
			download: true,
			header: true,
			comments: "//",

			complete: function(result) {
				console.log("Parsed particles.csv");
				console.log(result);
				SetCTParticles(result.data);
			}
		});

		Papa.parse("contables/custom.csv", {
			download: true,
			header: true,
			comments: "//",

			complete: function(result) {
				console.log("Parsed custom.csv");
				console.log(result);
				SetCTParticles(result.data);
			}
		});

	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once
	},[]);

	// Whenever inputParse changes, log it
	useEffect(() => {
		console.log(outputArrays);
	},[outputArrays]);

	function highlightTokens(wordPosition) {
		console.log(wordPosition);
	}

	// Run this before every step
	function nextConversionStep(tokenArrays, pipelineStepArray, stepName) {
		// Clone the last step forward, which will then be processed by whatever function the step uses
		tokenArrays.push(structuredClone(tokenArrays.at(-1)));

		// Set all the changed flags of all the tokens to false
		for (let token of tokenArrays.at(-1)) {	
			token.hasChanged = false;
		}

		// TODO: There's probably a better way to do this since it's a top-level variable...
		pipelineStepArray.push(stepName);
	}

	// Handler for the "copy" button on each output row
	function copyOutputText(tokenArray) {
		let copiedText = tokenArray.map(token => token.display_form);
		navigator.clipboard.writeText(copiedText.join(""));
		console.log("Copied " + copiedText.join("") + " to clipboard.");
	}

	// Ditto, but compiles just the readings
	function copyReadings(tokenArray) {
		// Create an array of just the readings, falling back to the display form is none exists
		let copiedReadings = tokenArray.map(token => token.han_reading||token.display_form)
		
		// Using a full-width space as a delimiter
		navigator.clipboard.writeText(copiedReadings.join("　"));
		console.log("Copied " + copiedReadings.join("　") + " to clipboard.");
	}

	// Checks if an array has had any changes and returns a bool
	function arrayHasChanges(tokenArray) {
		let arrayHasChanged = false;

		// TODO: Probably a better way to do this
		for (let token of tokenArray) {
			if (token.hasChanged) {
				arrayHasChanged = true;
				break;
			}
		}

		return arrayHasChanged;
	}

	// Converts all characters in a token array simplfied characters
	function convertArrayToSimplified(tokenArray) {
		const converter = OpenCC.Converter({ from: 'jp', to: 'cn' });

		// Take each token's display form and run it through the converter
		for (let token of tokenArray) {	
			let newForm = converter(token.display_form);

			if (token.display_form != newForm) {
				token.display_form = newForm;
				token.hasChanged = true;
			}

			// Update the language display so the correct typefaces are used
			token.langDisplay = "zh-Hans";
		}
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

	function handleSubmit(event) {
		// The mark of a universe governed by an uncaring God
		event.preventDefault();
		console.log("- - - - -");

		if (!tokenizer) {
			console.log("Tokenizer not loaded!");
			return;
		}

		// This will be the overarching super-array that holds all the steps
		// At the end of the process the data will be pushed through to outputArrays
		let tokenArrays = [];
		let pipelineSteps = [];

		// Go with current.value; otherwise fallback to the placeholder
		let inputText = inputField.current.value||placeholderText;
		console.log("Submitted: " + inputText);

		// setInputParse(tokenizer.tokenize(inputText));
		tokenArrays[0] = tokenizer.tokenize(inputText);
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

		// This won't work as it won't update until next render
		// console.log(inputParse);
	}

	// DOM render
	return (
		<div className="appContainer">
		<div className="inputHeader">
			<form className="inputForm contain-width" onSubmit={handleSubmit}>
				<label className="inputTextLabel" htmlFor="inputText">Input Japanese text:</label>
				<textarea className="inputTextField" type="text" name="inputText" ref={inputField} placeholder={placeholderText} lang="ja" />
				<button className="inputTextSubmitBtn" type="submit" disabled={tokenizer === null}>Convert</button>
			</form>
		</div>

		<div className="output contain-width">
			<div className="outputStep">
				<div className="outputStepHeader">
					<h1>Initial parse</h1>
					<button onClick={() => copyOutputText(0)} className="outputCopyBtn" disabled={outputArrays === null}>Copy Text</button>
				</div>
				{
					outputArrays
						? <div className="tokenArrayOutput"><OutputTokenArray tokens={outputArrays[0]} /></div>
						: 'Enter some text above, then click the "convert" button.'
				}
			</div>

			{
				outputArrays
					// For every tokenArray in tokenArrays, create a new outputStep div with its own tokenArrayOutput class.
					? outputArrays.slice(1, -1).map((tokenArray, index) => 
						<div className={classNames(
							"outputStep", {"noChangesMade": !arrayHasChanges(tokenArray)})}
							key={index + 1}>
								
							<div className="outputStepHeader">
								<h1>Step {index + 1}: {outputSteps[index]}</h1>
								{!arrayHasChanges(tokenArray)
									? <span className="noChangesWarning">No changes in this step.</span>
									: ""
								}
								<button onClick={() => copyOutputText(tokenArray)} className="outputCopyBtn">Copy Text</button>
							</div>
							<div className="tokenArrayOutput" key={index + 1}>
								<OutputTokenArray tokens={tokenArray} />
							</div>
						</div>)
					// Otherwise, output nothing
					: ""
			}

			{
				// Final row with its own bespoke formatting and features
				outputArrays
					// For every tokenArray in tokenArrays, create a new outputStep div with its own tokenArrayOutput class.
					? <div className="outputStep">
							<div className="outputStepHeader">
								<h1>Final result</h1>
								<button onClick={() => copyReadings(outputArrays.at(-1))} className="outputCopyBtn">Copy Readings</button>
								<button onClick={() => copyOutputText(outputArrays.at(-1))} className="outputCopyBtn">Copy Text</button>
							</div>
							<div className="tokenArrayOutput resultOutput">
								<OutputTokenArray tokens={outputArrays.at(-1)} />
							</div>
						</div>
					// Otherwise, output nothing
					: ""
			}
		</div>
		</div>
	);
}

export default App;
