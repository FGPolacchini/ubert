import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import type { SessionState } from "./utils/sessionManagement";
import Phone from "./components/phone-showcase";

function App() {
	const [sessionData, useSessionData] = useState<SessionState>();

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="flex justify-around items-center h-full w-full gap-4 py-8">
				<Phone />
			</div>
		</ThemeProvider>
	);
}

export default App;
