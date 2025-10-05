export interface ShiftState {
	driverId: string;
	totalDistance: number;
	totalEarnings: number;
	totalTips: number;
	totalTimeSpent: number;
	requestsCompleted: number;
	lastSeenOn: Date; //used for check if break
	shiftStarted: Date; //used for checking shift work time
	sessionStarted: Date; //used for checking session work time
}

export interface Trip {
	tripId: string;
	driverId: string;
	riderId: string;
	dist: number;
	duration: number; //saved in minutes
	// mult: number;
	net_earnings: number;
	tips: number;
}

/**
 * Get default clear state for new shift
 * @returns New shift state object
 */
export function getEmptyState(): ShiftState {
	const now = new Date();
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday.setHours(0, 0, 1, 0);

	return {
		driverId: "",
		totalDistance: 0,
		totalEarnings: 0,
		totalTips: 0,
		totalTimeSpent: 0,
		requestsCompleted: 0,
		lastSeenOn: yesterday,
		shiftStarted: now,
		sessionStarted: now,
	};
}

/**
 * Proccesses shift data and:
 * -if a break updates the session time to 0 to signal the start of a new session
 * -if not a break returns new shift data
 * @param shiftData the data to be checked when going online
 * @returns if returning from a break the same shift with updated data, else new shift data
 */
export function goOnline(shiftData: ShiftState): ShiftState {
	//check if brake
	//if break, update session time
	//if not break, new state
	const currentTime = new Date();
	const isBreak = checkIfBreak(shiftData.lastSeenOn, currentTime);
	if (isBreak) {
		shiftData.sessionStarted = currentTime;
		return shiftData;
	} else {
		return {
			driverId: shiftData.driverId,
			totalDistance: 0,
			totalEarnings: 0,
			totalTips: 0,
			totalTimeSpent: 0,
			requestsCompleted: 0,
			lastSeenOn: currentTime,
			shiftStarted: currentTime,
			sessionStarted: currentTime,
		};
	}
}

/**
 * Updates the necessary fields when driver goes offline.
 * @param shiftData the data to be processed
 * @returns an updated SessionState (for now just the lastSeenOn is updated)
 */
export function goOffline(shiftData: ShiftState): ShiftState {
	const currentTime = new Date();
	shiftData.lastSeenOn = currentTime;
	return shiftData;
}

/**
 * Function used for updating the state in the current active session after completing a trip.
 * @param currState the data in the current active session
 * @param trip the data from the completed trip
 * @returns the updated state after the trip
 */
export function updateSessionState(
	currState: ShiftState,
	trip: Trip
): ShiftState {
	currState.totalDistance += trip.dist;
	currState.totalEarnings += trip.net_earnings;
	currState.totalTips += trip.tips;
	currState.totalTimeSpent += trip.duration;
	currState.requestsCompleted += 1;
	return currState;
}

/**
 * Checks if driver was on a break or this is a different shift.
 * @param lastDate the last known date online
 * @param currDate the date came online again
 * @returns true if driver was on a break, false if it was a full shift change
 */
export function checkIfBreak(lastDate: Date, currDate: Date): boolean {
	if (
		lastDate.getFullYear() === currDate.getFullYear() &&
		lastDate.getMonth() === currDate.getMonth() &&
		lastDate.getDay() === currDate.getDay()
	) {
		//the two dates are in the same day
		//so check for 8 Hr difference
		const [hours, minutes] = getTimeDifference(currDate, lastDate);
		if (hours > 8 || (hours === 8 && minutes > 0)) {
			return false; //not a break
		}
		return true; //it was a break
	} else {
		const [hours, minutes] = getTimeDifference(currDate, lastDate);
		if (hours > 3 || (hours === 3 && minutes > 0)) {
			return false; //not on a break
		}
		return true; //was a break
	}
}

/**
 * Calculates the difference in hours and minutes
 * between two dates (assumed to be in the same day).
 * @param firstDate the date to subtract from
 * @param secondDate the date to be subtracted from
 * @returns difference in hours and minutes
 */
export function getTimeDifference(
	firstDate: Date,
	secondDate: Date
): [number, number] {
	const milliDif: number = firstDate.getTime() - secondDate.getTime();
	const seconds = Math.floor(milliDif / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const remMinutes = minutes % 60;

	return [hours, remMinutes];
}
