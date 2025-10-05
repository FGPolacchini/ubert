import type { Trip } from "@/utils/sessionManagement";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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

function OrderDialog() {
  return (
		<Dialog>
			<DialogTrigger>Open</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}

export default OrderDialog