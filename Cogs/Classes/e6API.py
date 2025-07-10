# ─── Standard Libraries ─────────────────────────────
import os
import json

# ─── Third-Party Packages ───────────────────────────
import aiohttp
import asyncio

from dotenv import load_dotenv
load_dotenv()

class e6API():
    def __init__(self):
        self.baseURL = "https://e621.net/posts.json"

        self.appName = os.getenv("APP_NAME")
        self.appVer = os.getenv("APP_VERSION")

        self.apiKey = os.getenv("E6_KEY")
        self.apiUser = os.getenv("E6_USERNAME")

        self.userAgent = f"{self.appName}/{self.appVer} (by {self.apiUser} on e621)"

        self.headers = {
            "User-Agent": self.userAgent
        }

        self.auth = (
            aiohttp.BasicAuth(self.apiUser, self.apiKey)
            if self.apiUser and self.apiKey else None
        )
        
    async def setup(self):
        self.session = aiohttp.ClientSession()

    async def close(self):
        await self.session.close()

    async def fetchPosts(self, search=None, page=1):
        url = self.baseURL

        params = {"page": page}

        if search:
            params["tags"] = search


        async with self.session.get(url=url, params=params, headers=self.headers, auth=self.auth) as response:
            if response.status != 200:
                raise Exception(f"Failed to fetch posts: {response.status}")
            

            data = await response.json()
            return data