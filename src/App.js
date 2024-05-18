import { useEffect, useState, useContext, createContext, useRef } from 'react';
import classNames from 'classnames';
import './App.css';
import HanConverter from './lib/HanConverter';
import OutputTokenArray from './OutputTokenArray';

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
		setPlaceholderText("日本国旗の赤い丸は太陽を象徴している。歴史は面白いよね。");

		// Initialise the Han converter, and once done flag the converter as loaded
		HanConverter.initialiseHanConverter().then((value) => {
			setIsConverterLoaded(true)
		});

	// Defining dependencies, of which there aren't any, hence the empty array
	// This won't change, though, so it'll just run once on startup
	},[]);

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
									<button onClick={() => copyReadings(conversionMatrix.at(-1).tokenArray)} className="outputCopyBtn">Copy Readings</button>
									<button onClick={() => copyOutputText(conversionMatrix.at(-1).tokenArray)} className="outputCopyBtn">Copy Text</button>
								</div>
								<div className="tokenArrayOutput resultOutput">
									<OutputTokenArray tokens={conversionMatrix.at(-1).tokenArray} />
								</div>
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
