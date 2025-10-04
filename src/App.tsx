import { ThemeProvider } from "@/components/theme-provider";
//import { Card, CardDescription, CardHeader } from "./components/ui/card";
import { useState } from "react";
import Timer from "./components/breakNudge"
import type { SessionState } from "./utils/sessionManagement";

function App() {
	const [sessionData, useSessionData] = useState<SessionState>();'-'

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Timer durationInit={10} durationLong={8} durationShort={3} maxTimeElapsed={20}></Timer>
		</ThemeProvider>
	);
}

export default App;
