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
	DialogClose,
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
	updateSessionState,
	type ShiftState,
} from "@/utils/sessionManagement";
import uberMapPic from "@/assets/uberMapPic.png";
import InsightsDataShowcase, { type Insights } from "./insight-showcase";
import { getExampleInsights, getExampleTrips } from "@/utils/examples";

function Phone({
	sessionData,
	latestInsights,
}: {
	sessionData: ShiftState;
	latestInsights: Insights | null;
}) {
	const [isOnline, setIsOnline] = useState(false);
	const [isWorking, setIsWorking] = useState(false);
	const [currOrder, setCurrOrder] = useState(-1);

	const exampleOutputs = getExampleInsights();
	const exampleTrips = getExampleTrips();

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
											onClick={() => {
												setCurrOrder((prev) => (prev + 1) % 3);
											}}
										>
											<PlusCircle className="w-4 h-4" />
										</Button>
									</DialogTrigger>
								</>
							)}
						</div>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>New order in your area</DialogTitle>
								<DialogDescription>
									{/* process #*# Order data */}
								</DialogDescription>
							</DialogHeader>
							<DialogClose asChild>
								<Button
									className="w-full bg-green-400 hover:bg-green-500"
									variant="secondary"
									onClick={() => {
										setIsWorking(true);
									}}
								>
									Accept
								</Button>
							</DialogClose>
						</DialogContent>
					</Dialog>

					{isWorking && (
						<Button
							className="rounded-none w-full bg-green-400 hover:bg-green-500"
							onClick={() => {
								setIsWorking(false);
								updateSessionState(sessionData, exampleTrips[currOrder]);
							}}
						>
							End current Trip
						</Button>
					)}

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
							<InsightsDataShowcase
								examples={exampleOutputs}
								index={currOrder}
							/>
						</DrawerContent>
					</Drawer>
				</div>
			</CardContent>
		</Card>
	);
}

export default Phone;
