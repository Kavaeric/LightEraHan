import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Importing Source Han Sans
// Yeah, these are huge, blame them for not providing individual weights in WOFF/2 format
// Funnily enough the individual weight OTFs are larger than these combined variable ones lol
import "./fonts/SourceHanSansHWSC-VF.otf.woff2";
import "./fonts/SourceHanSansHW-VF.otf.woff2";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<div className="pageContainer">
	<React.StrictMode>
		<App />
	</React.StrictMode>

	<div className="footer">
		<div className="footerAbout contain-width">
			<h1>About</h1>
			
			<div>
				<p>Made by me, <a href="https://bsky.app/profile/kavaeric.net">Kavaeric</a>, for my Light Era project.</p>
				<p>Han is a pseudolanguage I use in my worldbuilding project that's meant to match the aesthetics of CJK language and permit the use of CJK typography, but also as a means to express my own diasporic background and inability to read my own native languages.</p>

				<p>Special thanks to:</p>
				<ul>
					<li><a href="https://bark.zone/">Parse</a>, who does games and software dev tutoring.</li>
					<li><a href="https://aiktb.dev/">aiktb</a>, who wrote about <a href="https://aiktb.dev/blog/better-kuromoji-fork">Kuromoji.js</a> and was very kind in helping me out debug this.</li>
				</ul>
			</div>

			<div>
				<h2>Japanese</h2>
				<ul>
					<li><a href="https://github.com/takuyaa/kuromoji.js">Kuromoji.js</a>: Japanese morphological parser/tokenizer</li>
					<li><a href="https://wanakana.com/">Wanakana</a>: General Japanese language utilities</li>
					<li><a href="https://kanji.js.org/">Kanji.js</a>: Kanji lookup library</li>
				</ul>

				<h2>Chinese</h2>
				<ul>
					<li><a href="https://github.com/nk2028/opencc-js">OpenCC-JS</a>: Chinese character converter</li>
					<li><a href="https://www.npmjs.com/package/chinese-stroke">Chinese-Stroke</a>: Chinese stroke counts</li>
				</ul>

				<h2>Korean</h2>
				<ul>
					<li><a href="https://github.com/junseublim/hangeul-js">Hangeul-JS</a>: General Hangul toolkit</li>
				</ul>
				
				<h2>CJK</h2>
				<ul>
					<li><a href="https://github.com/adobe-fonts/source-han-sans/">Source Han Sans</a>: Pan-CJK typeface library</li>
				</ul>

				<h2>Other</h2>
				<ul>
					<li>Built using <a href="https://react.dev/">React</a></li>
					<li><a href="https://www.papaparse.com/">PapaParse</a>: .CSV parser</li>
				</ul>
			</div>

			<div>
				<a href="https://github.com/Kavaeric/LightEraHan" className="buttonLink">GitHub</a>
			</div>
		</div>
	</div>
	</div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
