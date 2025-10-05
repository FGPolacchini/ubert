import { Router } from "express";
import { fetchWeatherHourly, fetchWeatherNow } from "../weather/weatherAPI";

const weatherRoutes = Router();

// I expect to receive a latitude and a longitude in the request body
// Hour has to be in 24h format

weatherRoutes.get("/info/:latitude/:longitude", (req, res) => {
	try {
		const latitude = req.params.latitude;
		const longitude = req.params.longitude;
		const weather = fetchWeatherNow(
			latitude,
			longitude,
			process.env.WEATHER_API_KEY!
		).then(
			(resolved) => {
				res.json(resolved);
			},
			(resolved) => {
				throw new Error("Json conversion from API not successful");
			}
		);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});

weatherRoutes.get("/info/hourly/:latitude/:longitude/:hour/:day", (req, res) => {
	try {
		const latitude = req.params.latitude;
		const longitude = req.params.longitude;
		const hour = req.params.hour;
		const day = req.params.day;
		const dayValue = day ?? "1";
		const weather = fetchWeatherHourly(
			latitude,
			longitude,
			+hour,
			+dayValue,
			process.env.WEATHER_API_KEY!
		).then(
			(resolved) => {
				res.json(resolved);
			},
			(resolved) => {
				throw new Error("Json conversion from API not successful");
			}
		);
	} catch (err) {
		res.status(500).json({ error: (err as Error).message });
	}
});



export default weatherRoutes;
