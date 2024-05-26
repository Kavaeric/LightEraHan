// A client component, which gets prerendered to HTML server-side before being sent
// to the, well, client
'use client'
 
import React from 'react'
import dynamic from 'next/dynamic'

// Disable server pre-rendering on everything
const App = dynamic(() => import('../../App'), { ssr: false })
 
export function ClientOnly() {
  return (
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
  )
}
