import json

def generate_achievements():
    achievements = [
        {
            "count": "8",
            "title": "Ballon d'Or",
            "description": "Record winner of the most prestigious individual award (2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023)."
        },
        {
            "count": "6",
            "title": "European Golden Shoe",
            "description": "Record holder for top goalscorer in European leagues across all competitions."
        },
        {
            "count": "45+",
            "title": "Total Trophies",
            "description": "The single most decorated football player in the entire history of the sport."
        },
        {
            "count": "1",
            "title": "FIFA World Cup",
            "description": "Crowned Champion in 2022, securing his legacy as the absolute greatest of all time."
        }
    ]
    
    with open('achievements.json', 'w', encoding='utf-8') as f:
        json.dump(achievements, f, indent=4)
        
    print("Achievements data compiled successfully.")

if __name__ == "__main__":
    generate_achievements()