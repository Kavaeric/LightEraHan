import classNames from "classnames";

export default function OutputToken ({token}) {
    return (
        <span className={
            classNames("tokenOutput", 
            {"tokenParticle": token.pos === "助詞"})}>
        {token.surface_form}</span>
    );
}
