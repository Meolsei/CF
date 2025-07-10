import discord
from discord import app_commands
from discord.ext import commands
from discord.ui import Button, View
import aiohttp
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()
import base64
import json

class Navi(discord.ui.View):
    def __init__(self, data):
        super().__init__()
        self.index = 0
        self.data = data
        self.post_url = self.data['posts'][self.index]['file']['url']
        self.tags = self.data['posts'][self.index]['tags']

        data2 = json.dumps(data, indent=4)

        for key, value in data2:
            print(key, value)

    def create_embed(self):
        embed = discord.Embed(
            title=f"Post by {self.data['posts'][self.index]['tags']['artist'][0]}",
            url=f"https://e621.net/posts/{self.data['posts'][self.index]['id']}/"
        )

        embed.set_author(
            name="e621.net",
            url="https://e621.net",
            icon_url="https://e621.net/favicon.ico"
        )

        embed.add_field(
            name="Tags:",
            value=f"{', '.join(self.data['posts'][self.index]['tags'])}",
            inline=False
        )

        if str(self.post_url).endswith(".webm") or str(self.post_url).endswith(".swf") or str(self.post_url).endswith(".apng"):
            embed.set_image(url=None)

            embed.add_field(
                name="Invalid Format",
                value=f"The file format cannot be embedded, click the artist name above.",
                inline=False
            )
        else:
            embed.set_image(url=self.post_url)
        return embed

    @discord.ui.button(label='Last Post', style=discord.ButtonStyle.gray)
    async def last_post(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index <= 0:
            self.index = len(self.data['posts']) - 1
        else:
            self.index -= 1

        self.post_url = self.data['posts'][self.index]['file']['url']
        embed = self.create_embed()

        await interaction.response.edit_message(view=self, embed=embed) 

    @discord.ui.button(label='Next Post', style=discord.ButtonStyle.gray)
    async def next_post(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.index >= len(self.data['posts']) - 1:
            self.index = 0
        else:
            self.index += 1

        self.post_url = self.data['posts'][self.index]['file']['url']
        embed = self.create_embed()

        await interaction.response.edit_message(view=self, embed=embed)

class NSFW(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
    
    def is_nsfw_channel(interaction: discord.Interaction):
        return interaction.channel and interaction.channel.is_nsfw()

    @app_commands.command(name="e621", description="Browse e621.net.")
    @app_commands.check(is_nsfw_channel)
    @app_commands.describe(search="Your search query.", page="The page number you want to go to.")
    async def e621(self, interaction: discord.Interaction, search: str, page: app_commands.Range[int, 1, 25]):
        await interaction.response.defer()

        useragent = os.getenv("E6-AGENT")
        apikey = os.getenv("E6-KEY")
        username = os.getenv("E6-USERNAME")

        headers = {
            "Authorization": "Basic " + base64.b64encode(f"{username}:{apikey}".encode()).decode(),
            "User-Agent": f"{useragent}"
        }

        async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(f"https://e621.net/posts.json?page={page}&tags=order:random+{search}") as response:
                self.data = await response.json()
                
                if not self.data['posts']:
                    await interaction.response.send_message("No posts found.")
                    return
                
                view = Navi(self.data)
                await interaction.followup.send(view=view, embed=view.create_embed())

    @e621.error
    async def e621_error(self, interaction: discord.Interaction, error: app_commands.AppCommandError):
        if isinstance(error, Exception):
            await interaction.followup.send(str(error))

async def setup(bot):
    await bot.add_cog(NSFW(bot))