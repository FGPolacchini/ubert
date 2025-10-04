import { ThemeProvider } from "@/components/theme-provider";
import { Card, CardDescription, CardHeader } from "./components/ui/card";
import { useState } from "react";
import type { SessionState } from "./utils/sessionManagement";
import Timer from "./components/breakNudge";

function App() {
	const [sessionData, useSessionData] = useState<SessionState>();

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="flex h-full w-full-p-8">
				<Card>
					<CardHeader>This is our app now</CardHeader>
					<CardDescription>More text just to be sure</CardDescription>
				</Card>
				<Timer
					durationInit={10}
					durationLong={8}
					durationShort={3}
					maxTimeElapsed={20}
				/>
			</div>
		</ThemeProvider>
	);
}

export default App;
