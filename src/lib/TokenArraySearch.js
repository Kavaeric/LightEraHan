// Returns true if the given token matches the entry's search criteria
function tokenMatchesLookupEntry(token, lookupEntry) {

    // Iterate through all the keys in that entry
    for (let key in lookupEntry) {

		// If the key is null, ignore it
		if (!lookupEntry[key]) {
			continue;
		}

		// Ignore the replacement fields; we're not using those as search criteria
		if (key.substring(0, 4) === "new_") {
			continue;
		}

		// If a token's key doesn't match the entry key's value, stop the function and return false
		if (token[key] !== lookupEntry[key]) {
			return false;
		}
	}
	
	// Assuming we've come this far, that means all the keys in lookupEntry match the keys in token
	return true; 
}

// Will return the first entry in the lookup table that matches the token
function findMatchingEntry(token, lookup) {

    // Begin by iterating through all the entries in the lookup table
    for (let lookupEntry of lookup) {

		// Returns the first entry if a match is found
		if (tokenMatchesLookupEntry(token, lookupEntry)) {
			return lookupEntry;
		}
    }
	
	// If no matching entry can be found, then code will reach this point
	// In which case, there's no matching token
	return false;
}

// Replaces all of token's key values with their equivalents in lookupEntry starting with new_
function tokenReplaceWithNewValues(token, lookupEntry) {

	for (let key in lookupEntry) {

		// Ignore anything that isn't a new_ key
		if (key.substring(0, 4) !== "new_") {
			continue;
		}

		token[key.substring(4)] = lookupEntry[key];
	}
}

// Finds the token in the given lookup table, and changes its display_form if a match is found
export function matchAndReplaceAll(tokenArray, lookup) {

	for (let token of tokenArray) {

		const matchingEntry = findMatchingEntry(token, lookup);

		// If there's no matching entry, move to the next item
		if (!matchingEntry) {
			continue;
		}

		// If there is a matching entry
		// console.log(`Replacing ${token.display_form} with ${matchingEntry.new_display_form}`);
		tokenReplaceWithNewValues(token, matchingEntry);
		token.hasChanged = true;
		token.changeCount++;
	}
}
