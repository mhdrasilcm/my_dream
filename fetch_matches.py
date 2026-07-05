import urllib.request
import json
import ssl
from datetime import datetime

def fetch_schedule():
    # ESPN API tracking the Argentina National Team (ID: 202)
    url = "https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/202/schedule"
    context = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    current_date = datetime.now()
    wc_end_date = datetime(2026, 7, 20) # Cutoff: Day after the WC Final
    
    try:
        with urllib.request.urlopen(req, context=context) as response:
            data = json.loads(response.read().decode())
            
        events = data.get('events', [])
        
        # Hunt for the next upcoming event
        next_event = None
        for event in events:
            event_date = datetime.strptime(event['date'], "%Y-%m-%dT%H:%M:%SZ")
            if event_date > current_date:
                next_event = event
                break
                
        # Trigger Condition: No future matches found (Eliminated) OR Tournament is over
        if not next_event or current_date > wc_end_date:
            match_data = {
                "is_tribute": True,
                "title": "WORLD CUP CHAMPION",
                "message": "Lionel Messi's historic FIFA World Cup legacy is eternal."
            }
        else:
            competition = next_event['competitions'][0]
            competitors = competition['competitors']
            
            home_team = next((team for team in competitors if team['homeAway'] == 'home'), None)
            away_team = next((team for team in competitors if team['homeAway'] == 'away'), None)
            
            dt_obj = datetime.strptime(next_event['date'], "%Y-%m-%dT%H:%M:%SZ")
            formatted_date = dt_obj.strftime("%b %d, %Y").upper()
            formatted_time = dt_obj.strftime("%I:%M %p (UTC)")
            
            match_data = {
                "is_tribute": False,
                "home_team": home_team['team']['displayName'].upper(),
                "home_logo": home_team['team']['logos'][0]['href'],
                "away_team": away_team['team']['displayName'].upper(),
                "away_logo": away_team['team']['logos'][0]['href'],
                "date": formatted_date,
                "time": formatted_time,
                "league": next_event['season']['displayName']
            }
            
    except Exception as e:
        print(f"Error fetching data. Defaulting to Legacy Mode: {e}")
        # Bulletproof fallback ensures site never crashes, just reverts to the golden trophy
        match_data = {
            "is_tribute": True,
            "title": "WORLD CUP CHAMPION",
            "message": "Lionel Messi's historic FIFA World Cup legacy is eternal."
        }
        
    with open('matches.json', 'w', encoding='utf-8') as f:
        json.dump(match_data, f, indent=4)
        
    print("Match schedule / Tribute logic compiled successfully.")

if __name__ == "__main__":
    fetch_schedule()