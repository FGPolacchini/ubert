//Interface for 

export interface Weather {
	temperature: number;
	name: string;
	windspeed: number;
	precipitation: number;
}  

export interface WeatherHourly {
	time: string; 
	wind_kph: number;
	cloud: string; // cloud coverage as percentage
	will_it_rain: boolean;
	will_it_snow: boolean;
	chance_of_rain: number;
	chance_of_snow: number;
	snow_cm: number;
	vis_km: number;
	precip_mm: number;
}  

export interface WeatherAPIResponse {
	location: {
		name: string;
	};  
	current: {
		temp_c: number;
		condition: {
			text: string;
		}
		wind_kph: number;
		precip_mm: number;
	};  
}  

export interface WeatherAPIResponseHourly {
	location: {
		name: string;
	};  
	forecast: {
		forecastday: Array<{
			day: Record<string,unknown>;
			astro: Record<string,unknown>;
			hour: Array<{
				time: string;
				wind_kph: number;
				cloud: string;
				will_it_rain: boolean;
				will_it_snow: boolean;
				chance_of_rain: number;
				chance_of_snow: number;
				snow_cm: number;
				vis_km: number;
				precip_mm: number;
			}>;
		}>;
	};  
} 

const base_url = "http://api.weatherapi.com/v1";

/*
	Makes a call to a weather API that returns a json. This json file is parsed into a promise made out of an object created using the
	Weather interface.
	The latitude and longitude parameters are used to know for which location we should receive weather data
	The key is used to access the api
	Chat GPT was used here in order to know how to use fetch and for the idea of using interfaces to give type to the json data
*/
export async function fetchWeatherNow(
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
			name: response.current.condition.text,
			windspeed: response.current.wind_kph,
			precipitation: response.current.precip_mm,
		};

		return weather;
	} catch (err) {
		console.error((err as Error).message);
		throw err;
	}
}

export async function fetchWeatherHourly(
	latitude: string,
	longitude: string,
	hour: number,
	dayy: number,
	key: string
): Promise<WeatherHourly> {
	try {
		hour = hour % 24;
		const location = `${latitude},${longitude}`;
		const url = `${base_url}/forecast.json?key=${key}&q=${location}&days=${dayy}`;
		const response: WeatherAPIResponseHourly = await fetch(url).then((res) => {
			if (!res.ok) {
				throw new Error(`sWeather API error: ${res.statusText}`);
			}
			return res.json();
		});
		const day = response.forecast.forecastday[dayy-1];
		const hourData = day.hour[hour];
		const weather: WeatherHourly = {
			time: hourData.time,
			wind_kph: hourData.wind_kph,
			cloud: hourData.cloud,
			will_it_rain: hourData.will_it_rain,
			will_it_snow: hourData.will_it_snow,
			chance_of_rain: hourData.chance_of_rain,
			chance_of_snow: hourData.chance_of_snow,
			snow_cm: hourData.snow_cm ?? 0,
			vis_km: hourData.vis_km,
			precip_mm: hourData.precip_mm,
		};

		return weather;
	} catch (err) {
		console.error((err as Error).message);
		throw err;
	}
}
