import numpy as np
import pandas as pd

np.random.seed(42)


def round_budget_realistically(value):
    """Round the budget to look like real-world tender amounts."""
    base = int(value // 1000000) * 1000000
    remainder = value % 1000000

    if remainder < 250000:
        rounded = base
    elif remainder < 750000:
        rounded = base + 500000
    else:
        rounded = base + 1000000

    return rounded


def generate_realistic_dataset_with_fraud_mix(n_samples=500, fraud_ratio=0.3):
    data = []

    terrain_multipliers = {
        "Flat": 1.0,
        "Mixed": 1.1,
        "Coastal": 1.15,
        "Mountainous": 1.3,
        "Desert": 1.05
    }

    slope_multipliers = {
        "Low": 1.0,
        "Moderate": 1.1,
        "High": 1.25
    }

    base_cost_per_lane = {
        "Autoroute": (1200000, 1500000),
        "National": (800000, 1200000),
        "Regional": (500000, 800000),
        "Provincial": (300000, 600000)
    }

    n_fraud = int(n_samples * fraud_ratio)
    n_legit = n_samples - n_fraud

    for label in [0]*n_legit + [1]*n_fraud:
        category = np.random.choice(["Autoroute", "National", "Regional", "Provincial"])
        road_class = "Primary" if category in ["Autoroute", "National"] else "Secondary"

        if category == "Autoroute":
            lanes = 4
        elif category == "National":
            lanes = np.random.choice([2, 2, 2, 4])
        elif category == "Regional":
            lanes = np.random.choice([1, 2])
        else:
            lanes = 1

        road_width = lanes * 3.5
        total_length_km = int(np.random.uniform(30, 250))

        terrain = np.random.choice(list(terrain_multipliers.keys()))
        slope = np.random.choice(list(slope_multipliers.keys()))
        soil = np.random.choice(["Sandy", "Clay", "Rocky"])

        # Company Profile
        if category in ["Provincial", "Regional"] and total_length_km < 100:
            experience = np.random.randint(1, 10)
            similar_projects = np.random.randint(0, 5)
            employees = np.random.randint(30, 200)
            engineers = np.random.randint(1, max(2, employees // 50))
            machinery = np.random.randint(3, max(5, employees // 20))
        else:
            experience = np.random.randint(5, 30)
            similar_projects = np.random.randint(3, 10)
            employees = np.random.randint(200, 1000)
            engineers = np.random.randint(3, max(5, employees // 50))
            machinery = np.random.randint(5, max(10, employees // 15))

        # Calculate Estimated Budget
        base_min, base_max = base_cost_per_lane[category]
        base_cost = np.random.uniform(base_min, base_max)

        estimated_budget = (
            total_length_km * lanes * base_cost *
            terrain_multipliers[terrain] *
            slope_multipliers[slope]
        )
        estimated_budget = round_budget_realistically(estimated_budget)

        # Compliance Issues
        if label == 1:
            compliance_issues = np.random.choice([2, 3])
        else:
            compliance_issues = np.random.choice([0, 1], p=[0.8, 0.2])

        # Technical Score
        if label == 1:
            technical_score = round(np.random.uniform(30, 55), 2)
        else:
            technical_score = round(np.random.uniform(70, 100), 2)

        # Proposed Duration
        proposed_duration = int(total_length_km * np.random.uniform(2, 6))

        # Offered Budget Logic
        if label == 1:
            offered_budget = estimated_budget * np.random.choice(
                [np.random.uniform(0.5, 0.7), np.random.uniform(1.3, 1.6)]
            )
        else:
            offered_budget = estimated_budget * np.random.uniform(0.9, 1.1)

        offered_budget = round_budget_realistically(offered_budget)

        # Financial Score
        financial_score = round(np.clip((estimated_budget / offered_budget) * 100, 0, 100), 2)
        budget_ratio = round(
            (offered_budget - estimated_budget) / estimated_budget, 4
        )

        data.append({
            "application_id": len(data) + 1,
            "company_experience_years": experience,
            "previous_similar_projects": similar_projects,
            "total_employees": employees,
            "engineers_count": engineers,
            "machinery_count": machinery,
            "offered_budget_MAD": offered_budget,
            "estimated_budget_MAD": estimated_budget,
            "budget_difference_ratio": budget_ratio,
            "proposed_duration_days": proposed_duration,
            "total_length_km": total_length_km,
            "road_width_m": int(road_width),
            "lanes": lanes,
            "category": category,
            "road_class": road_class,
            "terrain_type": terrain,
            "soil_type": soil,
            "slope": slope,
            "compliance_issues_count": compliance_issues,
            "technical_score": technical_score,
            "financial_score": financial_score,
            "is_fraudulent": label
        })

    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Shuffle the rows to mix fraud and non-fraud
    df = df.sample(frac=1).reset_index(drop=True)

    return df


# ✅ Generate the dataset
df = generate_realistic_dataset_with_fraud_mix(10000)

# ✅ Save to CSV
df.to_csv("road_contractor_applications_rounded_clean.csv", index=False)

# ✅ Check the fraud distribution and preview
print(df['is_fraudulent'].value_counts())
print(df.head())
