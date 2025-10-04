import pandas as pd

rides_df = pd.read_excel("tables/rides.xlsx")
weather_df = pd.read_excel("tables/weather.xlsx")

rides_df['start_time'] = pd.to_datetime(rides_df['start_time'])
rides_df['date'] = rides_df['start_time'].dt.date
weather_df['date'] = pd.to_datetime(weather_df['date']).dt.date

merged_df = pd.merge(rides_df, weather_df, on=['city_id', 'date'], how='left')

trips_per_day = (
    merged_df.groupby(['city_id', 'date', 'weather'])
    .size()
    .reset_index(name='trip_count')
)

avg_trips_per_weather = (
    trips_per_day.groupby('weather')['trip_count']
    .mean()
    .reset_index(name='avg_trips_per_day')
)

avg_trips_per_weather.to_csv("tables/avg_trips_per_weather.csv", index=False)
