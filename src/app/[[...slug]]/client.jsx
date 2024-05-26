// A client component, which gets prerendered to HTML server-side before being sent
// to the, well, client
'use client';
 
import React from "react";
import dynamic from "next/dynamic";
import { StaticFooter } from "./StaticFooter";

// Disable server pre-rendering on everything
const App = dynamic(() => import('../App'), { ssr: false });
 
export function ClientOnly() {
	return (
		<div className="pageContainer">
		<React.StrictMode>
			<App />
		</React.StrictMode>

		<StaticFooter />
		</div>
	)
}
