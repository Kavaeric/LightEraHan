import { useEffect, useState, createContext, useRef } from "react";
import classNames from "classnames";
import HanConverter from "../lib/HanConverter";
import OutputTokenArray from "../component/OutputTokenArray";
import OutputStats from "../component/OutputStats";
import * as MatrixUtils from "../lib/MatrixAnalyse";

import styles from "./App.css";

// For token highlighting
// Stores the word_position value of a selected token
export const SelectedTokenContext = createContext();
export const SetSelectedTokenContext = createContext();

// For identifying which step, which can then be used to pinpoint a single token
export const StepContext = createContext();

function App() {

	// True/false state for if the tokenizer's loaded or not
	const [isConverterLoaded, setIsConverterLoaded] = useState(false);

	// Final conversion matrix
	const [conversionMatrix, setConversionMatrix] = useState([]);

	// Containers for the pipeline
	const inputField = useRef(null);

	// Default placeholder text
	const [placeholderText, setPlaceholderText] = useState(null);

	// For token highlighting, get/set what's currently highlighted
	const [selectedToken, setSelectedToken] = useState([0, 0]);

	// Will run any enclosed function when a dependency changes
	// This one has no dependencies so it'll run once on startup
	useEffect(() => {

		// Placeholder text, for when the text field is left empty
		setPlaceholderText("この宇宙には知的生命体が存在するのはまず間違いないと思うが、その生命体が地球に来る可能性は殆ど無し。");

		// Initialise the Han converter, and once done flag the converter as loaded
		HanConverter.initialiseHanConverter().then((value) => {
			setIsConverterLoaded(true)
		});

	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once on startup
	},[]);

	// Handler for the "copy" button on each output row
	function copyOutputText(tokenArray) {
		copyToClipboard(MatrixUtils.getArrayText(tokenArray));
	}

	// General copy function
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text);
		console.log("Copied " + text + " to clipboard.");
	}

	function handleSubmit(event) {
		// The mark of a universe governed by an uncaring God
		event.preventDefault();
		console.log("- - - - -");

		setSelectedToken([0, 0]);
		setConversionMatrix(HanConverter.convertToHan(inputField.current.value||placeholderText));

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
				<button className="inputTextSubmitBtn" type="submit" disabled={!isConverterLoaded}>Convert</button>
			</form>
		</div>

		{/* Anything within these tags can access these context values/functions */}
		<SelectedTokenContext.Provider value={selectedToken}>
		<SetSelectedTokenContext.Provider value={setSelectedToken}>
			<div className="output contain-width">
				<div className="outputStep">
					<div className="outputStepHeader">
						<h1>Initial parse</h1>
						<button onClick={() => copyOutputText(conversionMatrix[0].tokenArray)} className="outputCopyBtn" disabled={!isConverterLoaded}>Copy Text</button>
					</div>
					{
						conversionMatrix.length > 0
							? 	<StepContext.Provider value={[0, conversionMatrix.length]}>
								<div className="tokenArrayOutput"><OutputTokenArray tokens={conversionMatrix[0].tokenArray} /></div>
								</StepContext.Provider>
							: 'Enter some text above, then click the "convert" button.'
					}
				</div>
				
				{
					conversionMatrix.length > 0
						// For every tokenArray in tokenArrays, create a new outputStep div with its own tokenArrayOutput class.
						? conversionMatrix.slice(1).map((conversionStep, index) => 
							<StepContext.Provider value={[index + 1, conversionMatrix.length]} key={index + 1}>
							<div className={classNames(
								"outputStep", {"noChangesMade": !HanConverter.arrayHasChanges(conversionStep.tokenArray)})}
								key={index + 1}>
									
								<div className="outputStepHeader">
									<h1>Step {index + 1}: {conversionMatrix[index + 1].stepDescription}</h1>
									{!HanConverter.arrayHasChanges(conversionStep.tokenArray)
										? <span className="noChangesWarning">No changes in this step.</span>
										: ""
									}
									<button onClick={() => copyOutputText(conversionStep.tokenArray)} className="outputCopyBtn">Copy Text</button>
								</div>
								<div className="tokenArrayOutput" key={index + 1}>
									<OutputTokenArray tokens={conversionStep.tokenArray} />
								</div>
							</div>
							</StepContext.Provider>)
						// Otherwise, output nothing
						: ""
				}

				{
					// Final row with its own bespoke formatting and features
					conversionMatrix.length > 0
						// For every tokenArray in tokenArrays, create a new outputStep div with its own tokenArrayOutput class.
						? 	<StepContext.Provider value={[conversionMatrix.length - 1, conversionMatrix.length]}>
							<div className="outputStep showRuby">
								<div className="outputStepHeader">
									<h1>Final result</h1>
									<button onClick={() => copyOutputText(conversionMatrix.at(-1).tokenArray)} className="outputCopyBtn">Copy Text</button>
								</div>
								<div className="tokenArrayOutput resultOutput">
									<OutputTokenArray tokens={conversionMatrix.at(-1).tokenArray} />
								</div>
								<div className="finalStepButtons">
									<button onClick={() => copyToClipboard(MatrixUtils.getJAReading(conversionMatrix.at(-1).tokenArray))} className="finalCopyBtn">Copy JA Readings</button>
									<button onClick={() => copyToClipboard(MatrixUtils.getCNReading(conversionMatrix.at(-1).tokenArray))} className="finalCopyBtn">Copy CN Readings</button>
									<button onClick={() => copyToClipboard(MatrixUtils.getKRReading(conversionMatrix.at(-1).tokenArray))} className="finalCopyBtn">Copy KR Readings</button>
								</div>
								<OutputStats matrix={conversionMatrix} />
							</div>
							</StepContext.Provider>
						// Otherwise, output nothing
						: ""
				}
			</div>
		</SetSelectedTokenContext.Provider>
		</SelectedTokenContext.Provider>
		</div>
	);
}

export default App;
