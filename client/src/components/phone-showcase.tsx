import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronUp, Power, PowerOff } from "lucide-react";
import TimedNudge from "./breakNudge";
import { goOffline, goOnline, type ShiftState } from "@/utils/sessionManagement";
import uberMapPic from "@/assets/uberMapPic.png";
import InsightsDataShowcase from "./insight-showcase";

function Phone({ sessionData }: { sessionData: ShiftState }) {
	const [isOnline, setIsOnline] = useState(false);

	return (
		<Card className="max-h-3xl h-full max-w-xl w-full">
			<CardContent className="px-2.5 pt-4 pb-8 h-full">
				<div className="flex flex-col h-full relative overflow-hidden">
					{isOnline && (
						<TimedNudge // params are in seconds
							durationInit={4}
							durationLong={4}
							durationShort={2}
							maxTimeElapsed={10}
							setOnline={setIsOnline}
						/>
					)}

					<div className="relative h-full bg-cover bg-center  overflow-hidden" 
						style={{ backgroundImage: `url(${uberMapPic})` }}
					>
						{!isOnline ? (
							<Button
								variant="secondary"
								size="icon"
								className="rounded-full absolute top-2 left-2"
								onClick={() => {
									goOnline(sessionData);
									setIsOnline(true);
								}}
							>
								<Power className="w-4 h-4" />
							</Button>
						) : (
							<Button
								variant="secondary"
								size="icon"
								className="rounded-full m-2"
								onClick={() => {
									goOffline(sessionData);
									setIsOnline(false);
								}}
							>
								<PowerOff className="w-4 h-4" />
							</Button>
						)}
					</div>

					<Drawer>
						<DrawerTrigger>
							<Button className="w-full justify-between rounded-none rounded-b-md" variant="outline">
								<ChevronUp className="w-8 h-8" />
								<h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
									{isOnline ? "You're online" : "You're offline"}
								</h4>
								<div
									className={
										"w-4 h-4 rounded-full " +
										(isOnline ? "bg-green-500" : "bg-red-500")
									}
								></div>
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Insights</DrawerTitle>
								<DrawerDescription>
									This information was last updated on
									{/* {#*#} */}
								</DrawerDescription>
							</DrawerHeader>
							<InsightsDataShowcase />
							<DrawerFooter>
								<Button>Submit</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</CardContent>
		</Card>
	);
}

export default Phone;
