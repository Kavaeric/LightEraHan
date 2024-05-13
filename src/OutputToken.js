import classNames from "classnames";

export default function OutputToken ({token}) {

    // TODO: Move this from this file to App.js
    function unhighlightTokens() {
        // Remove the highlight from all other items
        const unhighlightTargets = document.getElementsByClassName("tokenOutput");

        // Remove the highlight class from all those items
        for (let outputToken of unhighlightTargets) {
            outputToken.classList.remove("tokenHighlighted");
            outputToken.classList.remove("tokenHighlightedMain");
        }
    }

    // This too
    function handleClick(event) {

        // If it's not highlighted, highlight it; otherwise, just unhighlight everything
        if (!event.target.classList.contains("tokenHighlightedMain")) {
            console.log("[" + token.word_position + "] " + token.display_form);
            console.log(token);
            unhighlightTokens();

            // Add the focus token highlight to itself
            event.target.classList.add("tokenHighlightedMain");

            // Find all other tokens with the same token "ID"
            const highlightTargets = document.getElementsByClassName("token_" + token.word_position);
            
            // Add the highlighted token class
            for (let outputToken of highlightTargets) {
                outputToken.classList.add("tokenHighlighted");
            }
        } else {
            unhighlightTokens();
        }
    }

    return (
        // Style the token depending on its content
        <button className={
            classNames("tokenOutput", 
            {"tokenNoun": token.pos === "名詞" && token.pos_detail_1 != "固有名詞"}, // Excluding proper nouns
            {"tokenParticle": token.pos === "助詞"},
            {"tokenVerb": token.pos === "動詞"},
            {"tokenVerbAux": token.pos === "助動詞"},
            {"tokenInterjection": token.pos === "感動詞"},
            {"tokenAdjective": token.pos === "形容詞"},
            {"tokenSymbol": token.pos === "記号"},
            {"tokenUnknown": token.word_type === "UNKNOWN"},
            {"tokenHasChanged": token.hasChanged})
            + " token_" + token.word_position}
            onClick={handleClick}
            lang={token.langDisplay}>

            {
                // Check if there is a custom Han reading assigned
                token.han_reading
                    ? <span className="tokenRuby">{token.han_reading}</span>
                    : ""
            }

            <span className="tokenDisplayForm">{token.display_form}</span>
        </button>
    );
}
