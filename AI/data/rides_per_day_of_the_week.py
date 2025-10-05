import pandas as pd
import itertools

df = pd.read_excel("tables/rides.xlsx")

df['start_time'] = pd.to_datetime(df['start_time'])

df['day_of_week'] = df['start_time'].dt.dayofweek
df['hour'] = df['start_time'].dt.hour

cities = df['city_id'].unique()
days = range(7)
hours = range(24)
full_index = pd.DataFrame(list(itertools.product(cities, days, hours)),
                          columns=['city_id', 'day_of_week', 'hour'])

trip_counts_week = df.groupby(['city_id', 'day_of_week', 'hour']).size().reset_index(name='trip_count')

trip_counts_week_full = pd.merge(full_index, trip_counts_week,
                                 on=['city_id', 'day_of_week', 'hour'],
                                 how='left').fillna(0)

trip_counts_week_full['trip_count'] = trip_counts_week_full['trip_count'].astype(int)

trip_counts_week_full.to_csv("tables/trip_counts_per_day_of_the_week.csv", index=False)
