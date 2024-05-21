import * as HangulJS from "hangeul-js";
import * as Wanakana from "wanakana";
import { kanaToSyllables } from "./JapaneseUtils";

import kanaHangulDict from "./kanaHangul.json";

// Handles any kana digraphs that aren't map-able to Hangul
function handleDigraphs (token, nextChar) {

	let newTokenStr = "";

	for (let char of token) {

		// If it's a normal character in the lookup table, convert it
		if (char in kanaHangulDict) {
			newTokenStr += kanaHangulDict[char];
		}
		else {
			switch (char) {
				// Use the next character if it's a consonant doubler
				case "っ":
					newTokenStr += nextChar;
					break;
		
				// Handle the "n" syllable
				case "ん":
					newTokenStr += "ㄴ";
					break;
		
				default:
					console.log(`Character ${char} in ${token.join("")} could not be processed`);
					newTokenStr += char;
			}
		}
	}

	let newToken = HangulJS.disassemble(newTokenStr);
	return newToken;
}

// Main kana conversion function
function kanaToHangul(input) {

	let syllables = kanaToSyllables(Wanakana.toHiragana(input, {passRomaji: true} ));
	
	// First convert all the syllables that can be easily mapped to Hangul
	let jamoList = syllables.map(syllable => 
		
		syllable in kanaHangulDict
			? HangulJS.disassemble(kanaHangulDict[syllable])
			: syllable.split("")
	
	);

	// Anything left that isn't a Hangul character is going to be something that ends in っ or ん
	// Pass it through the handleDigraphs function
	jamoList = jamoList.map((syllable, index) =>
		
		syllable.at(-1) === "っ" || syllable.at(-1) === "ん"
			? handleDigraphs(syllable, jamoList[index+1][0])
			: syllable

	);

	// Finally, assemble everything to Hangul
	let hangulOutput = jamoList.map(token => HangulJS.assemble(token)).join("");

	// console.log(`kanaToHangul: Converted ${input} to ${hangulOutput}`);
	return hangulOutput;
}

export default { kanaToHangul };
