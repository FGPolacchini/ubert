import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { getEmptyState, type ShiftState } from "./utils/sessionManagement";
import Phone from "./components/phone-showcase";
import type { Insights } from "./components/insight-showcase";

function App() {
	const [sessionData, setSessionData] = useState<ShiftState>(getEmptyState());
	const [latestInsights, setLatestInsights] = useState<Insights | null>(null);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="flex justify-around items-center h-full w-full gap-4 py-8">
				<Phone sessionData={sessionData} latestInsights={latestInsights} />
			</div>
		</ThemeProvider>
	);
}

export default App;
