import classNames from "classnames";

export default function OutputToken ({token}) {

    // TODO: Move this from this file to App.js
    function unhighlightTokens() {
        // Remove the highlight from all other items
        const unhighlightTargets = document.getElementsByClassName("tokenOutput");

        // Remove the highlight class from all those items
        for (let outputToken of unhighlightTargets) {
            outputToken.classList.remove("tokenHighlighted");
        }
    }

    // This too
    function handleClick(event) {

        // If it's not highlighted, highlight it; otherwise, just unhighlight everything
        if (!event.target.classList.contains("tokenHighlighted")) {
            console.log("[" + token.word_position + "] " + token.surface_form);
            console.log(token);
            unhighlightTokens();

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
        <a className={
            classNames("tokenOutput", 
            {"tokenNoun": token.pos === "名詞" && token.pos_detail_1 != "固有名詞"}, // Excluding proper nouns
            {"tokenParticle": token.pos === "助詞"},
            {"tokenVerb": token.pos === "動詞"},
            {"tokenVerbAux": token.pos === "助動詞"},
            {"tokenInterjection": token.pos === "感動詞"},
            {"tokenAdjective": token.pos === "形容詞"},
            {"tokenSymbol": token.pos === "記号"})
            + " token_" + token.word_position}
            href="#" onClick={handleClick}>
        {token.surface_form}</a>
    );
}
