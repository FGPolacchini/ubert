import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronUp, PlusCircle, Power, PowerOff } from "lucide-react";
import TimedNudge from "./breakNudge";
import {
	goOffline,
	goOnline,
	type ShiftState,
} from "@/utils/sessionManagement";
import uberMapPic from "@/assets/uberMapPic.png";
import InsightsDataShowcase, { type Insights } from "./insight-showcase";

function Phone({
	sessionData,
	latestInsights,
}: {
	sessionData: ShiftState;
	latestInsights: Insights | null;
}) {
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

					<Dialog>
						{/* this is the map and the on/off switch */}
						<div
							className="relative h-full bg-cover bg-center  overflow-hidden"
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
								<>
									<Button
										variant="secondary"
										size="icon"
										className="rounded-full absolute top-2 left-2"
										onClick={() => {
											goOffline(sessionData);
											setIsOnline(false);
										}}
									>
										<PowerOff className="w-4 h-4" />
									</Button>

									<DialogTrigger>
										<Button
											variant="secondary"
											size="icon"
											className="rounded-full absolute top-2 right-2"
										>
											<PlusCircle className="w-4 h-4" />
										</Button>
									</DialogTrigger>
								</>
							)}
						</div>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete
									your account and remove your data from our servers.
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>

					<Drawer>
						<DrawerTrigger>
							<Button
								className="w-full justify-between rounded-none rounded-b-md"
								variant="outline"
							>
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
									{latestInsights !== null
										? "This information was last updated on " +
										  new Intl.DateTimeFormat("en-GB", {
												dateStyle: "medium",
												timeStyle: "short",
										  }).format(latestInsights.generatedOn)
										: "You currently have no insights from our side, uBert will do better next time!"}
								</DrawerDescription>
							</DrawerHeader>
							<InsightsDataShowcase />
						</DrawerContent>
					</Drawer>
				</div>
			</CardContent>
		</Card>
	);
}

export default Phone;
