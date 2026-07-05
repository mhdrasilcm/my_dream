import urllib.request
import json
import ssl
from datetime import datetime

def fetch_schedule():
    # ESPN's public API for Inter Miami (Team ID: 10739)
    url = "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/teams/10739/schedule"
    context = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req, context=context) as response:
            data = json.loads(response.read().decode())
            
        # Extract the very next event
        next_event = data['events'][0]
        competition = next_event['competitions'][0]
        competitors = competition['competitors']
        
        # Sort out who is home and who is away
        home_team = next((team for team in competitors if team['homeAway'] == 'home'), None)
        away_team = next((team for team in competitors if team['homeAway'] == 'away'), None)
        
        # Format the date and time
        raw_date = next_event['date']
        dt_obj = datetime.strptime(raw_date, "%Y-%m-%dT%H:%M:%SZ")
        formatted_date = dt_obj.strftime("%b %d, %Y").upper()
        formatted_time = dt_obj.strftime("%I:%M %p (UTC)")
        
        match_data = {
            "home_team": home_team['team']['displayName'].upper(),
            "home_logo": home_team['team']['logos'][0]['href'],
            "away_team": away_team['team']['displayName'].upper(),
            "away_logo": away_team['team']['logos'][0]['href'],
            "date": formatted_date,
            "time": formatted_time,
            "league": next_event['season']['displayName']
        }
        
    except Exception as e:
        print(f"Error fetching live data, using fallback: {e}")
        # Bulletproof fallback so the site never crashes
        match_data = {
            "home_team": "INTER MIAMI CF",
            "home_logo": "https://ssl.gstatic.com/onebox/media/sports/logos/optimized/qbqMtgzKCYVxZMzcB4iQqQ_500x500.png",
            "away_team": "TBD",
            "away_logo": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3C/svg%3E",
            "date": "CHECKING SCHEDULE",
            "time": "--:--",
            "league": "MLS Regular Season"
        }
        
    with open('matches.json', 'w', encoding='utf-8') as f:
        json.dump(match_data, f, indent=4)
        
    print("Match schedule updated successfully.")

if __name__ == "__main__":
    fetch_schedule()