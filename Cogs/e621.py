# ─── Standard Libraries ─────────────────────────────
import os
import json

# ─── Third-Party Packages ───────────────────────────
import aiohttp
import asyncio

from dotenv import load_dotenv
load_dotenv()

# ─── Discord ──────────────────────────────────────── 
import discord
from discord.ext import commands
from discord import app_commands

from Cogs.Classes.e6API import e6API
from Cogs.Classes.navigationHandler import Navigation
from Cogs.Classes.userDataHandler import userData

class e621(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.user_data = userData(file_path="userData.json")

        self.index = 0
        self.data = None
        self.api = e6API()
        self.nav = None

    @app_commands.command(name="add_blocked_tag")
    @app_commands.describe(tag = "The tag you wish to block.")
    async def add_blocked_tag(self, interaction: discord.Interaction, tag: str):
        user_id = str(interaction.user.id)
        added = self.user_data.add_blocked_tag(user_id, tag)

        if added:
            await interaction.response.send_message(f"Added {tag} to your blocked tags.", ephemeral=True)
        else:
            await interaction.response.send_message(f"{tag} is already in your blocked tags. You can remove it with /remove_blocked_tag.", ephemeral=True)

    @app_commands.command(name="remove_blocked_tag")
    @app_commands.describe(tag = "The tag you wish to unblock.")
    async def remove_blocked_tag(self, interaction: discord.Interaction, tag: str):
        user_id = str(interaction.user.id)
        blocked_tags = self.user_data.get_blocked_tags(user_id)

        if tag in blocked_tags:
            blocked_tags.remove(tag)
            data = self.user_data.load_data()
            data[user_id]["blocked_tags"] = blocked_tags
            self.user_data.save_data(data)
            await interaction.response.send_message(f"Remove {tag} from your blocked tags.", ephemeral=True)
        else:
            await interaction.response.send_message(f"{tag} wasn't found in your blocked tags.", ephemeral=True)


    @app_commands.command()
    @app_commands.describe(search = "Tags you want to search for.", page = "What page you want to start on.")
    async def e621(self, interaction: discord.Interaction, search: str, page: app_commands.Range[int, 1, 25]):
        await self.api.setup()

        user_id = str(interaction.user.id)
        blocked_tags = self.user_data.get_blocked_tags(user_id)

        for tag in blocked_tags:
            # Remove all occurrences of the blocked tag from the search string
            search = ' '.join(t for t in search.split() if t != tag and t != f"-{tag}")
            # Add the negative tag to exclude it explicitly
            search += f" -{tag}"

        self.data = await self.api.fetchPosts(search=search, page=page)
        self.index = 0

        self.nav = Navigation(self.data, self.index)

        await interaction.response.send_message(
            embed=self.nav.createEmbed(),
            view=self.nav
        )

        await self.api.close()

async def setup(bot):
    await bot.add_cog(e621(bot))