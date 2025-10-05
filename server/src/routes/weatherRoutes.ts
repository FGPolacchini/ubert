import { Router } from "express";
import { fetchWeatherHourly, fetchWeatherNow } from "../weather/weatherAPI";

const weatherRoutes = Router();

/* Get request in order to receive weather information in the form of a json file
   This weather information is for the current weather
   I expect to receive a latitude and a longitude in the request body in order to track the location
   Hour has to be in 24h format
   Chat gpt was used here to solve a bug
 */
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

/* Get request in order to receive weather information in the form of a json file
   This weather information is for the weather at hour "hour" and day "day - 1" ex: day = 1 today
   I expect to receive a latitude, a longitude, an hour and a day in the request body in order to track the location and choose the time
   of the information
   Hour has to be in 24h format
*/
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
