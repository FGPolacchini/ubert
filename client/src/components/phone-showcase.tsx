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
import { ChevronUp, Power } from "lucide-react";
import TimedNudge from "./breakNudge";

function Phone() {
	const [isOnline, setIsOnline] = useState(false);

	return (
		<Card className="max-h-3xl h-full max-w-xl w-full">
			<CardContent className="px-2.5 pt-4 pb-8 h-full">
				<div className="flex flex-col h-full relative overflow-hidden rounded-md">
					{isOnline && (
						<TimedNudge // params are in seconds
							durationInit={4}
							durationLong={4}
							durationShort={2}
							maxTimeElapsed={10}
							setOnline={setIsOnline}
						/>
					)}

					<div className="h-full">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
							onClick={() => setIsOnline(!isOnline)}
						>
							<Power className="w-4 h-4" />
						</Button>
					</div>

					<Drawer>
						<DrawerTrigger>
							<Button className="w-full justify-between rounded-none rounded-b-md">
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
							{/* <InsightsDataShowcase /> */}
							<DrawerFooter>
								<Button>Submit</Button>
								{/* <DrawerClose>
									<Button variant="outline">Cancel</Button>
								</DrawerClose> */}
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</CardContent>
		</Card>
	);
}

export default Phone;
