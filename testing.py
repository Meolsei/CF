import aiohttp
import asyncio
from datetime import datetime

data = []

async def fetch_status():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://discordstatus.com/api/v2/status.json") as response:

            print("Status:", response.status)
            print("Content-type:", response.headers['content-type'])

            data = await response.json()
            
    updated_at = datetime.fromisoformat(data['page']['updated_at'])
    formatted_updated_at = updated_at.strftime("%b %d, %y @ %H:%M:%S")
    print(data['status']['description'] + " -- " + formatted_updated_at)

asyncio.run(fetch_status())