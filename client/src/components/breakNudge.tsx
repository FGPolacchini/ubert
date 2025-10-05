import { useState, useEffect } from "react";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

export default function TimedNudge({
	durationInit,
	durationLong,
	durationShort,
	maxTimeElapsed,
	setOnline,
}: {
	durationInit: number;
	durationLong: number;
	durationShort: number;
	maxTimeElapsed: number;
	setOnline: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [isNudgeVisible, setIsNudgeVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(durationInit);
	const [totalElapsed, setTotalElapsed] = useState(0);

	useEffect(() => {
		if (timeLeft <= 0) {
			setIsNudgeVisible(true);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
			setTotalElapsed((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	const handleLongTimer = () => {
		if (totalElapsed + durationLong > maxTimeElapsed) {
			setIsNudgeVisible(false);
			return;
		}
		setTimeLeft(durationLong);
		setIsNudgeVisible(false);
	};

	const handleShortTimer = () => {
		if (totalElapsed + durationShort > maxTimeElapsed) {
			setIsNudgeVisible(false);
			return;
		}
		setTimeLeft(durationShort);
		setIsNudgeVisible(false);
	};

	const handleCloseNudge = () => {
		setIsNudgeVisible(false);
		setOnline(false);
	};

	return (
		<Card className={"rounded-b-none " + (isNudgeVisible ? "flex" : "hidden")}>
			<CardHeader>
				<CardTitle>Consider taking a break</CardTitle>
				<CardDescription>
					You have been working for about {Math.round(totalElapsed / 360)} hours
					already.
				</CardDescription>
			</CardHeader>
			<CardFooter className="flex justify-end items-center gap-2">
				{totalElapsed < maxTimeElapsed && (
					<Button onClick={handleShortTimer} variant="secondary">
						Remind me later
					</Button>
				)}
				{totalElapsed < durationInit && (
					<Button onClick={handleLongTimer} variant="secondary" className="bg-red-500 hover:bg-red-600">
						Not now
					</Button>
				)}
				<Button onClick={handleCloseNudge} variant="secondary" className="bg-green-700 hover:bg-green-800">
					Break now
				</Button>
			</CardFooter>
		</Card>
	);
}
