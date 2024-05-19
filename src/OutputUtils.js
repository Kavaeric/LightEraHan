import "./OutputUtils.css";
import * as Wanakana from "wanakana";
import * as MatrixUtils from "./lib/MatrixUtils";
import StatsChange from "./StatsChange";

export default function OutputStats ({matrix}) {

	const firstArray = matrix[0].tokenArray;
	const lastArray = matrix.at(-1).tokenArray;

	return (
		<div className="outputStats">

		<div className="outputStatsHeader">
			<h1>Output statistics</h1>
		</div>

		<div className="outputStatsCell generalStats">
			<table>
				<tbody>
					<tr>
						<td>Steps processed</td>
						<td>{matrix.length - 1}</td>
					</tr>

					<tr>
						<td>Changes made</td>
						<td>{MatrixUtils.countChangesInMatrix(matrix)}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div className="outputStatsCell beforeAfter">
			<table>
				<thead><tr>
					<th />
					<th>Before</th>
					<th>After</th>
					<th>Change</th>
				</tr></thead>

				<tbody>
				<tr>
					<td>Tokens</td>
					<td>{firstArray.length}</td>
					<td>{lastArray.length}</td>
					<td><StatsChange beforeVal={firstArray.length}
									 afterVal={lastArray.length}/></td>
				</tr>

				<tr>
					<td>Characters</td>
					<td>{MatrixUtils.countCharsInArray(firstArray)}</td>
					<td>{MatrixUtils.countCharsInArray(lastArray)}</td>
					<td><StatsChange beforeVal={MatrixUtils.countCharsInArray(firstArray)}
									 afterVal={MatrixUtils.countCharsInArray(lastArray)}/></td>
				</tr>

				<tr>
					<td>Syllables</td>
					<td>{MatrixUtils.countSyllablesInArray(firstArray)}</td>
					<td>{MatrixUtils.countSyllablesInArray(lastArray)}</td>
					<td><StatsChange beforeVal={MatrixUtils.countSyllablesInArray(firstArray)}
									 afterVal={MatrixUtils.countSyllablesInArray(lastArray)}/></td>
				</tr>
				</tbody>
			</table>
		</div>

		</div>
	)
}


