import "./ToggleSwitch.css";

export default function ToggleSwitch({switchName, switchHandler, switchLabel = "Switch"}) {
	return (
		<label className="switch" htmlFor={switchName}>
			<input type="checkbox" id={switchName} name={switchName} onChange={switchHandler} />
			<span className="switchRunner"><span className="slider"></span></span>
			<span className="switchText">{switchLabel}</span>
		</label>
	)
}
