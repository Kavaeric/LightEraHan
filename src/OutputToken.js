import { useContext } from 'react';
import classNames from "classnames";
import { SelectedTokenContext, SetSelectedTokenContext, StepContext} from "./App";

export default function OutputToken ({token}) {

    // selectedToken is the context that tracks the currently user-selected token
    // Comes in the form of an array, [step index, token.word_position]
    const selectedToken = useContext(SelectedTokenContext);
    const setSelectedToken = useContext(SetSelectedTokenContext);

    // Current step the token is associated with
    // Comes in the form of an array, [step index, total number of steps]
    const step = useContext(StepContext);

    // On click, do the highlighting stuff
    function handleClick() {
        // If the selected token is, in fact, this one; just unset the selected token
        if (selectedToken[0] === step[0] && selectedToken[1] === token.word_position) {
            setSelectedToken([0, 0]);
        } else {
            setSelectedToken([step[0], token.word_position]);
            console.log(`[${step[0]}, ${token.word_position}] ${token.display_form}`);
            console.log(token);
        }
    }

    return (
        // Style the token depending on its content
        <button className={
            classNames("tokenOutput", 
            {"tokenNoun": token.pos === "名詞" && token.pos_detail_1 !== "固有名詞"}, // Excluding proper nouns
            {"tokenParticle": token.pos === "助詞"},
            {"tokenVerb": token.pos === "動詞"},
            {"tokenVerbAux": token.pos === "助動詞"},
            {"tokenInterjection": token.pos === "感動詞"},
            {"tokenAdjective": token.pos === "形容詞"},
            {"tokenSymbol": token.pos === "記号"},
            {"tokenUnknown": token.word_type === "UNKNOWN"},
            {"tokenHasChanged": token.hasChanged},
            // Highlights if this same token is selected in another row
            {"tokenHighlighted": token.word_position === selectedToken[1]},
            // Highlights if this exact token is selected
            {"tokenHighlightedMain": token.word_position === selectedToken[1] && step[0] === selectedToken[0]},
            "token_" + token.word_position)}
            onClick={handleClick}
            lang={token.langDisplay}>

            {
                // Check if there is a custom Han reading assigned and if this is the last step in the sequence
                token.han_reading
                    ? <span className="tokenRuby">{token.han_reading}</span>
                    : ""
            }

            <span className="tokenDisplayForm">{token.display_form}</span>
        </button>
    );
}
