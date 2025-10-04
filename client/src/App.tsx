import { ThemeProvider } from "@/components/theme-provider";
import { Card, CardDescription, CardHeader } from "./components/ui/card";
import { useState } from "react";
import type { SessionState } from "./utils/sessionManagement";

function App() {
	const [sessionData, useSessionData] = useState<SessionState>();'-'

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Card>
				<CardHeader>This is our app now</CardHeader>
				<CardDescription>More text just to be sure</CardDescription>
			</Card>
		</ThemeProvider>
	);
}

export default App;
