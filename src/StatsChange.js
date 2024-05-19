import "./StatsChange.css";
import classNames from "classnames";

export default function OutputStats ({beforeVal, afterVal}) {

    const change = afterVal - beforeVal;

    return(

        <span className={classNames(
            "change",
            {"up": change > 0},
            {"down": change < 0}
        )}>
            
            {
                change > 0
                ? "▲ "
                : ""
            }
            {
                change < 0
                ? "▼ "
                : ""
            }

            {change.toString().replace("-", "")}
        </span>

    );

}