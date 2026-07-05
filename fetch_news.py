import urllib.request
import xml.etree.ElementTree as ET
import json
import ssl

def fetch_latest_news():
    # Focused query: Messi, his wife, and his teams.
    query = '"Lionel+Messi"+OR+"Antonela+Roccuzzo"+OR+"Inter+Miami"+OR+"Argentina+National+Team"'
    url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    
    context = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req, context=context) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        news_items = []
        
        for item in root.findall('.//item')[:12]: # Get top 12 for a nice grid
            title = item.find('title').text
            link = item.find('link').text
            pubDate = item.find('pubDate').text
            
            news_items.append({
                'title': title,
                'link': link,
                'pubDate': pubDate
            })
            
        with open('news.json', 'w', encoding='utf-8') as f:
            json.dump(news_items, f, indent=4, ensure_ascii=False)
            
        print(f"Successfully scraped {len(news_items)} news articles.")
        
    except Exception as e:
        print(f"Error fetching news: {e}")

if __name__ == "__main__":
    fetch_latest_news()