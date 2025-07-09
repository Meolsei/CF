import discord
from discord import app_commands
from discord.ext import commands
import aiohttp
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

class NSFW(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def main(target_url, headers):

        async with aiohttp.ClientSession(headers=headers) as session:
            async with session.get(target_url) as response:
                json = await response.json()
                print(json)

    def is_nsfw_channel(interaction: discord.Interaction):
        return interaction.channel and interaction.channel.is_nsfw()

    @app_commands.command(name="e621", description="Browse e621.net. Only works in NSFW channels.")
    @app_commands.check(is_nsfw_channel)
    
    async def e621(self, interaction: discord.Interaction):
        await interaction.response.send_message("Test")

    @e621.error
    async def test_error(self, interaction: discord.Interaction, error: app_commands.AppCommandError):
        if isinstance(error, app_commands.CheckFailure):
            await interaction.response.send_message("This command can only be used in NSFW channels.", ephemeral=True)

async def setup(bot):
    await bot.add_cog(NSFW(bot))