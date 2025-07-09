import aiohttp
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
import base64
import json
import time

useragent = os.getenv("E6-AGENT")
apikey = os.getenv("E6-KEY")
username = os.getenv("E6-USERNAME")

headers = {
"Authorization": "Basic " + base64.b64encode(f"{username}:{apikey}".encode()).decode(),
"User-Agent": f"{useragent}"
}

page = 1
search = "gardevoir"
index = 0

async def fetch_posts():
    async with aiohttp.ClientSession(headers=headers) as session:
        async with session.get(f"https://e621.net/posts.json?page={page}&tags={search}") as response:
            data = await response.json()
            global index

            while True:
                time.sleep(2.5)
                if index < len(data['posts']):
                    print(data['posts'][index]['id'])
                    index += 1
                else:
                    print("Too large!")
                    break


asyncio.run(fetch_posts())