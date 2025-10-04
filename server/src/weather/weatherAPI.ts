export interface Weather {
	temperature: number;
	name: string;
	windspeed: number;
	precipitation: number;
}  

export interface WeatherAPIResponse {
	location: {
		name: string;
	};  
	current: {
		temp_c: number;
		text: string;
		wind_kph: number;
		precip_mm: number;
	};  
}  

const base_url = "http://api.weatherapi.com/v1";

export async function fetchWeather(
	latitude: string,
	longitude: string,
	key: string
): Promise<Weather> {
	try {
		const location = `${latitude},${longitude}`;
		const url = `${base_url}/current.json?key=${key}&q=${location}`;
		const response: WeatherAPIResponse = await fetch(url).then((res) => {
			if (!res.ok) {
				throw new Error(`sWeather API error: ${res.statusText}`);
			}
			return res.json();
		});

		const weather: Weather = {
			temperature: response.current.temp_c,
			name: response.current.text,
			windspeed: response.current.wind_kph,
			precipitation: response.current.precip_mm,
		};

		return weather;
	} catch (err) {
		console.error((err as Error).message);
		throw err;
	}
}
