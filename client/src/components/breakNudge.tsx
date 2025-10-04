import { useState, useEffect } from "react";

export default function Timer({
	durationInit,
	durationLong,
	durationShort,
	maxTimeElapsed,
}: {
	durationInit: number;
	durationLong: number;
	durationShort: number;
	maxTimeElapsed: number;
}) {
	const [timeLeft, setTimeLeft] = useState(durationInit);
	const [showPopup, setShowPopup] = useState(false);
	const [totalElapsed, setTotalElapsed] = useState(0);
	const [isLocked, setIsLocked] = useState(false);

	useEffect(() => {
		if (timeLeft <= 0) {
			setShowPopup(true);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
			setTotalElapsed((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	useEffect(() => {
		if (totalElapsed >= maxTimeElapsed) {
			setIsLocked(true);
			setShowPopup(false);
		}
	}, [totalElapsed, maxTimeElapsed]);

	const hours = Math.floor(timeLeft / 3600);
	const minutes = Math.floor((timeLeft % 3600) / 60);
	const seconds = Math.floor(timeLeft % 60);

	const handleNewTimer = () => {
		if (totalElapsed + durationLong > maxTimeElapsed) {
			setIsLocked(true);
			setShowPopup(false);
			return;
		}
		setTimeLeft(durationLong);
		setShowPopup(false);
	};

	const handleShortTimer = () => {
		if (totalElapsed + durationShort > maxTimeElapsed) {
			setIsLocked(true);
			setShowPopup(false);
			return;
		}
		setTimeLeft(durationShort);
		setShowPopup(false);
	};

	const handleClosePopup = () => {
		setShowPopup(false);
	};

	return (
		<div
			style={{ textAlign: "center", fontFamily: "monospace", fontSize: "2rem" }}
		>
			<h2>Countdown Timer</h2>

			{isLocked ? (
				<div style={{ color: "red", fontWeight: "bold" }}>
					⛔ Time limit reached. You cannot restart the timer.
				</div>
			) : (
				<div>
					{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
					{String(seconds).padStart(2, "0")}
				</div>
			)}

			{/* Custom popup overlay */}
			{showPopup && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 999,
					}}
				>
					<div
						style={{
							background: "white",
							padding: "2rem",
							borderRadius: "1rem",
							boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
							textAlign: "center",
							width: "300px",
						}}
					>
						<h3>⏰ Time’s up!</h3>
						<p>What would you like to do?</p>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem",
							}}
						>
							<button
								onClick={handleNewTimer}
								style={{
									padding: "0.5rem",
									borderRadius: "0.5rem",
									background: "#4CAF50",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								Start New Timer ({durationLong}s)
							</button>
							<button
								onClick={handleShortTimer}
								style={{
									padding: "0.5rem",
									borderRadius: "0.5rem",
									background: "#2196F3",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								Restart Short Timer ({durationShort}s)
							</button>
							<button
								onClick={handleClosePopup}
								style={{
									padding: "0.5rem",
									borderRadius: "0.5rem",
									background: "#f44336",
									color: "white",
									border: "none",
									cursor: "pointer",
								}}
							>
								Close Popup
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
