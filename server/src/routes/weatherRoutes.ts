import { Router } from "express";
import { fetchWeather } from "../weather/weatherAPI";

const weatherRoutes = Router();

// I expect to receive a latitude and a longitude in the request body

weatherRoutes.get("/info/:latitude/:longitude", (req, res) => {
	try {
		const latitude = req.params.latitude;
		const longitude = req.params.longitude;
		const weather = fetchWeather(
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

export default weatherRoutes;
