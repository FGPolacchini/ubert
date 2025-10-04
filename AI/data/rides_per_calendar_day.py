import pandas as pd
import itertools

df = pd.read_excel("tables/rides.xlsx")

df['start_time'] = pd.to_datetime(df['start_time'])

df['date'] = df['start_time'].dt.date
df['hour'] = df['start_time'].dt.hour

cities = df['city_id'].unique()
dates = df['date'].unique()
hours = range(24)  # 0 to 23

full_index = pd.DataFrame(list(itertools.product(cities, dates, hours)),
                          columns=['city_id', 'date', 'hour'])

trip_counts = df.groupby(['city_id', 'date', 'hour']).size().reset_index(name='trip_count')

trip_counts_full = pd.merge(full_index, trip_counts,
                            on=['city_id', 'date', 'hour'],
                            how='left').fillna(0)

trip_counts_full['trip_count'] = trip_counts_full['trip_count'].astype(int)

trip_counts_full.to_csv("tables/trip_counts_per_calendar_day.csv", index=False)
