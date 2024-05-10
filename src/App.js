import logo from './logo.svg';
import './App.css';
import kuromoji from "kuromoji/build/kuromoji";
import { useEffect, useState, useRef } from 'react';
import OutputTokenArray from './OutputTokenArray';

function App() {

	// Container variable for tokenizer system
	const [tokenizer, setTokenizer] = useState(null);
	const [inputParse, setInputParse] = useState(null);
	const inputField = useRef(null);

	// Will run any enclosed function when a dependency changes
	// For most cases that's on startup
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
	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once
	},[]);

	// Whenever inputParse changes, log it
	useEffect(() => {
		console.log(inputParse);
	},[inputParse]);

	function handleSubmit(event) {

		// The mark of a universe governed by an uncaring God
		event.preventDefault();

		if (!tokenizer) {
			console.log("Tokenizer not loaded!");
			return;
		}

		// Go with current.value if null; otherwise fallback to the placeholder
		let inputText = inputField.current.value||inputField.current.placeholder;
		setInputParse(tokenizer.tokenize(inputText));

		console.log("Submitted: " + inputText);
		
		console.log("Initial parse complete.");

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
				<h1>Initial parse</h1>
				{
					inputParse
						? <OutputTokenArray tokens={inputParse} />
						: <div className="tokenArrayOutput">No input. Enter some text, and then click the "convert" button.</div>
				}
			</div>
		</div>
		</div>
	);
}

export default App;
