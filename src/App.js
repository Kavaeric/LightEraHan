import logo from './logo.svg';
import './App.css';
import kuromoji from "kuromoji/build/kuromoji";
import { useEffect, useState, useRef } from 'react';
import OutputTokenArray from './OutputTokenArray';
import Papa from "papaparse";

function App() {

	// Container variable for tokenizer system
	const [tokenizer, setTokenizer] = useState(null);

	// Containers for dictionaries
	const [ctParticles, SetCTParticles] = useState(null);

	// Containers for the pipeline
	const [outputArrays, setOutputArrays] = useState(null); // Final output containing every step
	const [outputSteps, setOutputSteps] = useState(null); // Array of strings describing each step, for writing headers in the DOM
	const inputField = useRef(null);

	// Will run any enclosed function when a dependency changes
	// This one has no dependencies so it'll run once on startup
	useEffect(() => {

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

	// Handler for the "copy" button on each output row
	function copyOutputText(outputIndex) {
		let copiedText = outputArrays[outputIndex + 1].map(token => token.display_form);
		navigator.clipboard.writeText(copiedText.join(""));
		console.log("Copied " + copiedText.join("") + " to clipboard.");
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

		// Go with current.value if null; otherwise fallback to the placeholder
		let inputText = inputField.current.value||inputField.current.placeholder;
		console.log("Submitted: " + inputText);

		// setInputParse(tokenizer.tokenize(inputText));
		tokenArrays[0] = tokenizer.tokenize(inputText);
		console.log("Initial parse complete.");
		
		// Add a new key called "display form". This is what will be shown in the client
		// and allows the rest of the kuromoji token properties to be preserved
		for (let token of tokenArrays[0]) {
			token.display_form = token.surface_form;
		}
		console.log(tokenArrays[0]);

		// STEP 1: REPLACE PARTICLES
		tokenArrays.push(structuredClone(tokenArrays[0]));
		// then run a function that modifies tokenArrays.at(-1)
		pipelineSteps.push("Replace particles");

		// STEP 2: REMOVE TENSES
		tokenArrays.push(structuredClone(tokenArrays[0]));
		// then run a function that changes all verbs to show their basic form
		pipelineSteps.push("Remove tenses");

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
			<form className="inputForm" onSubmit={handleSubmit}>
				<label className="inputTextLabel" htmlFor="inputText">Input Japanese text:</label>
				<input className="inputTextField" type="text" name="inputText" ref={inputField} placeholder="ねえ、私の言っている事が分かる？" />
				<button className="inputTextSubmitBtn" type="submit" disabled={tokenizer === null}>Convert</button>
			</form>
		</div>

		<div className="output">
			<div className="outputStep">
				<div className="outputStepHeader">
					<h1>Initial parse</h1>
					<button onClick={() => copyOutputText(0)} className="outputCopyBtn" disabled={outputArrays === null}>Copy</button>
				</div>
				<div className="tokenArrayOutput">
				{
					outputArrays
						? <OutputTokenArray tokens={outputArrays[0]} />
						: <div className="tokenArrayOutput">No input. Enter some text, and then click the "convert" button.</div>
				}
				</div>
			</div>

			{
				outputArrays
					// For every tokenArray in tokenArrays, create a new outputStep div
					// with its own tokenArrayOutput class.
					? outputArrays.slice(1).map((tokenArray, index) => 
						<div className="outputStep" key={index}>
							<div className="outputStepHeader">
								<h1>Step {index + 1}: {outputSteps[index]}</h1>
								<button onClick={() => copyOutputText(index)} className="outputCopyBtn">Copy</button>
							</div>
							<div className="tokenArrayOutput" key={index}>
								<OutputTokenArray tokens={outputArrays[index]} />
							</div>
						</div>)
					// Otherwise, output nothing
					: ""
			}
		</div>
		</div>
	);
}

export default App;
