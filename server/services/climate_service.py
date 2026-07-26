import os
import pandas as pd

# -----------------------------
# Load Dataset
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "Indian_Climate_Dataset_2024_2025.csv"
)

df = pd.read_csv(DATASET_PATH)

# Clean column names
df.columns = df.columns.str.strip()

df["State"] = df["State"].astype(str).str.strip()
df["City"] = df["City"].astype(str).str.strip()

# Create Month column from Date
df["Date"] = pd.to_datetime(df["Date"])
df["Month"] = df["Date"].dt.month_name()


# -----------------------------
# Get States
# -----------------------------

def get_states():
    return sorted(df["State"].unique().tolist())


# -----------------------------
# Get Cities
# -----------------------------

def get_cities(state):
    cities = (
        df[df["State"] == state]["City"]
        .drop_duplicates()
        .sort_values()
        .tolist()
    )
    return cities


# -----------------------------
# Climate Data
# -----------------------------

def get_climate(state, city, month):

    result = df[
        (df["State"] == state)
        &
        (df["City"] == city)
        &
        (df["Month"].str.lower() == month.lower())
    ]

    if result.empty:
        return None

    return {
        "temperature": round(result["Temperature_Avg (°C)"].mean(), 2),
        "humidity": round(result["Humidity (%)"].mean(), 2),
        "rainfall": round(result["Rainfall (mm)"].mean(), 2)
    }