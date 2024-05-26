export function KANA_TO_HANGUL() {
	// Temporary function that converts an array of kana into kana-hangul key dictionary pairs

	let consList = "s z".split(" ");
	let consJamo = "ㅅㅈ".split("");

	let vowelList = "aiueo".split("");
	let vowelJamo = "ㅏㅣㅜㅔㅗ".split("");
	// let vowelJamo = "ㅑㅣㅠㅖㅛ".split("");

	let conversionDict = {};

	for (let consonant of consList) {
		for (let vowel of vowelList) {

			let newKana = Wanakana.toHiragana(consonant + vowel, { useObsoleteKana: true }).trim();
			let newHangul = HangulJS.assemble(consJamo[consList.indexOf(consonant)] + vowelJamo[vowelList.indexOf(vowel)]);

			conversionDict[newKana] = newHangul;
		}
	}

	console.log(conversionDict);
}