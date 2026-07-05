import urllib.request
import json
import ssl
import os

def fetch_google_schedule():
    # Grabs the secret key from your GitHub Actions environment
    api_key = os.environ.get("SERPAPI_KEY")
    
    # Base fallback data for the Egypt game just in case the API hits a limit
    match_data = {
        "is_tribute": False,
        "home_team": "ARGENTINA",
        "home_logo": "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/1xBWyjjkA6vEWopPK3lIPA_500x500.png",
        "away_team": "EGYPT",
        "away_logo": "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/lYah1Uqw37XdicC6C4HNqg_500x500.png",
        "date": "JULY 7, 2026",
        "time": "12:00 PM (EST)",
        "league": "FIFA World Cup Round of 16 - Atlanta"
    }

    if not api_key:
        print("No Google Search API key provided. Using fallback data.")
    else:
        # Queries Google Search directly via the proxy
        url = f"https://serpapi.com/search.json?q=argentina+next+match&api_key={api_key}"
        context = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        
        try:
            with urllib.request.urlopen(req, context=context) as response:
                data = json.loads(response.read().decode())
                
            # Extract Google's Sports OneBox widget data
            sports_results = data.get("sports_results", {})
            games = sports_results.get("games", [])
            
            if games:
                next_game = games[0]
                teams = next_game.get("teams", [])
                
                if len(teams) == 2:
                    match_data.update({
                        "home_team": teams[0].get("name", "TBD").upper(),
                        "home_logo": teams[0].get("thumbnail", match_data["home_logo"]),
                        "away_team": teams[1].get("name", "TBD").upper(),
                        "away_logo": teams[1].get("thumbnail", match_data["away_logo"]),
                        "date": next_game.get("date", match_data["date"]).upper(),
                        "time": next_game.get("time", match_data["time"]),
                        "league": next_game.get("tournament", "FIFA World Cup")
                    })
        except Exception as e:
            print(f"Error fetching direct Google data: {e}. Using fallback.")

    with open('matches.json', 'w', encoding='utf-8') as f:
        json.dump(match_data, f, indent=4)
        
    print("Match schedule updated via Google Search successfully.")

if __name__ == "__main__":
    fetch_google_schedule()