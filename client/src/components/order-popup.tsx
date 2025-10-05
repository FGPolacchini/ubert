import type { Trip } from "@/utils/sessionManagement";

export interface Order {
	customerId: string;
	pickupLat: number;
	pickupLon: number;
	dropOffLat: number;
	dropOffLon: number;
	fareEst: number;
}

export interface FinishedOrder {
	originalOrder: Order;
	finishedTrip: Trip;
}
