import pandas as pd
import json

df = pd.read_csv("tables/trip_counts_per_day_of_the_week.csv")

all_rows = []
for _, row in df.iterrows():
    all_rows.append({
        "input": f"city_id: {row['city_id']}, day_of_week: {row['day_of_week']}, hour: {row['hour']}",
        "output": str(row['trip_count'])
    })

with open("tables/classification_dataset.jsonl", "w") as f:
    for r in all_rows:
        f.write(json.dumps(r) + "\n")
