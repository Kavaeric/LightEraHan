import { useContext } from "react";
import OutputToken from "./OutputToken";
import TokenStyles from "./OutputTokens.css";
import TokenStylesFinal from "./OutputTokensFinal.css";

import { StepContext} from "../app/App";
import classNames from "classnames";

export default function OutputTokenArray ({tokens, final = false}) {

    // Current step the array is associated with
    // Comes in the form of an array, [step index, total number of steps]
    const step = useContext(StepContext);

    return (
        <div className={classNames(
            "tokenArrayOutput",
            {finalResult: final},
            TokenStyles.root,
            TokenStylesFinal.root
        )}>
            {tokens.map((token, index) => <OutputToken token={token} key={index} />)}
        </div>
    )
}
