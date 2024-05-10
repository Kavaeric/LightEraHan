import OutputToken from "./OutputToken";

export default function OutputTokenArray ({tokens}) {
    return (
        tokens.map((token, index) => <OutputToken token={token} key={index} />)
    )
}
