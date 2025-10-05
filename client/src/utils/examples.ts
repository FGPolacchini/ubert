import type { Trip, Request } from "./sessionManagement";

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

const requests: Request[] = [
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

export {trips, requests};