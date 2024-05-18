import * as OpenCC from "opencc-js"; // Chinese simplified-traditional converter

// Initialise the converter
const converter = OpenCC.Converter({ from: 'jp', to: 'cn' });

// The converter itself will throw an exception if given a null string as input
// This is annoying when trying to debug stuff, so a try...catch is needed
function convertToSimplified (inputText) {

    try {
        return converter(inputText);
    }
    catch (error) {
        console.log(error);
        return(inputText);
    }
}

export default convertToSimplified;
