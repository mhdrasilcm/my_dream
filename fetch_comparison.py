import json
from datetime import datetime

def generate_comparison():
    comparison_data = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M UTC"),
        "messi": {
            "name": "Lionel Messi",
            "goals": "917",
            "assists": "453",
            "matches": "1159",
            "ballondor": "8",
            "world_cups": "1"
        },
        "ronaldo": {
            "name": "Cristiano Ronaldo",
            "goals": "974",
            "assists": "307",
            "matches": "1325",
            "ballondor": "5",
            "world_cups": "0"
        }
    }
    
    with open('comparison.json', 'w', encoding='utf-8') as f:
        json.dump(comparison_data, f, indent=4)
        
    print("Comparison data updated successfully.")

if __name__ == "__main__":
    generate_comparison()