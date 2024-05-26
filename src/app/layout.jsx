// Description metadata stuff goes here
export const metadata = {
	title: "Han Converter",
	description: "Convert from Japanese to the fictional Light Era psuedolanguage, han."
}

// A Next.js App Router application must include a root layout file
// which is a React Server Component that wraps all pages in the app
// Next.js handles things like charset and viewport, and any files in this app directory are
// automatically added, meaning we don't have to do any <link>s to things like icons

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<meta name="theme-color" content="#000000" />

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet" />
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root">{ children }</div>
			</body>
		</html>
	)
}
