import "./StatsChange.css";
import classNames from "classnames";

export default function OutputStats ({beforeVal, afterVal}) {

	const change = afterVal - beforeVal;
	const percentChange = 100 * (change / beforeVal);
	const changeClass = classNames(
		"change",
		{"up": change > 0},
		{"down": change < 0}
	)

	return(
		<span className="statsChangeWrapper">
			{
				(change !== 0)
					?
						<>
						<span className={changeClass}>

							{change > 0 ? "+" : ""}{percentChange.toFixed(1)}%

						</span>

						<span className={changeClass}>
							
							{ change > 0 ? "▲ " : "" }
							{ change < 0 ? "▼ " : "" }

							{change.toString().replace("-", "")}
						</span>
						</>
					: <span className={changeClass}>-</span>
			}
		</span>
	);

}