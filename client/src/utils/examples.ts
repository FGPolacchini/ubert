import type { FinishedOrder, Order } from "@/components/order-popup";
import type { Trip } from "./sessionManagement";
import type { Output } from "@/components/insight-showcase";

const trips: Trip[] = [
    {
        tripId: "1",
        driverId: "ah26",
        customerId: "bh23",
        dist: 20.5,
        duration: 15,
        net_earnings: 20,
        tips: 2.5
    },
    {
        tripId: "2",
        driverId: "bg14",
        customerId: "kl53",
        dist: 11.3,
        duration: 8,
        net_earnings: 9.15,
        tips: 0
    },
    {
        tripId: "3",
        driverId: "le40",
        customerId: "vm91",
        dist: 6.2,
        duration: 9,
        net_earnings: 6.32,
        tips: 12
    }
];

const requests: Order[] = [
    {
        pickupLat: 51.99978699587479,
        pickupLon: 4.377662012735309,
        dropOffLat: 52.10077130189961,
        dropOffLon: 4.264082103493096,
        fareEst: 20,
        customerId: "bh23"
    },
    {
        pickupLat: 52.00737306908044,
        pickupLon: 4.356348106754281,
        dropOffLat: 51.95155557162648,
        dropOffLon: 4.433629723397761,
        fareEst: 9.15,
        customerId: "kl53"
    },
    {
        pickupLat: 51.99941756742183,
        pickupLon: 4.375813685546373,
        dropOffLat: 52.02936526305035,
        dropOffLon: 4.359501834062614,
        fareEst: 6.32,
        customerId: "vm91"
    }
];

const orderTrip: FinishedOrder[] = [
    {
        originalOrder: {
            pickupLat: 51.99978699587479,
            pickupLon: 4.377662012735309,
            dropOffLat: 52.10077130189961,
            dropOffLon: 4.264082103493096,
            fareEst: 20,
            customerId: "bh23"
        },
        finishedTrip: {
            tripId: "1",
            driverId: "ah26",
            customerId: "bh23",
            dist: 20.5,
            duration: 15,
            net_earnings: 20,
            tips: 2.5
        },
    },
    {
        originalOrder: {
            pickupLat: 52.00737306908044,
            pickupLon: 4.356348106754281,
            dropOffLat: 51.95155557162648,
            dropOffLon: 4.433629723397761,
            fareEst: 9.15,
            customerId: "kl53"
        },
        finishedTrip: {
            tripId: "2",
            driverId: "bg14",
            customerId: "kl53",
            dist: 11.3,
            duration: 8,
            net_earnings: 9.15,
            tips: 0
        },
    },
    {
        originalOrder: {
            pickupLat: 51.99941756742183,
            pickupLon: 4.375813685546373,
            dropOffLat: 52.02936526305035,
            dropOffLon: 4.359501834062614,
            fareEst: 6.32,
            customerId: "vm91"
        },
        finishedTrip: {
            tripId: "3",
            driverId: "le40",
            customerId: "vm91",
            dist: 6.2,
            duration: 9,
            net_earnings: 6.32,
            tips: 12
        },
    },
];

const exampleOutputs: Output[] = [
    // logging in / refreshing at 7 am on a rainy Monday day
    {
        customer_demand: "On Mondays most customer demand will be between 7:30 am and 9 am.";
	    weather: "It will rain the entire day today, with a thunderstorm at 2 pm.";
	    traffic: "Expect a traffic jam near Rotterdam Centrum between 9 am and 11:30 am.";
	    incentives: "This week you will get 10% extra earnings driving in Rotterdam Feijenoord!";
    }
    // REFRESHING at 9 am on a rainy Monday day (same as the one above)
    {
        customer_demand: "The customer demand will decrease after 9:30 am.";
	    weather: "It will rain the entire day today, but the thunderstorm will only be at 5 pm.";
	    traffic: "Expect some light traffic from now until 11:30 am near Rotterdam Centrum.";
	    incentives: "This week you will get 10% extra earnings driving in Rotterdam Feijenoord!";
    }
    // logging in / refreshing at 6 pm on a cloudy Friday day
    {
        customer_demand: "On Fridays expect more tips from 9 pm to 10:30 pm.";
	    weather: "There should be no rain, just a bit of cloudiness and gusts of wind around 8 pm.";
	    traffic: "Traffic in your area should get lighter after 7 pm";
	    incentives: "This weekend you will get 15% extra earnings driving in Rotterdam Zuid!";
    }
]


export {trips, requests, orderTrip, exampleOutputs};